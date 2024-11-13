import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../models/transaction";
import { Person } from "../models/person";

import _ from 'lodash';

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
    getEditableTransaction() {
      const nPeople = this.sheets[this.sheetID].people.length;
      if (this.currentTransaction) {
        const ans = _.cloneDeep(this.sheets[this.sheetID].transactions[this.transactionID]);
        ans.updatePeople(nPeople);
        return ans;
      } else {
        return new Transaction(nPeople, this.lastEditedCurrency);
      }
    },
    saveInCurrentTransaction(transaction) {
      if (this.currentTransaction) {
        this._registerTransaction(this.sheets[this.sheetID].transactions[this.transactionID], -1);
        this._registerTransaction(transaction, 1);
        this.sheets[this.sheetID].transactions[this.transactionID] =
          transaction;
      } else {
        this._registerTransaction(transaction, 1);
        this.sheets[this.sheetID].transactions.push(transaction);
      }
    },
    deleteTransaction(id, complete = true) {
      this._registerTransaction(this.sheets[this.sheetID].transactions[id], -1);
      if (complete) {
        this.sheets[this.sheetID].transactions.splice(id, 1);
      }
    },
    _registerTransaction(transaction, multi) {
      const j = transaction.payer;
      for (let i = 0; i < transaction.owed.length; ++i) {
        if (j === i) {
          continue;
        }
        const v = multi*transaction.owed[i];
        if (i > j) {
          this.sheets[this.sheetID].results[i][j] += v;
        } else {
          this.sheets[this.sheetID].results[j][i] -= v;
        }
      }
    },
    getEditablePerson() {
      if (this.currentPerson) {
        return { ...this.sheets[this.sheetID].people[this.personID] };
      } else {
        return new Person();
      }
    },
    saveInCurrentPerson(person) {
      if (this.sheets[this.sheetID].people[this.personID]) {
        this.sheets[this.sheetID].people[this.personID] = person;
      } else {
        this.sheets[this.sheetID].results.push(
          Array(this.sheets[this.sheetID].people.length).fill(0)
        );
        this.sheets[this.sheetID].people.push(person);
      }
    },
    deletePerson(id) {
      if (this.sheets[this.sheetID].transactions.length == 0) {
        let matrix = this.sheets[this.sheetID].results;
        if (!matrix[id].every((element) => element === 0)) {
          return;
        }

        // Step 2: Check if all elements in column i are 0 (in rows after i)
        for (let row = id + 1; row < matrix.length; row++) {
          if (matrix[row][id] !== 0) {
            return;
          }
        }

        // Step 3: Remove row i
        matrix.splice(id, 1);

        // Step 4: Remove column i from each row after row i
        for (let row = id; row < matrix.length; row++) {
          matrix[row].splice(id, 1);
        }

        this.sheets[this.sheetID].people.splice(id, 1);
      } else {
        this.sheets[this.sheetID].people[id].active = false;
      }
    },

    makeNewSheet() {
      return {
        name: "",
        people: [new Person("Self")],
        results: [[]],
        transactions: [],
      };
    },
    saveInCurrentSheet(sheet) {
      if (this.sheets[this.sheetID]) {
        this.sheets[this.sheetID] = sheet;
      } else {
        this.sheets.push(sheet);
      }
    },
    deleteSheet(id) {
      this.sheets.splice(id, 1);
    },
  },
});
