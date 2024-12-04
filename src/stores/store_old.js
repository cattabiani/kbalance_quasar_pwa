import { defineStore } from "pinia";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "src/firebase/firebase";
import FirestoreActions from "src/firebase/actions";
import Sheet from "src/models/sheet";
import Person from "src/models/person";
import Transaction from "src/models/transaction";
import Results from "src/models/results";
import _ from "lodash";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const useStore = defineStore("mainStore", {
  state: () => ({
    // session data
    transactionId: null,
    unsubscribeCurrentSheetListener: null,
    unsubscribeUsersListener: null,
    // localStorge
    // TODO make work also for multiple users on same device
    sessionSheets: {},
    // firestore
    currentSheet: null,
    currentSheetTransactionIds: null,
    currentSheetPeople: null,
    currentSheetResults: null,
    user: null,
    users: null,
  }),

  getters: {
    username() {
      return this.user.displayName || this.user.email;
    },

    userSheets() {
      if (this.user && this.users) {
        return this.users[this.user.uid].sheets;
      }
      return {};
    },
  },

  actions: {
    getCurrentSheetDocRef(id = null) {
      if (id === null) {
        id = this.currentSheet.id;
      }
      return doc(db, "sheets", id);
    },

    getUsersDocRef() {
      return doc(db, "users", "0");
    },

    init() {
      this.setUser(this.user);
    },

    cleanup() {
      if (this.unsubscribeCurrentSheetListener) {
        this.unsubscribeCurrentSheetListener();
        this.unsubscribeCurrentSheetListener = null;
      }
      if (this.unsubscribeUsersListener) {
        this.unsubscribeUsersListener();
        this.unsubscribeUsersListener = null;
      }
    },

    setUser(user) {
      if (this.unsubscribeUsersListener) {
        this.unsubscribeUsersListener();
        this.unsubscribeUsersListener = null;
      }
      if (user === null) {
        this.user = null;
        this.users = null;
        return;
      }

      const usersRef = this.getUsersDocRef();

      this.user = user;
      this.unsubscribeUsersListener = onSnapshot(usersRef, (doc) => {
        this.users = doc.data();
        const newSheets = {};
        for (const key of Object.keys(this.userSheets)) {
          newSheets[key] = this.sessionSheets[key] || this.defaultSheet();
        }
        this.sessionSheets = newSheets;
      });
    },

    async register(email, password) {
      await createUserWithEmailAndPassword(auth, email, password);
      const usersRef = this.getUsersDocRef();
      await setDoc(
        usersRef,
        {
          [`${auth.currentUser.uid}`]: {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            sheets: {},
          },
        },
        { merge: true }
      );
      FirestoreActions.registerUser(
        auth.currentUser.uid,
        auth.currentUser.displayName,
        auth.currentUser.email
      );
      this.setUser(auth.currentUser);
    },

    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
      this.setUser(auth.currentUser);
    },

    async logout() {
      await auth.signOut();
      this.setUser(auth.currentUser);
    },

    async setUsername(name) {
      if (name !== this.username) {
        await updateProfile(this.user, { displayName: name });
        const usersRef = this.getUsersDocRef();
        await updateDoc(usersRef, {
          [`${this.user.uid}.name`]: this.user.displayName,
        });
      }
    },

    // transaction

    getEditableTransaction() {
      const id = this.transactionId;
      if (id in this.currentSheet.transactions) {
        const t = _.cloneDeep(this.currentSheet.transactions[id]);
        Transaction.updatePeople(t, this.currentSheetPeople.length);
        return t;
      }
      return Transaction.make(
        this.currentSheetPeople,
        this.sessionSheets[this.currentSheet.id].lastCurrency
      );
    },

    async addTransaction(transaction) {
      const sheetRef = this.getCurrentSheetDocRef();
      await updateDoc(sheetRef, {
        [`transactions.${transaction.id}`]: transaction,
      });
      this.sessionSheets[this.currentSheet.id].lastCurrency =
        transaction.currency;
    },

    async removeTransaction(id) {
      const sheetRef = this.getCurrentSheetDocRef();
      await updateDoc(sheetRef, {
        [`transactions.${id}`]: deleteField(),
      });
    },

    // person

    getEditablePerson(id = null) {
      if (id in this.currentSheet.people) {
        return _.cloneDeep(this.currentSheet.people[id]);
      }
      return Person.make();
    },

    async addPerson(person) {
      const sheetRef = this.getCurrentSheetDocRef();
      await updateDoc(sheetRef, {
        [`people.${person.id}`]: person,
      });
    },

    async removePerson(id) {
      const sheetRef = this.getCurrentSheetDocRef();
      if (Object.keys(this.currentSheet.transactions).length === 0) {
        await updateDoc(sheetRef, {
          [`people.${id}`]: deleteField(),
        });
      } else {
        await updateDoc(sheetRef, {
          [`people.${id}.active`]: false,
        });
      }
    },

    async activatePerson(id) {
      const sheetRef = this.getCurrentSheetDocRef();
      await updateDoc(sheetRef, {
        [`people.${id}.active`]: true,
      });
    },

    // sheet

    async setCurrentSheet(id = null) {
      if (this.unsubscribeCurrentSheetListener) {
        this.unsubscribeCurrentSheetListener();
        this.unsubscribeCurrentSheetListener = null;
      }

      if (id === null) {
        this.currentSheet = null;
        this.currentSheetTransactionIds = null;
        this.currentSheetPeople = null;
        this.currentSheetResults = null;
        return;
      }

      const sheetRef = this.getCurrentSheetDocRef();
      this.unsubscribeCurrentSheetListener = onSnapshot(sheetRef, (doc) => {
        this.currentSheet = doc.data();
        this.currentSheetPeople = Object.values(this.currentSheet.people).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        this.currentSheetTransactionIds = Object.keys(
          this.currentSheet.transactions
        ).sort(
          (a, b) =>
            this.currentSheet.transactions[b].timestamp -
            this.currentSheet.transactions[a].timestamp
        );
        this.currentSheetResults = Results.make(
          this.currentSheet.transactions,
          this.currentSheetPeople.length
        );
      });
    },

    defaultSheet() {
      return {
        selectedPerson: 0,
        lastCurrency: "USD",
      };
    },

    async addSheet() {
      const batch = writeBatch(db);
      const newSheet = Sheet.make(this.username, this.user.uid);
      const sheetRef = this.getCurrentSheetDocRef(newSheet.id);

      batch.set(sheetRef, newSheet);
      const usersRef = this.getUsersDocRef();
      batch.update(usersRef, {
        [`${this.user.uid}.sheets.${newSheet.id}`]: {
          name: newSheet.name,
          timestamp: newSheet.timestamp,
        },
      });
      await batch.commit();
      this.sessionSheets[newSheet.id] = this.defaultSheet();
    },

    async removeSheet(id) {
      const batch = writeBatch(db);
      const usersRef = this.getUsersDocRef();
      batch.update(usersRef, {
        [`${this.user.uid}.sheets.${id}`]: deleteField(),
      });

      const sheetRef = this.getCurrentSheetDocRef(id);
      const docSnapshot = await getDoc(sheetRef);
      if (docSnapshot.exists()) {
        if (Object.keys(docSnapshot.data().users).length <= 1) {
          batch.delete(sheetRef);
        } else {
          batch.update(sheetRef, {
            [`users.${this.user.uid}`]: deleteField(),
          });
        }
      }
      await batch.commit();

      delete this.sessionSheets[id];
    },
  },

  // Add this persist option to save to local storage
  persist: {
    key: "mainStorage",
    pick: ["sheets", "user"],
  },
});
