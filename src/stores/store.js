import { defineStore } from "pinia";
import Sheet from "../models/sheet";

export const useStore = defineStore("store", {
  state: () => ({
    sheets: [],
    sheetID: -1,
    transactionID: -1,
    personID: -1,
    lastEditedCurrency: "XXX",
    currencies: ["USD", "EUR", "CHF"],
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
      const ans = Sheet.getEditableTransaction(
        this.sheets[this.sheetID],
        this.transactionID,
        this.lastEditedCurrency
      );
      this.addCurrency(ans.currency);

      return ans;
    },

    addCurrency(val) {
      if (val.length && !this.currencies.includes(val)) {
        this.currencies.push(val);
      }
    },

    removeCurrency(val) {
      const index = this.currencies.indexOf(val);
      if (index > -1) {
        this.currencies.splice(index, 1);
      }

      if (this.currencies.length === 0) {
        this.currencies.push("XXX");
      }
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

    addSheet() {
      this.sheets.push(Sheet.make());
      this.setSheetID(this.sheets.length - 1);
    },

    removeSheet(id) {
      this.setSheetID();
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
