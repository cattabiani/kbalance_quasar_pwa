import { defineStore } from "pinia";
import Sheet from "../models/sheet";

export const useStore = defineStore("store", {
  state: () => ({
    sheets: [],
    sheetID: -1,
    transactionID: -1,
    personID: -1,
    lastEditedCurrency: "XXX",
  }),
  getters: {
    currentSheet() {
      return this.sheets[this.sheetID];
    },
    currentPerson() {
      return this.sheets[this.sheetID].people[this.personID];
    },
    currentTransaction() {
      return this.sheets[this.sheetID].transactions[this.transactionID];
    },
  },
  actions: {
    // set store IDs
    setSheetID(id = -1) {
      this.sheetID = id;
    },
    setTransactionID(id = -1) {
      this.transactionID = id;
    },
    setPersonID(id = -1) {
      this.personID = id;
    },

    // // transaction
    getEditableTransaction() {
      return Sheet.getEditableTransaction(
        this.sheets[this.sheetID],
        this.transactionID,
        this.lastEditedCurrency
      );
    },
    addTransaction(transaction) {
      Sheet.addTransaction(
        this.sheets[this.sheetID],
        this.transactionID,
        transaction
      );
    },
    removeTransaction(id) {
      Sheet.removeTransaction(this.sheets[this.sheetID], id);
    },
    // // person
    getEditablePerson() {
      return Sheet.getEditablePerson(this.sheets[this.sheetID], this.personID);
    },
    addPerson(person) {
      Sheet.addPerson(this.sheets[this.sheetID], this.personID, person);
    },
    removePerson(id) {
      Sheet.removePerson(this.sheets[this.sheetID], id);
    },

    // sheet
    addSheet(sheet = null) {
      if (sheet === null) {
        sheet = Sheet.make();
      }

      if (this.sheetID >= 0 && this.sheetID < this.sheets.length) {
        this.sheets[this.sheetID] = sheet;
      } else {
        this.sheets.push(sheet);
      }
    },
    removeSheet(id) {
      this.sheets.splice(id, 1);
    },
  },
  // Add this persist option to save to local storage
  persist: {
    enabled: true,
    strategies: [
      {
        key: "store",
        storage: localStorage,
        // Custom serialization to exclude variables ending with "ID"
        serializer: {
          serialize: (state) => {
            // Filter out keys ending with "ID"
            const persistedState = { ...state };
            delete persistedState["sheetID"];
            delete persistedState["transactionID"];
            delete persistedState["personID"];
            return JSON.stringify(persistedState);
          },
          deserialize: (value) => JSON.parse(value),
        },
      },
    ],
  },
});
