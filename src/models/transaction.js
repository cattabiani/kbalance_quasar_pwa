import { v4 as uuidv4 } from 'uuid';

const Transaction = {
  make(peopleids, currency, payerid, people) {
    const nPeople = peopleids.length;
    let name = '';
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

  // position for the focus person for this transaction
  position(transaction, idx) {
    if (transaction.payer === idx) {
      return transaction.amount - transaction.debts[idx].owedAmount;
    }
    return -transaction.debts[idx].owedAmount;
  },

  updatePeople(transaction, nPeople) {
    for (let i = transaction.debts.length; i < nPeople; i++) {
      transaction.debts.push({ isDebtor: false, owedAmount: 0 });
    }
  },

  clearOwedAmounts(transaction, id) {
    transaction.debts.forEach((debt, index) => {
      if (index !== id) {
        debt.owedAmount = 0;
      }
    });
  },

  fillLastOwedAmount(transaction) {
    const zeroDebtors = transaction.debts
      .map((debt, index) => ({ debt, index }))
      .filter(({ debt }) => debt.isDebtor && debt.owedAmount === 0);
    const v = transaction.debts.reduce((acc, debt) => acc + debt.owedAmount, 0);
    const d = transaction.amount - v;
    let isAmountChanged = false;
    if (d < 0) {
      transaction.amount -= d;
      isAmountChanged = true;
    }
    if (zeroDebtors.length !== 1 || d <= 0) {
      return isAmountChanged;
    }

    const { index } = zeroDebtors[0];
    transaction.debts[index].owedAmount = d;
    return isAmountChanged;
  },

  check(transaction) {
    let v = 0;
    transaction.debts.forEach((debt, index) => {
      if (debt.owedAmount > 0 && !debt.isDebtor) {
        throw new Error(`The person ${index} is not a debtor but owes money!`);
      }
      v += debt.owedAmount;
    });

    if (v !== transaction.amount) {
      throw new Error(
        `The owed amounts: ${
          v / 100
        } do not sum up to the transaction amount: ${
          transaction.amount / 100
        }! Probably you need to fix either the shares or the total amount.`,
      );
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

    transaction.debts.forEach((debt, index) => {
      if (debt.isDebtor) {
        debt.owedAmount = q;
        if (r > 0 && index !== transaction.payer) {
          debt.owedAmount += 1;
          --r;
        }
      } else {
        debt.owedAmount = 0;
      }
    });
  },

  state(transaction) {
    if (transaction.debts.length !== 2) {
      return -1;
    }

    if (
      transaction.debts[0].isDebtor &&
      !transaction.debts[1].isDebtor &&
      transaction.payer === 1 &&
      transaction.debts[0].owedAmount === transaction.amount
    ) {
      return 0;
    }

    if (
      transaction.debts[1].isDebtor &&
      !transaction.debts[0].isDebtor &&
      transaction.payer === 0 &&
      transaction.debts[1].owedAmount === transaction.amount
    ) {
      return 0;
    }

    if (transaction.debts[0].isDebtor && transaction.debts[1].isDebtor) {
      const idxOther = 1 - transaction.payer;
      const valOther = (transaction.amount + (transaction.amount % 2)) / 2;
      const valPayer = (transaction.amount - (transaction.amount % 2)) / 2;
      if (
        transaction.debts[transaction.payer].owedAmount === valPayer &&
        transaction.debts[idxOther].owedAmount === valOther
      )
        return 1;
    }

    return -1;
  },
};

export default Transaction;
