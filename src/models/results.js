import Transaction from './transaction';

const Results = {
  make(transactions, nPeople) {
    const nTransactions = 0;
    const perCurrencyBalance = {};
    const results = { nPeople, nTransactions, perCurrencyBalance };

    if (nPeople <= 0) {
      return results;
    }
    Object.values(transactions).forEach((tr) => {
      this.applyTransaction(results, tr);
    });
    return results;
  },

  applyTransaction(results, tr, multi = 1) {
    Transaction.update(tr);
    if (!(tr.currency in results.perCurrencyBalance)) {
      results.perCurrencyBalance[tr.currency] = Transaction.make(
        tr.credits.length,
        tr.currency,
      );
    }
    Transaction.add(results.perCurrencyBalance[tr.currency], tr, multi);
    ++results.nTransactions;
  },

  currencies(results) {
    return new Set(
      Object.entries(results.perCurrencyBalance)
        .filter(([_, res]) => !Transaction.isEmpty(res))
        .map(([currency]) => currency),
    );
  },

  summary(results, idx) {
    if (!results || !results.perCurrencyBalance) return {};
    const ans = {};
    for (const [currency, tr] of Object.entries(results.perCurrencyBalance)) {
      const total = tr.credits[idx] - tr.debts[idx];
      if (total !== 0) {
        ans[currency] = Transaction.summary(tr, idx);
      }
    }

    return ans;
  },
};

export default Results;
