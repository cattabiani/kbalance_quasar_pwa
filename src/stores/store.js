import { defineStore } from "pinia";
import Sheet from "../models/sheet";

export const useStore = defineStore("store", {
  state: () => ({
    sheets: {},
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
    setSheetID(id = null) {
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

      return ans;
    },

    addTransaction(transaction) {
      Sheet.addTransaction(
        this.sheets[this.sheetID],
        this.transactionID,
        transaction
      );
      this.pushSheetToFirebase(this.sheetID);
    },
    removeTransaction(id) {
      Sheet.removeTransaction(this.sheets[this.sheetID], id);
      this.pushSheetToFirebase(this.sheetID);
    },
    // // person
    getEditablePerson() {
      return Sheet.getEditablePerson(this.sheets[this.sheetID], this.personID);
    },
    addPerson(person) {
      Sheet.addPerson(this.sheets[this.sheetID], this.personID, person);
      this.pushSheetToFirebase(this.sheetID);
    },
    removePerson(id) {
      Sheet.removePerson(this.sheets[this.sheetID], id);
      this.pushSheetToFirebase(this.sheetID);
    },

    // sheet

    addSheet(sheet) {
      this.sheets[sheet.id] = sheet;
      this.pushSheetToFirebase(sheet.id);
    },

    removeSheet(id) {
      this.setSheetID();
      delete this.sheets[id];

      console.log("remove sheet from firebase TODO");
    },

    pushSheetToFirebase(id) {
      if (id in this.sheets) {
        console.log("pushSheetToFirebase: ", id);
      }
    },
  },
  // Add this persist option to save to local storage
  persist: {
    enabled: true,
    strategies: [
      {
        key: "storage", // Use a single key for both lastEditedCurrency and sheets
        storage: localStorage,
        serializer: {
          serialize: (state) => {
            // Combine lastEditedCurrency and sheets into a single object
            return JSON.stringify({
              lastEditedCurrency: state.lastEditedCurrency,
              sheets: state.sheets,
            });
          },
          deserialize: (value) => {
            const parsed = JSON.parse(value);
            // Return the combined state object with both fields
            return {
              lastEditedCurrency: parsed.lastEditedCurrency,
              sheets: parsed.sheets,
            };
          },
        },
      },
    ],
  },
});
