import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { Notify } from 'quasar';
import { useStore } from 'src/stores/store'; // vi.mock calls are hoisted above this
import { currentVersion } from 'src/models/schema';

// Fake Firebase: one logged-in user, a ledger and one sheet doc.
const fake = vi.hoisted(() => ({ currentUser: null, docs: {}, writes: [] }));

vi.mock('firebase/app', () => ({
  initializeApp: () => ({}),
  deleteApp: async () => {},
  getApps: () => [],
}));

vi.mock('firebase/auth', () => {
  const auth = {
    get currentUser() {
      return fake.currentUser;
    },
    authStateReady: async () => {},
    onAuthStateChanged: (cb) => {
      queueMicrotask(() => cb(fake.currentUser)); // async, like Firebase
      return () => {};
    },
    signOut: async () => {
      fake.currentUser = null;
    },
  };
  return {
    getAuth: () => auth,
    signInWithEmailAndPassword: async () => {},
    createUserWithEmailAndPassword: async () => {},
    sendEmailVerification: async () => {},
    sendPasswordResetEmail: async () => {},
  };
});

vi.mock('firebase/firestore', () => ({
  initializeFirestore: () => ({}),
  persistentLocalCache: () => ({}),
  persistentMultipleTabManager: () => ({}),
  doc: (db, collection, id) => `${collection}/${id}`,
  onSnapshot: (ref, onNext, onError) => {
    const data = fake.docs[ref];
    if (data === 'denied') {
      onError(new Error('permission-denied'));
    } else {
      // like Firestore: every snapshot hands out a fresh copy
      onNext({
        id: ref.split('/')[1],
        exists: () => data !== undefined,
        data: () => structuredClone(data),
      });
    }
    return () => {};
  },
  setDoc: async () => {},
  getDoc: async () => ({}),
  deleteField: () => null,
  writeBatch: () => ({
    update: (ref, data) => fake.writes.push({ path: ref, data }),
    set: (ref, data) => fake.writes.push({ path: ref, data }),
    commit: async () => {},
  }),
}));

vi.mock('quasar', () => ({ Notify: { create: vi.fn() } }));

vi.mock('src/models/config', () => ({
  default: { make: () => ({ fake: true }), isCompatible: () => true },
}));

const SHEET_ID = 'sheet-1';

// What the persisted state looks like when the app is reopened
const reopenApp = () => {
  setActivePinia(createPinia());
  const store = useStore();
  store.conversionRatesAutoUpdateRate = 0; // no network in tests
  store.currentSheetId = SHEET_ID;
  return store;
};

describe('reopening the app restores the last open sheet', () => {
  beforeEach(() => {
    fake.currentUser = { uid: 'me' };
    fake.docs = {
      'users/me': { friends: {}, sheets: {} },
      [`sheets/${SHEET_ID}`]: { id: SHEET_ID, users: { me: true } },
    };
  });

  it('keeps and loads the remembered sheet through init()', async () => {
    const store = reopenApp();
    await store.init();

    expect(store.isReady()).toBe(true);
    expect(store.currentSheetId).toBe(SHEET_ID);
    expect(store.isSheet).toBe(true);
  });

  it('forgets the sheet when the user is not logged in', async () => {
    fake.currentUser = null;
    const store = reopenApp();
    await store.init();

    expect(store.isSheet).toBe(false);
    expect(store.currentSheetId).toBeNull();
  });

  it('falls back to no sheet when it was deleted meanwhile', async () => {
    delete fake.docs[`sheets/${SHEET_ID}`];
    const store = reopenApp();
    await store.init();

    expect(store.isSheet).toBe(false);
    expect(store.currentSheetId).toBeNull();
  });

  it('falls back to no sheet when access was revoked', async () => {
    fake.docs[`sheets/${SHEET_ID}`] = 'denied';
    const store = reopenApp();
    await store.init();

    expect(store.isSheet).toBe(false);
    expect(store.currentSheetId).toBeNull();
  });

  it('does not reopen the previous sheet after a fresh login', async () => {
    const store = reopenApp();
    await store.init();
    await store.login('someone@else', 'password');

    expect(store.currentSheetId).toBeNull();
  });
});

describe('old data repaired on read is notified once per sheet per session', () => {
  // v0 sheet with one legacy transaction whose payer is missing
  const brokenSheet = (id) => ({
    id,
    name: `Sheet ${id}`,
    users: { me: 'owner' },
    people: { me: { id: 'me', name: 'Me', timestamp: 1 } },
    transactions: {
      t1: {
        id: 't1',
        name: 'Dinner',
        currency: 'EUR',
        amount: 10,
        debts: [10],
      },
    },
  });

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    Notify.create.mockClear();
    fake.currentUser = { uid: 'me' };
    fake.docs = {
      'users/me': { friends: {}, sheets: {} },
      'sheets/broken-1': brokenSheet('broken-1'),
      'sheets/broken-2': brokenSheet('broken-2'),
    };
  });

  it('repairs the data, notifies once per sheet, and logs every time', async () => {
    const store = reopenApp();
    await store.init();

    await store.subscribeCurrentSheet('broken-1');
    expect(store.currentSheet.transactions.t1.credits).toEqual([10]);
    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create.mock.calls[0][0].caption).toBe(
      '"Dinner": payer unknown, 10 EUR assigned to Me',
    );

    // same sheet again (stored data is still v0): no second notification
    await store.subscribeCurrentSheet('broken-1');
    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(2);

    // another sheet: its own notification
    await store.subscribeCurrentSheet('broken-2');
    expect(Notify.create).toHaveBeenCalledTimes(2);
  });
});

describe('version gate (#42)', () => {
  const sheet = (schemaVersion) => ({
    id: SHEET_ID,
    name: 'Trip',
    schemaVersion,
    users: { me: 'owner' },
    people: {},
    transactions: {},
  });

  beforeEach(() => {
    fake.currentUser = { uid: 'me' };
    fake.writes = [];
    fake.docs = {
      'users/me': { friends: {}, sheets: {} },
      [`sheets/${SHEET_ID}`]: sheet(currentVersion('sheets')),
    };
  });

  it('is not outdated with data at its own version', async () => {
    const store = reopenApp();
    await store.init();
    expect(store.isOutdated).toBe(false);
  });

  it('blocks writes after reading a newer sheet', async () => {
    fake.docs[`sheets/${SHEET_ID}`] = sheet(currentVersion('sheets') + 1);
    const store = reopenApp();
    await store.init();

    expect(store.isOutdated).toBe(true);
    await expect(store.addTransaction({ id: 't1' })).rejects.toThrow(
      'outdated',
    );
    expect(fake.writes).toEqual([]);
  });

  it('is outdated after reading a newer sheet, and still opens it', async () => {
    // a member not yet in the ledger's friends: opening normally adds them
    fake.docs[`sheets/${SHEET_ID}`] = {
      ...sheet(currentVersion('sheets') + 1),
      users: { me: 'owner', bob: 'owner' },
    };
    const store = reopenApp();
    await store.init();

    expect(store.isOutdated).toBe(true);
    expect(store.isSheet).toBe(true);
    expect(fake.writes).toEqual([]); // no friends added
  });

  it('forgets newer data on logout', async () => {
    fake.docs[`sheets/${SHEET_ID}`] = sheet(currentVersion('sheets') + 1);
    const store = reopenApp();
    await store.init();
    store.clearAll();

    expect(store.isOutdated).toBe(false);
  });
});
