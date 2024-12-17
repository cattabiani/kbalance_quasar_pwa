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
import { getAuth,  } from "firebase/auth";
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

export const useStore = defineStore("mainStore", {
  state: () => ({
    // router
    transactionId: null,

    // local cache and admin
    fbLedger: null,
    users: null,
    currentSheet: null,
    currentSheetPeople: [],
    currentSheetTransactions: [],
    currentSheetResults: null,

    // firebase
    fbConfig: null,
    fbApp: null,
    fbAuth: null,
    fbDb: null,

    // listeners
    unsubscribeToFbLedger: null,
    unsubscribeToCurrentSheet: null,
    unsubscribeAuth: null,
  }),

  getters: {

    isReady() {
      return !!this.fbLedger;
    },

    isFbActive() {
      console.log("trio: ", !!this.fbApp , !!this.fbAuth , !!this.fbDb)
      return !!this.fbApp && !!this.fbAuth && !!this.fbDb;
    },

    currentSheetLedger() {
      return this.fbLedger?.sheets?.[this.currentSheet?.id] || {};
    },

    sheetId() {
      return this.currentSheet?.id || null;
    },

    userSheets() {
      if (this.fbAuth.currentUser && this.fbLedger) {
        const result = Object.keys(
          this.fbLedger.users[this.fbAuth.currentUser.uid].sheets
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
        id = this.fbAuth.currentUser?.uid;
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
          id !== this.fbAuth.currentUser.uid)
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
      if (!force && personId === this.fbAuth.currentUser.uid) {
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
        this.fbLedger.sheets[sheetId].ntransactions !== 0
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
              this.fbAuth.currentUser.uid === personId
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
            } else if (this.fbAuth.currentUser.uid === personId) {
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
        this.fbAuth.currentUser.uid,
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
        const [newSheet, newSheetLedger] = Sheet.make(this.fbAuth.currentUser.uid);
        const sheetRef = this.getSheetRef(newSheet.id);
        batch.set(sheetRef, newSheet);

        const ledgerRef = this.getLedgerRef();
        batch.update(ledgerRef, { [`sheets.${newSheet.id}`]: newSheetLedger });
        batch.update(ledgerRef, {
          [`users.${this.fbAuth.currentUser.uid}.sheets.${newSheet.id}`]: null,
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
            [`users.${this.fbAuth.currentUser.uid}.sheets.${id}`]: deleteField(),
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
            await this.removePerson(this.fbAuth.currentUser.uid, id, true, batch);
          }
        },
        id,
        batch
      );
    },

    // admin

    async init(fbConfig = null) {
      if (this.fbLedger && !fbConfig) {
        return;
      }
      if (fbConfig) {
        this.fbConfig = fbConfig;
      }
      await this.initFb();
      await this.subscribeFbLedger();
    },

    async cleanup() {
      await this.subscribeCurrentSheet();
      await this.subscribeFbLedger();
    },

    getLedgerRef() {
      return doc(this.fbDb, "ledger", "ledger");
    },
    getSheetRef(sheetid) {
      return doc(this.fbDb, "sheets", sheetid);
    },

    async registerUser(email, password) {
      await createUserWithEmailAndPassword(this.fbAuth, email, password);
      const ledgerRef = this.getLedgerRef();
      await setDoc(
        ledgerRef,
        {
          users: {
            [`${this.fbAuth.currentUser.uid}`]: {
              name: "",
              email,
              sheets: {},
            },
          },
        },
        { merge: true }
      );
      await this.subscribeFbLedger();
    },

    async setUsername(newName, batch = null) {
      return await this.autoBatch(
        async (newName, batch) => {
          const ledgerRef = this.getLedgerRef();
          batch.update(ledgerRef, {
            [`users.${this.fbAuth.currentUser.uid}.name`]: newName,
          });
        },
        newName,
        batch
      );
    },

    async loginUser(email, password) {
      this.requireFb();
      console.log(this.isReady, this.isFbActive);
      console.log("after require");
      await signInWithEmailAndPassword(this.fbAuth, email, password);
      console.log("signed in");
      await this.subscribeFbLedger();
      console.log("done!");
    },

    async logoutUser() {
      this.requireFb();
      await this.fbAuth.signOut();
      await this.cleanup();
    },

    async subscribeFbLedger() {
      this.unsubscribeToFbLedger?.();
      this.unsubscribeToFbLedger = null;
      this.fbLedger = null;
      if (!this.isFbActive) {
        return;
      }

      
      await this.fbAuth.authStateReady();
      if (!this.fbAuth.currentUser) {
        return;
      }

      console.log("onSnapshot");
      console.log(this.isReady, !!this.fbLedger);
      const ledgerRef = this.getLedgerRef();
      await new Promise((resolve) => {
        this.unsubscribeToFbLedger = onSnapshot(ledgerRef, (doc) => {
          const triggerResolve = this.fbLedger === null;
          this.fbLedger = doc.data();
          this.users = Object.keys(this.fbLedger.users).sort((a, b) =>
            this.username(a).localeCompare(this.username(b))
          );
          if (triggerResolve) {
            resolve();
          }
        });
      });

      console.log("/onSnapshot");
      return;
    },

    async subscribeCurrentSheet(sheetid) {
      this.unsubscribeToCurrentSheet?.();
      this.unsubscribeToCurrentSheet = null;

      if (!sheetid) {
        this.currentSheet = null;
        this.currentSheetPeople = [];
        this.currentSheetTransactions = [];
        this.currentSheetResults = null;
        return;
      }

      await new Promise((resolve) => {
        const sheetRef = this.getSheetRef(sheetid);
        this.unsubscribeToCurrentSheet = onSnapshot(
          sheetRef,
          (doc) => {
            console.log("onSnapshot currentSheet");
            const triggerResolve = this.currentSheet === null;
            this.currentSheet = doc.data();

            this.currentSheetPeople = Object.entries(this.currentSheet.people)
              .sort(([, a], [, b]) => a.timestamp - b.timestamp) // Sort by timestamp (descending)
              .map(([id]) => id); // Extract the keys (IDs)

            this.currentSheetTransactions = Object.entries(
              this.currentSheet.transactions
            )
              .sort(([, a], [, b]) => b.timestamp - a.timestamp) // Sort by timestamp (ascending)
              .map(([id]) => id); // Extract the keys (IDs)

            this.currentSheetResults = Results.make(
              this.currentSheet.transactions,
              this.currentSheetPeople?.length || 0
            );

            if (triggerResolve) {
              resolve();
            }
          },
          (error) => {
            if (error.code === "permission-denied") {
              this.subscribeCurrentSheet();
            }
          }
        );
      });
    },

//////////////////

requireFb() {
  if (!this.isFbActive) {
    throw new Error("I was expecting initialized firebase objects. This is a bug.");
  }
},

async initFb(config = null) {
  console.log("initFb");
  await this.cleanupFb();

  if (config) {
    this.fbConfig = config;
  }
  if (!this.fbConfig) { return; }

  this.fbApp = initializeApp(this.fbConfig);
  this.fbAuth = getAuth(this.fbApp);
  this.fbDb = initializeFirestore(this.fbApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  console.log("/initFb");
},

async cleanupFb() {
  console.log("cleanupFb");
  this.cleanup();
  if (!this.isFbActive) { return; }

    // Attempt to terminate the Firebase app
    await deleteApp(this.fbApp);

    // Reset Firebase-related properties
    this.fbApp = null;
    this.fbAuth = null;
    this.fbDb = null;

  console.log("/cleanupFb");
},

// TODO remove
async useFb() {
  console.log("useFb");
  if (!this.isFbActive) {
    console.log("/fbNotActive!");
    return;
  }

  console.log("login");
  await signInWithEmailAndPassword(this.fbAuth, "a@gmail.com", "123456");
  console.log("/login");
  const ledgerRef = this.getLedgerRef();
  const doc = await getDoc(ledgerRef);
  if (doc.exists()) {
    console.log("doc:", doc.data()); 
  } else {
    console.log("no doc!"); 
  }
  console.log("logout");
  await this.fbAuth.signOut();
  console.log("/logout");

  console.log("/useFb");
},

// utils

async autoBatch(fn, ...args) {
  const isStandalone = !args[args.length - 1];
  if (isStandalone) {
    args[args.length - 1] = writeBatch(this.fbDb); // Create a new batch if not provided
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
    pick: [],
  },
});
