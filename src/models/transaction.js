import { v4 as uuidv4 } from "uuid";

const Transaction = {
  make(peopleids, currency, payerid, people) {
    const nPeople = peopleids.length;
    let name = "";
    const id = uuidv4();
    let amount = 0;
    let payer = peopleids.indexOf(payerid);
    if (payer === -1) {
      payer = nPeople > 0 ? 0 : -1;
    }
    const debts = peopleids.map((personid) => ({
      isDebtor: people[personid].active,
      owedAmount: 0,
    }));
    let timestamp = Date.now();
    return { name, id, amount, payer, currency, debts, timestamp };
  },

  updatePeople(transaction, nPeople) {
    for (let i = transaction.debts.length; i < nPeople; i++) {
      transaction.debts.push({ isDebtor: false, owedAmount: 0 });
    }
  },

  split(transaction) {
    const nDebtors = transaction.debts.filter((debt) => debt.isDebtor).length;
    if (nDebtors == 0) {
      Object.values(transaction.debts).forEach((person) => {
        person.owedAmount = 0;
      });
      return;
    }

    const q = Math.floor(transaction.amount / nDebtors);
    let r = transaction.amount % nDebtors;

    for (let i = transaction.debts.length - 1; i >= 0; --i) {
      if (transaction.debts[i].isDebtor) {
        transaction.debts[i].owedAmount = q;
        if (r > 0) {
          transaction.debts[i].owedAmount += 1;
          --r;
        }
      } else {
        transaction.debts[i].owedAmount = 0;
      }
    }
  },
};

export default Transaction;
