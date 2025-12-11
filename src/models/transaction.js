import { v4 as uuidv4 } from 'uuid';
import Utils from '../utils/utils.js';

const Transaction = {
  make(people, currency) {
    const nPeople = Array.isArray(people)
      ? people.length
      : people;
    let name = '';
    const id = uuidv4();
    const credits = Array.from({ length: nPeople }, () => 0);
    const debts = Array.from({ length: nPeople }, () => 0);
    let timestamp = Date.now();
    return { name, id, credits, currency, debts, timestamp };
  },

  make1to1(people, currency, creditorIdx, debtorIdx, value) {
    const nPeople = Array.isArray(people)
      ? people.length
      : people;
    const id = uuidv4();
    const credits = Array.from({ length: nPeople }, () => 0);
    const debts = Array.from({ length: nPeople }, () => 0);
    let timestamp = Date.now();
    credits[creditorIdx] = value;
    debts[debtorIdx] = value;

    const name = `${people[debtorIdx]} → ${people[creditorIdx]}` ? Array.isArray(people) : '';

    return { name, id, credits, currency, debts, timestamp };
  },

  update(tr) {
    // update to latest format
    if (!("amount" in tr)) return tr;

    const n = tr.debts.length;

    const credits = Array.from({ length: n }, () => 0);
    credits[tr.payer] = tr.amount ?? 0;

    tr.credits = credits;

    tr.debts = tr.debts.map(d => d.owedAmount ?? 0);

    delete tr.amount;
    delete tr.payer;
  },

  credit(tr) {
    this.update(tr);
    return tr.credits.reduce((sum, v) => sum + v, 0);
  },

  debt(tr) {
    this.update(tr);
    return tr.debts.reduce((sum, v) => sum + v, 0);
  },

  updatePeople(tr, nPeople) {
    this.update(tr);
    const delta = nPeople - tr.debts.length;
    if (delta <= 0) return;

    // Extend debts
   tr.debts.push(
      ...Array.from({ length: delta }, () => 0)
    );

    // Extend credits
    tr.credits.push(
      ...Array.from({ length: delta }, () => 0)
    );
  },

  debtors(tr) {
    this.update(tr);
    const credit = this.credit(tr);

    if (credit === 0) {
      return tr.debts.map(() => true);
    }

    return tr.debts.map(d => d !== 0);
  },

  payerIdx(tr) {
    this.update(tr);
    const credit = this.credit(tr);
    if (!tr.credits.length || credit === 0) return -1;

    for (let i = 0; i < tr.credits.length; i++) {
      if (tr.credits[i] === credit) {
        return i;
      }
    }
    return -1;
  },


  split(tr, debtors, exclude = new Set()) {
    this.update(tr);
    // 1. zero-out non-debtors
    for (let i = 0; i < tr.debts.length; i++) {
      if (!debtors[i]) tr.debts[i] = 0;
    }

    const totalAmount = this.credit(tr);

    // 2. sum fixed debt from excluded payers
    let fixedDebt = 0;
    for (const idx of exclude) fixedDebt += tr.debts[idx] || 0;

    // 3. list of indexes that are valid debtors
    const list = [];
    for (let i = 0; i < debtors.length; i++) {
      if (debtors[i] && !exclude.has(i)) list.push(i);
    }

    if (list.length === 0) return;

    // 4. distributable credit
    let credit = totalAmount - fixedDebt;
    if (credit <= 0) {
      for (const i of list) tr.debts[i] = 0;
      return;
    }

    // 5. sort list by descending credits before splitting
    list.sort((a, b) => tr.credits[a] - tr.credits[b]);

    const baseDebt = Math.floor(credit / list.length);
    let remainder = credit % list.length;

    for (const i of list) {
      tr.debts[i] = baseDebt;
      if (remainder > 0) {
        tr.debts[i] += 1;
        remainder--;
      }
    }
  },

  setAmount(tr, value, payerIdx, debtors, exclude = new Set()) {
    this.update(tr);
    // 1. reset + set payer credit
    for (let i = 0; i < tr.credits.length; i++) {
      tr.credits[i] = (i === payerIdx) ? value : 0;
    }

    // 2. run split
    this.split(tr, debtors, exclude);
  },

  setCustomAmount(tr, value, payerIdx, debtors) {
    this.update(tr);
    tr.credits[payerIdx] = value;
    this.split(tr, debtors);
  },

  setCustomDebt(tr, value, idx, debtors, exclude, defaultPayerIdx) {
    // Mark this participant as fixed
    exclude.add(idx);

    // Apply the fixed custom debt
    tr.debts[idx] = value;

    // Compute fixed total
    const fixedDebt = [...exclude].reduce((sum, i) => sum + tr.debts[i], 0);

    const totalAmount = this.credit(tr);

    // If fixed debts exceed total credit,
    // reset everything using setAmount(total fixed credit).
    if (fixedDebt > totalAmount) {
      // We must now make fixedDebt the new total credit.
      // defaultPayerIdx is the fallback payer index.
      this.setAmount(tr, fixedDebt, defaultPayerIdx, debtors, exclude);
      return;
    }

    // Otherwise normal redistribution
    this.split(tr, debtors, exclude);
  },

  searchString(tr) {
    const name = (tr.name || '').toLowerCase();
    
    const credits = (tr.credits || [])
      .filter(a => a > 0)           // only non-zero credits
      .map(a => String(a).toLowerCase())
      .join(' ');

    const debts = (tr.debts || [])
      .filter(a => a > 0)           // only non-zero credits
      .map(a => String(a).toLowerCase())
      .join(' ');

    return `${name}|${credits}|${debts}`;
  },

  getTransactionList(tr) {
    // return sorted list of transaction ids based on timestamp
    if (!tr) {
      return [];
    }
    return Object.entries(tr)
      .sort(([, a], [, b]) => b.timestamp - a.timestamp) // Sort by timestamp (descending)
      .map(([id]) => id); // Extract the keys (IDs)
  },

  check(tr) {
    this.update(tr);
    const credit = this.credit(tr);
    const debt = this.debt(tr);
    if (debt !== credit) {
      throw new Error(
        `The owed credits: ${
          debt / 100
        } do not sum up to the transaction credit: ${
          credit / 100
        }! Probably you need to fix either the shares or the total credit.`,
      );
    }
  },

  csvHeader(peopleNames = []) {
    return [
      'id',
      'name',
      'currency',
      'timestamp',
      'date',
      ...peopleNames,
      ...peopleNames,
    ];
  },

  toCsvLine(tr) {
    this.update(tr);
    const debts = tr.debts.map((d, idx) => d.owedAmount);
    const dateStr = new Intl.DateTimeFormat('en-GB').format(
      new Date(tr.timestamp),
    );

    return [
      tr.id,
      tr.name,
      tr.currency,
      tr.timestamp,
      dateStr,
      ...tr.credits,
      ...debts,
    ];
  },


  state(tr) {
    this.update(tr);

    if (tr.debts.length !== 2) {
      return -1;
    }

    if (this.debt(tr) === 0) {
      return 1;
    }

    if (tr.debts[0] === 0) {
        return 0;
    }

    if (tr.debts[1] === 0) {
        return 0;
    }

    const credit2 = Math.floor(this.credit(tr) / 2);
    if (tr.debts[0] >= credit2 && tr.debts[1] >= credit2) {
      return 1;
    }

    return -1;
  },

  simplify(tr) {
    Utils.add(tr.credits, tr.debts, -1);
    for (let i = 0; i < tr.credits.length; ++i) {
      if (tr.credits[i] >= 0) {
         tr.debts[i] = 0;
      } else {
        tr.debts[i] = -tr.credits[i];
        tr.credits[i] = 0;
      }
    }
  },

  add(tr0, tr1, multi) {
    if (tr0.currency !== tr1.currency) {
      throw new Error(`Trying to combine transactions with different currencies: ${tr0.currency} with ${tr1.currency}`)
    }

    tr0.name = '';

    Utils.add(tr0.credits, tr1.credits, multi);
    Utils.add(tr0.debts, tr1.debts, multi);

    this.simplify(tr0);
  },

  convert(tr, conversionRate, newCurrency) {
    if (tr.currency === newCurrency) {
      return tr;
    }

    const ans = Transaction.make(tr.credits.length, newCurrency);
    ans.credits = Utils.convertArray(tr.credits, conversionRate);
    ans.debts = Utils.convertArray(tr.debts, conversionRate)

    return ans;
  },

  isEmpty(tr) {
    return tr.credits.every(b => b === 0) && tr.debts.every(b => b === 0);
  },

  minCashFlow(tr, people) {
    const trList = [];
    const balances = [...tr.credits];

    Utils.add(balances, tr.debts, -1);    
    let balList = balances
      .map((balance, index) => ({ index, balance }))
      .filter(({ balance }) => balance !== 0);

    while (balList.length > 0) {
      // Find debtor (min) and creditor (max) efficiently
      let debtorIdx = 0;
      let creditorIdx = 0;
      for (let i = 1; i < balList.length; i++) {
        if (balList[i].balance < balList[debtorIdx].balance) {
          debtorIdx = i;
        }
        if (balList[i].balance > balList[creditorIdx].balance) {
          creditorIdx = i;
        }
      }

      const debtor = balList[debtorIdx];
      const creditor = balList[creditorIdx];

      const settle = Math.min(-debtor.balance, creditor.balance);
      trList.push(Transaction.make1to1(people, tr.currency, debtor.index, creditor.index, settle));

      debtor.balance += settle;
      creditor.balance -= settle;

      // Remove settled parties
      balList = balList.filter((p) => p.balance !== 0);
    }

    return trList;
  },

  summary(tr, people, idx) {
    const trList = this.minCashFlow(tr, people);
    return trList.filter((tr) => tr.credits[idx] > 0 || tr.debts[idx] > 0);
  },

  settle(tr, people, idx) {
    const trList = this.summary(tr, people, idx);
    if (trList.length === 0) {
      return;
    }
    for (let i = 1; i < trList.length; ++i) {
      Transaction.add(trList[0], trList[i], 1);
    }
    return trList[0];
  },

  convertPerson(tr, people, idx, conversionRate, newCurrency) {
    const settleTr = this.settle(tr, people, idx);
    const conversionTr = Transaction.convert(settleTr, conversionRate, newCurrency);
    [conversionTr.credits, conversionTr.debts] =
  [conversionTr.debts, conversionTr.credits];

    return [settleTr, conversionTr]
  },

};

export default Transaction;
