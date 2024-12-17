import { defineStore } from "pinia";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  deleteField,
  increment,
} from "firebase/firestore";
// import { db, auth } from "src/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { initializeApp, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  writeBatch,
} from "firebase/firestore";

import Sheet from "src/models/sheet";
import Transaction from "src/models/transaction";
import Results from "src/models/results";
import Person from "src/models/person";
import Utils from "src/utils/utils";
import _ from "lodash";

let fbApp = null;
let fbAuth = null;
let fbDb = null;

export const useStore = defineStore("mainStore", {
  state: () => ({
    // router
    transactionId: null,

    // local cache and admin
    fbLedger: null,
    currentSheet: null,

    // firebase
    fbConfig: null,
    fbAuth: null,

    // listeners
    unsubscribeToFbLedger: null,
    unsubscribeToCurrentSheet: null,
  }),

  getters: {
    users() {
      if (!this.fbLedger || !this.fbLedger.users) {
        return [];
      }
      return Object.keys(this.fbLedger.users).sort((a, b) =>
        this.username(a).localeCompare(this.username(b))
      );
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
        this.currentSheetPeople.length || 0
      );
    },

    currentSheetLedger() {
      return this.fbLedger?.sheets?.[this.currentSheet?.id] || {};
    },

    sheetId() {
      return this.currentSheet?.id || null;
    },

    userSheets() {
      if (fbAuth.currentUser && this.fbLedger) {
        const result = Object.keys(
          this.fbLedger.users[fbAuth.currentUser.uid].sheets
        )
          .map((id) => ({
            id,
            name: this.fbLedger.sheets[id].name,
            timestamp: this.fbLedger.sheets[id].timestamp,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        return result;
      }
      return [];
    },

    lastCurrency() {
      if (this.currentSheet && this.currentSheetTransactions?.length) {
        return this.currentSheet.transactions[this.currentSheetTransactions[0]]
          .currency;
      }
      return "USD";
    },
  },

  actions: {
    // person

    username(id = null) {
      if (!id) {
        id = fbAuth.currentUser?.uid;
      }
      if (!this.fbLedger || !id) {
        return "";
      }

      if (id in this.fbLedger.users) {
        return Utils.truncate(
          this.fbLedger.users[id].name
            ? this.fbLedger.users[id].name
            : this.fbLedger.users[id].email
        );
      }

      if (!this.currentSheet) {
        return "";
      }

      if (this.currentSheet && id in this.currentSheet.people) {
        return Utils.truncate(this.currentSheet.people[id].name);
      }
      return "";
    },

    isUser(id) {
      return !!(id && id in this.fbLedger?.users);
    },

    isPersonRemovable(id) {
      return !!(
        !this.isUser(id) ||
        (this.currentSheetTransactions?.length === 0 &&
          id !== fbAuth.currentUser.uid)
      );
    },

    isPersonActive(id) {
      return !!(id && this.currentSheet?.people?.[id]?.active);
    },

    getEditablePerson(id = null) {
      if (this.isUser(id)) {
        return null;
      }
      if (this.currentSheet && id in this.currentSheet.people) {
        return _.cloneDeep(this.currentSheet.people[id]);
      }
      return Person.make();
    },

    async activatePerson(id, batch = null) {
      if (!id) {
        return;
      }
      if (this.isUser(id)) {
        throw new Error("You cannot activate real users.");
      }
      if (this.currentSheet.people[id].active) {
        return;
      }

      return await this.autoBatch(
        async (id, batch) => {
          const sheetRef = this.getSheetRef(this.sheetId);
          batch.update(sheetRef, { [`people.${id}.active`]: true });
        },
        id,
        batch
      );
    },

    async addPerson(person, prevId, batch = null) {
      if (!person || !this.currentSheet) {
        return;
      }
      if (person.id in this.currentSheet.users) {
        throw new Error(
          "The selected user is already participating in this sheet. Pick someone else or create a fake user."
        );
      }
      return await this.autoBatch(
        async (person, batch) => {
          // promotion
          if (this.isUser(person.id) && !this.isUser(prevId)) {
            await this.removePerson(
              prevId,
              this.currentSheet?.id,
              false,
              batch
            );
          }
          const ledgerRef = this.getLedgerRef();
          const sheetRef = this.getSheetRef(this.sheetId);
          if (person.id in this.fbLedger.users) {
            batch.update(ledgerRef, {
              [`users.${person.id}.sheets.${this.currentSheet.id}`]: null,
            });
            batch.update(ledgerRef, {
              [`sheets.${this.currentSheet.id}.nusers`]: increment(1),
            });
            batch.update(sheetRef, { [`users.${person.id}`]: "owner" });
          }
          batch.update(sheetRef, { [`people.${person.id}`]: person });
        },
        person,
        batch
      );
    },

    async removePerson(
      personId,
      sheetId = this.currentSheet?.id,
      force = false,
      batch = null
    ) {
      if (!personId) {
        return;
      }
      if (!force && personId === fbAuth.currentUser.uid) {
        throw new Error(
          "You cannot remove yourself from a sheet. Remove the sheet instead."
        );
      }
      if (this.isUser(personId) && this.fbLedger.sheets[sheetId].nusers <= 1) {
        throw new Error(
          "You cannot remove the last user from this sheet. A bug happened. Use unfollowSheet instead."
        );
      }
      if (
        personId in this.fbLedger.users &&
        !(sheetId in this.fbLedger.users[personId].sheets)
      ) {
        throw new Error(
          "This user does not participate in this sheet. It cannot be removed properly. This should not happen. There is a bug somewhere."
        );
      }
      if (
        this.isUser(personId) &&
        this.fbLedger.sheets[sheetId].ntransactions !== 0 &&
        personId !== fbAuth.currentUser.uid
      ) {
        throw new Error(
          "You cannot remove another user while the sheet contains transactions."
        );
      }
      return await this.autoBatch(
        async (sheetId, personId, batch) => {
          const ledgerRef = this.getLedgerRef();
          const sheetRef = this.getSheetRef(sheetId);

          if (this.isUser(personId)) {
            if (
              this.fbLedger.sheets[sheetId].ntransactions === 0 ||
              fbAuth.currentUser.uid === personId
            ) {
              batch.update(ledgerRef, {
                [`users.${personId}.sheets.${sheetId}`]: deleteField(),
              });
              batch.update(ledgerRef, {
                [`sheets.${sheetId}.nusers`]: increment(-1),
              });
              batch.update(sheetRef, { [`users.${personId}`]: deleteField() });
            }

            if (this.fbLedger.sheets[sheetId].ntransactions === 0) {
              batch.update(sheetRef, { [`people.${personId}`]: deleteField() });
            } else if (fbAuth.currentUser.uid === personId) {
              batch.update(sheetRef, { [`people.${personId}.active`]: false });
            }
          } else {
            // fake user
            if (this.fbLedger.sheets[sheetId].ntransactions === 0) {
              batch.update(sheetRef, { [`people.${personId}`]: deleteField() });
            } else {
              batch.update(sheetRef, { [`people.${personId}.active`]: false });
            }
          }
        },
        sheetId,
        personId,
        batch
      );
    },

    // transaction

    async addTransaction(transaction, batch = null) {
      return await this.autoBatch(
        async (transaction, batch) => {
          await this.removeTransaction(this.transactionId, batch);
          const sheetRef = this.getSheetRef(this.currentSheet.id);
          batch.update(sheetRef, {
            [`transactions.${transaction.id}`]: transaction,
          });
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`sheets.${this.currentSheet.id}.ntransactions`]: increment(1),
          });
        },
        transaction,
        batch
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
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`sheets.${this.currentSheet.id}.ntransactions`]: increment(-1),
          });
        },
        id,
        batch
      );
    },

    getEditableTransaction(id = this.transactionId) {
      if (this.currentSheet && id in this.currentSheet.transactions) {
        const ans = _.cloneDeep(this.currentSheet.transactions[id]);
        Transaction.updatePeople(ans, this.currentSheetPeople.length);
        return ans;
      }
      return Transaction.make(
        this.currentSheetPeople,
        this.lastCurrency,
        fbAuth.currentUser.uid,
        this.currentSheet.people
      );
    },

    // sheet

    async setCurrentSheetName(newName, batch = null) {
      return await this.autoBatch(
        async (newName, batch) => {
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`sheets.${this.currentSheet.id}.name`]: newName,
          });
        },
        newName,
        batch
      );
    },

    async addNewSheet(batch = null) {
      return await this.autoBatch(async (batch) => {
        const [newSheet, newSheetLedger] = Sheet.make(fbAuth.currentUser.uid);
        const sheetRef = this.getSheetRef(newSheet.id);
        batch.set(sheetRef, newSheet);

        const ledgerRef = this.getLedgerRef();
        batch.update(ledgerRef, { [`sheets.${newSheet.id}`]: newSheetLedger });
        batch.update(ledgerRef, {
          [`users.${fbAuth.currentUser.uid}.sheets.${newSheet.id}`]: null,
        });
      }, batch);
    },

    async removeSheet(id, batch = null) {
      if (this.fbLedger.sheets[id].nusers > 1) {
        return;
      }
      return await this.autoBatch(
        async (id, batch) => {
          const sheetRef = this.getSheetRef(id);
          batch.delete(sheetRef);
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`users.${fbAuth.currentUser.uid}.sheets.${id}`]: deleteField(),
          });
          batch.update(ledgerRef, {
            [`sheets.${id}`]: deleteField(),
          });
        },
        id,
        batch
      );
    },

    async unfollowSheet(id, batch = null) {
      return await this.autoBatch(
        async (id, batch) => {
          if (this.fbLedger.sheets[id].nusers <= 1) {
            await this.removeSheet(id, batch);
          } else {
            await this.removePerson(fbAuth.currentUser.uid, id, true, batch);
          }
        },
        id,
        batch
      );
    },

    // admin

    getCurrentUserId() {
      return fbAuth?.currentUser?.uid;
    },

    isAuthenticated() {
      return !!fbAuth.currentUser && !!this.fbLedger;
    },

    getLedgerRef() {
      if (!fbDb) {
        throw new Error("fbDb should be active here.");
      }
      return doc(fbDb, "ledger", "ledger");
    },
    getSheetRef(sheetid) {
      if (!fbDb) {
        throw new Error("fbDb should be active here.");
      }
      if (!sheetid) {
        throw new Error("sheetid should be a proper id here.", sheetid);
      }
      return doc(fbDb, "sheets", sheetid);
    },

    async setUsername(newName, batch = null) {
      return await this.autoBatch(
        async (newName, batch) => {
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`users.${fbAuth.currentUser.uid}.name`]: newName,
          });
        },
        newName,
        batch
      );
    },

    isFbActive() {
      return !!fbApp && !!fbAuth && !!fbDb;
    },

    async initFb(config = null) {
      await this.clearFb();

      if (config) {
        this.fbConfig = config;
      }
      if (!this.fbConfig) {
        return;
      }

      if (getApps().length) {
        throw new Error("There should not be firebase instances active");
      }

      console.log("init fb");

      fbApp = initializeApp(this.fbConfig);
      fbAuth = getAuth(fbApp);
      fbDb = initializeFirestore(fbApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
      console.log("/init fb", this.isFbActive());
    },

    clearCurrentSheet() {
      this.unsubscribeToCurrentSheet?.();
      this.currentSheet = null;
    },

    clearFbLedger() {
      this.unsubscribeToFbLedger?.();
      this.fbLedger = null;
    },

    async logout() {
      this.clearFbLedger();
      this.clearCurrentSheet();
      await fbAuth?.signOut();
    },

    async clearFb() {
      await this.logout();
      fbDb = null;
      if (fbApp) {
        await deleteApp(fbApp);
      }
      fbApp = null;
    },

    async setFbLedger() {
      if (!this.isFbActive()) {
        throw new Error("firebase should be active here.");
      }
      if (this.fbLedger) {
        throw new Error("fbLedger should be null here.");
      }
      if (!fbAuth.currentUser) {
        throw new Error("we should be logged in here.");
      }

      await new Promise((resolve) => {
        const ledgerRef = this.getLedgerRef();
        this.unsubscribeToFbLedger = onSnapshot(ledgerRef, (doc) => {
          const triggerResolve = !!!this.fbLedger;
          if (doc.exists()) {
            this.fbLedger = doc.data();
          }
          if (triggerResolve) {
            resolve();
          }
        });
      });
    },

    async setCurrentSheet(sheetid) {
      if (!this.isFbActive()) {
        throw new Error("firebase should be active here.");
      }
      if (this.currentSheet) {
        throw new Error("currentSheet should be null here.");
      }
      if (!fbAuth.currentUser) {
        throw new Error("we should be logged in here.");
      }

      await new Promise((resolve) => {
        const sheetRef = this.getSheetRef(sheetid);
        this.unsubscribeToCurrentSheet = onSnapshot(sheetRef, (doc) => {
          const triggerResolve = !!!this.currentSheet;
          if (doc.exists()) {
            this.currentSheet = doc.data();
          }

          if (triggerResolve) {
            resolve();
          }
        });
      });
    },

    async initFb(config = null) {
      await this.clearFb();
      if (config) {
        this.fbConfig = config;
      }
      if (!this.fbConfig) {
        return;
      }

      if (this.isFbActive()) {
        throw new Error("Firebase should not be active here!");
      }
      fbApp = initializeApp(this.fbConfig);
      fbAuth = getAuth(fbApp);
      fbDb = initializeFirestore(fbApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    },

    async init() {
      await this.initFb();
      await fbAuth?.authStateReady();
      if (!this.isFbActive() || !fbAuth.currentUser) {
        return;
      }
      await this.setFbLedger();
    },

    async login(username, password) {
      if (!this.isFbActive()) {
        console.log(!!fbApp, !!fbAuth, !!fbDb);
        throw new Error("Firebase should be active here!");
      }
      await signInWithEmailAndPassword(fbAuth, username, password);
      await this.setFbLedger();
    },

    async register(email, password) {
      if (!this.isFbActive()) {
        throw new Error("Firebase should be active here!");
      }
      await createUserWithEmailAndPassword(fbAuth, email, password);
      const ledgerRef = this.getLedgerRef();
      await setDoc(
        ledgerRef,
        {
          users: {
            [`${fbAuth.currentUser.uid}`]: {
              name: "",
              email,
              sheets: {},
            },
          },
        },
        { merge: true }
      );
      await this.setFbLedger();
    },

    // utils

    async autoBatch(fn, ...args) {
      const isStandalone = !args[args.length - 1];
      if (isStandalone) {
        args[args.length - 1] = writeBatch(fbDb); // Create a new batch if not provided
      }

      // Call the original function with the provided arguments and batch
      const result = await fn.apply(this, args);

      // Commit the batch if it was created internally
      if (isStandalone) {
        await args[args.length - 1].commit();
      }

      return result;
    },
  },

  persist: {
    key: "sessionData",
    pick: ["fbConfig"],
  },
});
