import { v4 as uuidv4 } from "uuid";

const Transaction = {
  make(nPeople, currency) {
    let name = "";
    const id = uuidv4();
    let amount = 0;
    let payer = nPeople > 0 ? 0 : -1;
    const isDebtor = Array(nPeople).fill(true);
    const owed = Array(nPeople).fill(0);
    const date = Date.now();
    return { name, id, amount, payer, currency, isDebtor, owed, date };
  },

  updatePeople(transaction, nPeople) {
    const addPeople = nPeople - transaction.owed.length;
    if (addPeople > 0) {
      transaction.isDebtor.push(...Array(addPeople).fill(false));
      transaction.owed.push(...Array(addPeople).fill(0));
      if (transaction.payer === -1) {
        transaction.payer = 0;
      }
    }
  },

  split(transaction) {
    const nDebtors = transaction.isDebtor.filter(
      (value) => value === true
    ).length;
    if (nDebtors == 0) {
      transaction.owed.fill(0);
      return;
    }

    const q = Math.floor(transaction.amount / nDebtors);
    let r = transaction.amount % nDebtors;

    for (let i = transaction.owed.length - 1; i >= 0; --i) {
      if (transaction.isDebtor[i]) {
        transaction.owed[i] = q;
        if (r > 0) {
          transaction.owed[i] += 1;
          --r;
        }
      } else {
        transaction.owed[i] = 0;
      }
    }
  },
};

export default Transaction;
