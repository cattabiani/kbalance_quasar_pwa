import { v4 as uuidv4 } from 'uuid';

const Transaction = {
  make(peopleActive, currency, payerIdx) {
    const nPeople = Array.isArray(peopleActive)
      ? peopleActive.length
      : peopleActive;
    let name = '';
    const id = uuidv4();
    let amount = 0;
    let payer =
      payerIdx >= 0 && payerIdx < nPeople ? payerIdx : nPeople > 0 ? 0 : -1;
    const debts = Array.from({ length: nPeople }, (_, i) => ({
      isDebtor: Array.isArray(peopleActive) ? peopleActive[i] : true,
      owedAmount: 0,
    }));
    let timestamp = Date.now();
    return { name, id, amount, payer, currency, debts, timestamp };
  },

  makeBatch(peopleActive, currency, payerIdx, movements, msg) {
    const transactions = {};

    const base = this.make(peopleActive, currency, payerIdx);

    movements.forEach((amount, idx) => {
      if (amount === 0) return; // Ignore zero movements

      if (amount > 0) {
        base.debts[idx].isDebtor = true;
        base.debts[idx].owedAmount = amount;
        base.amount += amount;
      } else {
        const newT = this.make(peopleActive, currency, idx);
        newT.debts[payerIdx].isDebtor = true;
        newT.debts[payerIdx].owedAmount = -amount;
        newT.amount = -amount;
        transactions[newT.id] = newT;
      }
    });

    // Only add base if it has a positive amount
    if (base.amount > 0) {
      transactions[base.id] = base;
    }

    let index = 0;
    for (const transaction of Object.values(transactions)) {
      transaction.name = `${msg} (${index})`;
      index++;
    }

    return transactions;
  },

  name(transaction) {
    return transaction.name || 'New Transaction';
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

  // clearOwedAmounts(transaction, id) {
  //   transaction.debts.forEach((debt, index) => {
  //     if (index !== id) {
  //       debt.owedAmount = 0;
  //     }
  //   });
  // },

  // fillLastOwedAmount(transaction) {
  //   const zeroDebtors = transaction.debts
  //     .map((debt, index) => ({ debt, index }))
  //     .filter(({ debt }) => debt.isDebtor && debt.owedAmount === 0);
  //   const v = transaction.debts.reduce((acc, debt) => acc + debt.owedAmount, 0);
  //   const d = transaction.amount - v;
  //   let isAmountChanged = false;
  //   if (d < 0) {
  //     transaction.amount -= d;
  //     isAmountChanged = true;
  //   }
  //   if (zeroDebtors.length !== 1 || d <= 0) {
  //     return isAmountChanged;
  //   }

  //   const { index } = zeroDebtors[0];
  //   transaction.debts[index].owedAmount = d;
  //   return isAmountChanged;
  // },

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

  clearNonDebtorAmounts(transaction) {
    transaction.debts.forEach((debt) => {
      if (!debt.isDebtor) {
        debt.owedAmount = 0;
      }
    });
  },

  effectiveDebtors(transaction, exclude) {
    return transaction.debts
      .map((d, i) => (d.isDebtor && !exclude.has(i) ? i : -1))
      .filter((i) => i !== -1);
  },

  split(transaction, exclude = new Set()) {
    this.clearNonDebtorAmounts(transaction);

    const debts = transaction.debts;

    // Compute total excluded amount
    const excludedTotal = [...exclude].reduce(
      (sum, i) => sum + debts[i].owedAmount,
      0,
    );

    const effectiveAmount = transaction.amount - excludedTotal;
    if (effectiveAmount < 0) {
      transaction.amount = excludedTotal;
      debts.forEach((d, i) => {
        if (exclude.has(i)) return;
        d.owedAmount = 0;
      });
      return 1;
    }

    // Count active debtors
    const effDebtors = this.effectiveDebtors(transaction, exclude);
    if (effDebtors.length === 0) {
      if (effectiveAmount > 0) {
        transaction.amount = excludedTotal;
        return 2;
      }
      return 0;
    }

    const q = Math.floor(effectiveAmount / effDebtors.length);
    let r = effectiveAmount % effDebtors.length;

    debts.forEach((d, i) => {
      if (exclude.has(i)) return;
      if (d.isDebtor) {
        d.owedAmount = q;
        if (r > 0 && i !== transaction.payer) {
          d.owedAmount += 1;
          --r;
        }
      } else {
        d.owedAmount = 0;
      }
    });

    return 0;
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

  getTransactionList(transactions) {
    // return sorted list of transaction ids based on timestamp
    if (!transactions) {
      return [];
    }
    return Object.entries(transactions)
      .sort(([, a], [, b]) => b.timestamp - a.timestamp) // Sort by timestamp (descending)
      .map(([id]) => id); // Extract the keys (IDs)
  },

  csvHeader(peopleNames = []) {
    return [
      'id',
      'name',
      'payer',
      'amount',
      'currency',
      ...peopleNames,
      'timestamp',
      'date',
    ];
  },

  toCsvLine(transaction, peopleNames = []) {
    const payerName =
      peopleNames[transaction.payer] ?? `Person${transaction.payer}`;
    const debts = transaction.debts.map((d, idx) => d.owedAmount);
    const date = new Date(transaction.timestamp);
    const dateStr = new Intl.DateTimeFormat('en-GB').format(
      new Date(transaction.timestamp),
    );

    return [
      transaction.id,
      transaction.name,
      payerName,
      transaction.amount,
      transaction.currency,
      ...debts,
      transaction.timestamp,
      dateStr,
    ];
  },

  searchString(transaction) {
    const name = (transaction.name || '').toLowerCase();
    const amount = String(transaction.amount || '').toLowerCase();
    const debts = (transaction.debts || [])
      .map((d) => String(d.owedAmount || '').toLowerCase())
      .join(' ');
    return `${name}|${amount}|${debts}`;
  },
};

export default Transaction;
