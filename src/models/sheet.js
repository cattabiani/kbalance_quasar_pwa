import { v4 as uuidv4 } from "uuid";
import Person from "./person";
import Result from "./result";
import Transaction from "./transaction";

const Sheet = {
  make(name = "") {
    const id = uuidv4();
    const people = [Person.make("Self")];
    const results = {};
    const transactions = [];
    return { name, id, people, results, transactions };
  },

  getSummary(sheet, id) {
    const ans = [];
    const totals = {};

    if (id < 0 || id >= sheet.people.length) {
      return ans, totals;
    }

    // Loop over the keys in store.currentSheet.results
    Object.keys(sheet.results).forEach((key) => {
      // Call getSummary on each item, passing selectedPerson.value
      const l = Result.getSummary(sheet.results[key], id);
      let tot = 0;
      if (l.length > 0) {
        l.forEach((v) => {
          ans.push({ currency: key, person: v.person, amount: v.amount });
          tot += v.amount;
        });
      }
      if (tot != 0) {
        totals[key] = tot;
      }
    });

    return { ans, totals };
  },

  getEditableTransaction(sheet, id, lastEditedCurrency = "XXX") {
    if (id >= 0 && id < sheet.transactions.length) {
      const ans = { ...sheet.transactions[id] };
      Transaction.updatePeople(ans, sheet.people.length);
      return ans;
    }
    return Transaction.make(sheet.people.length, lastEditedCurrency);
  },

  addTransaction(sheet, id, transaction) {
    if (transaction.amount === 0) {
      return;
    }

    if (!(transaction.currency in sheet.results)) {
      sheet.results[transaction.currency] = Result.make(sheet.people.length);
    }

    Result.addTransaction(sheet.results[transaction.currency], transaction, 1);
    if (id >= 0 && id < sheet.transactions.length) {
      Result.addTransaction(
        sheet.results[sheet.transactions[id].currency],
        sheet.transactions[id],
        -1
      );
      sheet.transactions[id] = transaction;
    } else {
      sheet.transactions.push(transaction);
    }
  },

  removeTransaction(sheet, id) {
    if (id >= 0 && id < sheet.transactions.length) {
      Result.addTransaction(
        sheet.results[sheet.transactions[id].currency],
        sheet.transactions[id],
        -1
      );
      sheet.transactions.splice(id, 1);
    }
  },

  getEditablePerson(sheet, id) {
    if (id >= 0 && id < sheet.people.length) {
      return { ...sheet.people[id] };
    }
    return Person.make();
  },

  addPerson(sheet, id, person) {
    if (id >= 0 && id < sheet.people.length) {
      sheet.people[id] = person;
    } else {
      sheet.people.push(person);

      Object.keys(sheet.results).forEach((key) => {
        Result.addPerson(sheet.results[key]);
      });
    }
  },

  removePerson(sheet, id) {
    if (sheet.transactions.length !== 0) {
      sheet.people[id].active = false;
      return;
    }

    Object.keys(sheet.results).forEach((key) => {
      if (!Result.isPersonRemovable(sheet.results[key], id)) {
        return;
      }
    });

    Object.keys(sheet.results).forEach((key) => {
      Result.removePerson(sheet.results[key], id, false);
    });
    sheet.people.splice(id, 1);
  },
};

export default Sheet;