import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useStore } from 'src/stores/store'; // vi.mock calls are hoisted above this

// Fake Firebase: one logged-in user, a ledger and one sheet doc.
const fake = vi.hoisted(() => ({ currentUser: null, docs: {} }));

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
      onNext({ exists: () => data !== undefined, data: () => data });
    }
    return () => {};
  },
  setDoc: async () => {},
  getDoc: async () => ({}),
  deleteField: () => null,
  writeBatch: () => ({ update() {}, set() {}, commit: async () => {} }),
}));

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
