import { defineStore } from 'pinia';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteField,
  runTransaction,
} from 'firebase/firestore';
// import { db, auth } from "src/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { initializeApp, deleteApp, getApps } from 'firebase/app';
import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  writeBatch,
} from 'firebase/firestore';

import Sheet from 'src/models/sheet';
import UserLedger from 'src/models/userLedger';
import Transaction from 'src/models/transaction';
import Results from 'src/models/results';
import Person from 'src/models/person';
import Utils from 'src/utils/utils';
import Config from 'src/models/config';
import _ from 'lodash';

// keep these not-reactive and out of the store!
let app = null;
let auth = null;
let db = null;
// keep these not-reactive and out of the store!

export const useStore = defineStore('mainStore', {
  state: () => ({
    transactionId: null,
    currentSheetId: null,

    userLedger: null,
    currentSheet: null,

    // firebase
    firebaseReady: false,
    authReady: false,
    config: Config.make(),
    pendingTransactionIds: new Set(),

    // listeners
    unsubscribeUserLedger: null,
    unsubscribeCurrentSheet: null,
    onlineHandler: null,
  }),

  getters: {
    isSheet() {
      return this.currentSheet !== null;
    },

    currencies() {
      if (this.currentSheet) {
        return new Set(Results.getCurrencies(this.currentSheetResults));
      }
      return new Set();
    },

    lastCurrency() {
      if (this.currentSheet && this.currentSheetTransactions?.length) {
        return this.currentSheet.transactions[this.currentSheetTransactions[0]]
          .currency;
      }
      return 'USD';
    },

    user() {
      return Person.makeUser(
        auth?.currentUser?.uid,
        this.userLedger?.name,
        auth?.currentUser?.email,
        auth?.currentUser?.emailVerified,
      );
    },

    userLedgerFriends() {
      if (!this.userLedger || !this.userLedger.friends) {
        return [];
      }
      // Use Object.entries to get key-value pairs
      return Object.entries(this.userLedger.friends)
        .sort(([, personA], [, personB]) => Person.compare(personA, personB)) // Sort based on the Person objects
        .map(([id]) => id); // Return just the sorted keys (IDs)
    },

    userLedgerSheets() {
      if (!this.userLedger || !this.userLedger.sheets) {
        return [];
      }
      return Object.entries(this.userLedger.sheets)
        .sort(([, sheetA], [, sheetB]) => sheetA.timestamp - sheetB.timestamp) // Sort by timestamp
        .map(([id]) => id);
    },

    currentSheetPeople() {
      if (!this.currentSheet || !this.currentSheet.people) {
        return [];
      }
      return Object.entries(this.currentSheet.people)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp) // Sort by timestamp (descending)
        .map(([id]) => id); // Extract the keys (IDs)
    },

    currentSheetTransactions() {
      if (!this.currentSheet || !this.currentSheet.transactions) {
        return [];
      }
      return Object.entries(this.currentSheet.transactions)
        .sort(([, a], [, b]) => b.timestamp - a.timestamp) // Sort by timestamp (ascending)
        .map(([id]) => id); // Extract the keys (IDs)
    },

    currentSheetResults() {
      if (
        !this.currentSheet ||
        !this.currentSheet.transactions ||
        !this.currentSheetPeople
      ) {
        return [];
      }
      return Results.make(
        this.currentSheet.transactions,
        this.currentSheetPeople.length || 0,
      );
    },
  },
  actions: {
    // transaction

    personId2Idx(id) {
      return this.currentSheetPeople.indexOf(id);
    },

    personIdx2Id(idx) {
      return this.currentSheetPeople[idx];
    },

    async addTransaction(transaction, batch = null) {
      console.log('nav online', navigator.onLine);
      if (!navigator.onLine) {
        this.pendingTransactionIds.add(transaction.id);
      }
      return await this.autoBatch(
        async (transaction, batch) => {
          await this.removeTransaction(this.transactionId, batch);
          const sheetRef = this.getSheetRef(this.currentSheet.id);
          batch.update(sheetRef, {
            [`transactions.${transaction.id}`]: transaction,
          });
        },
        transaction,
        batch,
      );
    },

    async removeTransaction(id, batch = null) {
      if (!id) {
        return;
      }
      return await this.autoBatch(
        async (id, batch) => {
          const sheetRef = this.getSheetRef(this.currentSheet.id);
          batch.update(sheetRef, { [`transactions.${id}`]: deleteField() });
        },
        id,
        batch,
      );
    },

    async addTransactions(transactions, batch = null) {
      return await this.autoBatch(
        async (transactions, batch) => {
          // Loop over the transaction values directly
          for (const transaction of Object.values(transactions)) {
            await this.addTransaction(transaction, batch);
          }
        },
        transactions,
        batch,
      );
    },

    // sheet

    getEditableCurrentSheetResults() {
      return _.cloneDeep(this.currentSheetResults);
    },

    makeEquivalentTransactionBatch(
      fromCurrency,
      payerIdx,
      msg,
      multiplier = 1.0,
      toCurrency = null,
    ) {
      return Results.makeEquivalentTransactionBatch(
        this.currentSheetResults,
        fromCurrency,
        payerIdx,
        msg,
        multiplier,
        toCurrency,
      );
    },

    async settleCurrencyPerson(currency, personIdx, msg) {
      const transactions = this.makeEquivalentTransactionBatch(
        currency,
        personIdx,
        msg,
      );

      try {
        await this.addTransactions(transactions);
      } catch (error) {
        $q.notify({
          message: error.message || error,
          color: 'negative',
        });
      }
    },

    async setPeople(people, batch = null) {
      if (!this.currentSheet) {
        throw new Error('Current sheet should be set here.');
      }

      const users = Object.fromEntries(
        Object.keys(people)
          .filter((id) => this.isUserOrFriend(id))
          .map((id) => [id, 'owner']),
      );

      const addUsers = Object.keys(users).filter(
        (id) => !(id in this.currentSheet.users),
      );

      return await this.autoBatch(
        async (people, users, addUsers, batch) => {
          const sheetLedger = {
            name: this.currentSheet.name,
            timestamp: this.currentSheet.timestamp,
          };
          addUsers.forEach((id) => {
            const userLedgerRef = this.getUserLedgerRef(id);
            batch.update(userLedgerRef, {
              [`sheets.${this.currentSheet.id}`]: sheetLedger,
            });
          });

          const sheetRef = this.getSheetRef(this.currentSheet.id);
          batch.update(sheetRef, {
            [`users`]: users,
          });
          batch.update(sheetRef, {
            [`people`]: people,
          });
        },
        people,
        users,
        addUsers,
        batch,
      );
    },

    getEditableTransaction(id = this.transactionId) {
      if (this.currentSheet && id in this.currentSheet.transactions) {
        const ans = _.cloneDeep(this.currentSheet.transactions[id]);
        Transaction.updatePeople(ans, this.currentSheetPeople.length);
        return ans;
      }

      // Extract peopleActive as an array of booleans
      const peopleActive = this.currentSheetPeople.map(
        (personid) => this.currentSheet.people[personid].active,
      );

      return Transaction.make(
        peopleActive,
        this.lastCurrency,
        this.personId2Idx(auth.currentUser.uid),
      );
    },

    async setSheetName(newName, batch = null) {
      return await this.autoBatch(
        async (newName, batch) => {
          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, {
            [`sheets.${this.currentSheet.id}.name`]: newName,
          });
        },
        newName,
        batch,
      );
    },

    getName(id, people = null) {
      if (id === this.user.id) {
        return Person.username(this.user);
      }
      if (id in this.userLedger.friends) {
        return Person.username(this.userLedger.friends[id]);
      }
      if (people === null) {
        people = this.currentSheet?.people;
      }
      return Person.username(people[id]);
    },

    isCaption(id, people = null) {
      if (id === this.user.id) {
        return !!this.user.name;
      }
      if (id in this.userLedger?.friends) {
        return !!this.userLedger.friends[id].name;
      }

      if (people === null) {
        people = this.currentSheet?.people;
      }
      return !!people[id]?.name;
    },

    getEmail(id, people = null) {
      if (id === this.user.id) {
        return this.user.email;
      }
      if (id in this.userLedger?.friends) {
        return this.userLedger.friends[id].email;
      }
      if (people === null) {
        people = this.currentSheet?.people;
      }
      return people[id]?.email;
    },

    isPersonFullyRemovable(id) {
      if (id === this.user.id) {
        return false;
      }
      if (!this.currentSheet) {
        return true;
      }
      if (id in this.currentSheet.users) {
        return false;
      }

      const idx = this.currentSheetPeople.indexOf(id);
      if (idx === -1) {
        // the person was added recently but not yet added completely
        return true;
      }

      return Object.values(this.currentSheet.transactions).every(
        (obj) => idx >= obj.debts.length,
      );
    },

    // user ledger
    async addSheetFromNameAndPeople(name, people, batch = null) {
      const users = Object.fromEntries(
        Object.keys(people)
          .filter((id) => this.isUserOrFriend(id))
          .map((id) => [id, 'owner']),
      );
      const newSheet = Sheet.make(name, people, users);
      await this.autoBatch(
        async (newSheet, batch) => {
          await this.addSheet(newSheet, batch);
        },
        newSheet,
        batch,
      );
      return newSheet;
    },

    async removeSheet(id, nUsers, batch = null) {
      return await this.autoBatch(
        async (id, nUsers, batch) => {
          const sheetRef = this.getSheetRef(id);
          if (nUsers <= 1) {
            batch.delete(sheetRef);
          } else {
            batch.update(sheetRef, {
              [`users.${auth.currentUser.uid}`]: deleteField(),
            });
            batch.update(sheetRef, {
              [`people.${auth.currentUser.uid}.active`]: false,
            });
          }

          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, { [`sheets.${id}`]: deleteField() });
        },
        id,
        nUsers,
        batch,
      );
    },

    async nUsers(id) {
      const sheetRef = this.getSheetRef(id);
      const doc = await getDoc(sheetRef);
      if (!doc.exists) {
        throw new Error(`Document ${id} does not exist!`);
      }
      return Object.keys(doc.data().users).length;
    },

    async addSheet(newSheet, batch = null) {
      return await this.autoBatch(
        async (newSheet, batch) => {
          const sheetLedger = {
            name: newSheet.name,
            timestamp: newSheet.timestamp,
          };
          Object.keys(newSheet.users).forEach((id) => {
            const userLedgerRef = this.getUserLedgerRef(id);
            batch.update(userLedgerRef, {
              [`sheets.${newSheet.id}`]: sheetLedger,
            });
          });

          const sheetRef = this.getSheetRef(newSheet.id);
          batch.set(sheetRef, newSheet);
        },
        newSheet,
        batch,
      );
    },

    isUserOrFriend(id) {
      return id === auth.currentUser.uid || id in this.userLedger.friends;
    },

    async removeFriend(id, batch = null) {
      if (!(id in this.userLedger.friends)) {
        throw new Error('This user is not your friend!');
      }
      return await this.autoBatch(
        async (id, batch) => {
          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, {
            [`friends.${id}`]: deleteField(),
          });
        },
        id,
        batch,
      );
    },

    async setFriendName(newName, id, batch = null) {
      if (!(id in this.userLedger.friends)) {
        return;
      }
      return await this.autoBatch(
        async (newName, id, batch) => {
          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, {
            [`friends.${id}.name`]: newName,
          });
        },
        newName,
        id,
        batch,
      );
    },

    async addFriend(newFriend, batch = null) {
      if (newFriend.id in this.userLedger.friends) {
        throw new Error('This user is already a friend!');
      }
      if (newFriend.id === auth.currentUser.uid) {
        throw new Error('You cannot add youself as friend!');
      }

      return await this.autoBatch(
        async (newFriend, batch) => {
          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, {
            [`friends.${newFriend.id}`]: newFriend,
          });

          // const userLedgerRef2 = this.getUserLedgerRef(newFriend.id);
          // batch.update(userLedgerRef2, {
          //   [`friends.${auth.currentUser.uid}`]: this.user,
          // });
        },
        newFriend,
        batch,
      );
    },

    // admin

    isReady() {
      return this.firebaseReady && this.authReady && !!this.userLedger;
    },

    async setUsername(newName, batch = null) {
      return await this.autoBatch(
        async (newName, batch) => {
          const userLedgerRef = this.getUserLedgerRef();
          batch.update(userLedgerRef, {
            [`name`]: newName,
          });
        },
        newName,
        batch,
      );
    },

    async init() {
      this.setupOnlineListener();
      if (app === null) {
        await this.initFirebase();
      }

      if (app === null) {
        return false;
      }

      await auth?.authStateReady();
      if (auth?.currentUser && !this.userLedger) {
        await this.subscribeUserLedger();
      }

      if (this.currentSheetId) {
        await this.subscribeCurrentSheet(this.currentSheetId);
      }
    },

    setConfig(newConfig) {
      if (!Config.isCompatible(newConfig)) {
        throw new Error('fbConfig not compatible!');
      }
      this.config = newConfig;
    },

    async initFirebase() {
      if (!Config.isCompatible(this.config)) return;

      // Clear any existing instance
      await this.clearFirebase();

      // Prevent double init
      if (getApps().length > 0) {
        this.firebaseReady = true;
        return;
      }

      // Initialize app, auth, and offline Firestore
      app = initializeApp(this.config);
      auth = getAuth(app);
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });

      // Track readiness
      this.firebaseReady = true;

      // Ensure auth state is ready, but do not load any ledger
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(() => {
          this.authReady = true;
          unsubscribe();
          resolve();
        });
      });
    },

    async clearFirebase() {
      await this.logout();
      db = null;

      if (app) {
        await deleteApp(app);
      }
      auth = null;
      app = null;
    },

    async logout() {
      this.clearUserLedger();
      if (auth?.currentUser) {
        await auth?.signOut();
      }
    },

    async login(username, password) {
      this.logout();
      if (app === null) {
        await this.initFirebase();
      }
      await auth.authStateReady?.(); // optional chaining for safety

      await signInWithEmailAndPassword(auth, username, password);
    },

    async register(email, password) {
      await this.logout();

      if (!this.isFirebaseReady) {
        await this.initFirebase();
      }

      // Optionally wait for Firebase to finish initializing auth state
      await auth.authStateReady?.();
      await createUserWithEmailAndPassword(auth, email, password);

      const userLedgerRef = this.getUserLedgerRef();
      await setDoc(userLedgerRef, UserLedger.make());
    },

    async sendVerificationEmail() {
      await sendEmailVerification(auth.currentUser);
    },

    async resetPassword(email) {
      await sendPasswordResetEmail(auth, email); // Send password reset email
    },

    setupOnlineListener() {
      if (this.onlineHandler) {
        return;
      }
      const clearPending = () => {
        this.pendingTransactionIds.clear();
      };

      window.addEventListener('online', clearPending);

      // Store reference to the handler for later removal
      this.onlineHandler = clearPending;
    },

    disposeOnlineListener() {
      if (this.onlineHandler) {
        window.removeEventListener('online', this.onlineHandler);
        this.onlineHandler = null;
      }
    },

    clearAll() {
      this.clearUserLedger();
      this.clearCurrentSheet();
      this.disposeOnlineListener();
    },

    clearUserLedger() {
      this.unsubscribeUserLedger?.();
      this.unsubscribeUserLedger = null;
      this.userLedger = null;
    },

    async subscribeUserLedger() {
      this.clearUserLedger();

      let returnPromise = true;
      await new Promise((resolve) => {
        const userLedgerRef = this.getUserLedgerRef();
        this.unsubscribeUserLedger = onSnapshot(userLedgerRef, (doc) => {
          if (doc.exists()) {
            this.userLedger = doc.data();
          }
          if (returnPromise) {
            returnPromise = false;
            resolve();
          }
        });
      });
    },

    clearCurrentSheet() {
      this.unsubscribeCurrentSheet?.();
      this.unsubscribeCurrentSheet = null;
      this.currentSheet = null;
      this.currentSheetId = null;
    },

    async subscribeCurrentSheet(id) {
      this.clearCurrentSheet();

      let returnPromise = true;
      await new Promise((resolve) => {
        const sheetRef = this.getSheetRef(id);
        this.unsubscribeCurrentSheet = onSnapshot(sheetRef, async (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            this.currentSheet = data;
          }

          await this.updateFriends();

          if (returnPromise) {
            returnPromise = false;
            resolve();
          }
        });
      });

      this.currentSheetId = this.currentSheet.id || null;
    },

    async updateFriends(batch = null) {
      // Get IDs that are in `currentUsers` but not in `existingFriends`
      const newFriendIds = Object.keys(this.currentSheet.users).filter((id) => {
        return !(id in this.userLedger.friends) && id !== auth.currentUser.uid;
      });
      if (!newFriendIds.length) {
        return;
      }

      // Create a list of new friends with { id, name, email } from `this.currentSheet.people`
      const newFriends = newFriendIds.map((id) => ({
        id,
        name: this.currentSheet.people[id]?.name,
        email: this.currentSheet.people[id]?.email,
      }));

      await this.autoBatch(
        async (newFriends, batch) => {
          for (const friend of newFriends) {
            await this.addFriend(friend, batch);
          }
        },
        newFriends, // Pass `newFriends` correctly
        batch,
      );
    },

    // docs

    getUserLedgerRef(id = null) {
      if (!id) {
        id = auth.currentUser.uid;
      }
      return doc(db, 'users', id);
    },

    getSheetRef(id) {
      return doc(db, 'sheets', id);
    },

    // utils
    async autoBatch(fn, ...args) {
      const isStandalone = !args[args.length - 1];
      if (isStandalone) {
        args[args.length - 1] = writeBatch(db);
      }

      // Run the user function (which modifies the batch)
      const result = await fn.apply(this, args);

      if (isStandalone) {
        const batch = args[args.length - 1];

        // Fire-and-forget the commit without awaiting it,
        // but return the commit Promise so caller can catch errors
        batch.commit();
      }

      // Return result immediately without waiting for commit to finish
      return result;
    },
  },

  persist: {
    key: 'sessionData',
    pick: [
      'config',
      'currentSheetId',
      'transactionId',
      'pendingTransactionIds',
    ],
    serializer: {
      serialize: (state) =>
        JSON.stringify({
          ...state,
          pendingTransactionIds: Array.from(state.pendingTransactionIds),
        }),
      deserialize: (raw) => {
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          pendingTransactionIds: new Set(parsed.pendingTransactionIds),
        };
      },
    },
  },
});
