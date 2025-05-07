import Transaction from './transaction';

const Result = {
  make(nPeople = 0) {
    const mat = [];
    let ntransactions = 0;
    const ans = { mat, ntransactions };

    for (let i = 0; i < nPeople; ++i) {
      this.addPeople(ans, nPeople);
    }
    return ans;
  },

  isEmpty(result) {
    if (result.ntransactions === 0) return true;

    for (const row of result.mat) {
      for (const value of row) {
        if (value !== 0) return false;
      }
    }

    return true;
  },

  addPeople(result, nPeople) {
    for (let i = result.mat.length; i < nPeople; ++i) {
      result.mat.push(Array(result.mat.length).fill(0));
    }
  },

  getSummary(result, id) {
    if (id === null || id === undefined || id < 0 || id >= result.mat.length) {
      return [];
    }

    const ans = [];

    // Add the values from the row at 'id' with 0 appended
    for (let i = 0; i < result.mat[id].length; i++) {
      if (result.mat[id][i] !== 0) {
        ans.push({ person: i, amount: result.mat[id][i] });
      }
    }

    // Add the negative values of the column at 'id' from the lower triangle
    for (let i = id + 1; i < result.mat.length; i++) {
      if (result.mat[i][id] !== 0) {
        ans.push({ person: i, amount: -result.mat[i][id] });
      }
    }

    // Filter out zero values
    return ans;
  },

  applyTransaction(result, transaction, multi) {
    const j = transaction.payer;
    for (let i = 0; i < transaction.debts.length; ++i) {
      this._apply(result, i, j, multi * transaction.debts[i].owedAmount);
    }

    result.ntransactions += multi;
  },

  _apply(result, i, j, v) {
    if (i === j) {
      return;
    }

    if (i < j) {
      [i, j] = [j, i];
      v = -v;
    }

    result.mat[i][j] += v;
  },

  makeEquivalentTransactionBatch(
    result,
    fromCurrency,
    payerIdx,
    description,
    multiplier = 1.0,
    toCurrency = null,
  ) {
    // leaving the default values this function gives the settlement transactions. Adjusting multiplier and toCurrency
    // you can create the conversion transactions
    if (payerIdx == null || payerIdx < 0 || payerIdx >= result.mat.length) {
      return [];
    }

    toCurrency = toCurrency || fromCurrency; // Default to fromCurrency if not provided

    const n = result.mat.length;
    const transactions = new Array(n).fill(0); // Preallocate array with zeros

    // Compute transactions before the payer index
    for (let i = 0; i < payerIdx; i++) {
      transactions[i] = Math.round(multiplier * result.mat[payerIdx][i]);
    }

    // Compute transactions after the payer index
    for (let i = payerIdx + 1; i < n; i++) {
      transactions[i] = -Math.round(multiplier * result.mat[i][payerIdx]); // Flip sign
    }

    return Transaction.makeBatch(
      n,
      toCurrency,
      payerIdx,
      transactions,
      description,
    );
  },
};

const Results = {
  make(transactions = {}, nPeople = 0) {
    let nTransactions = 0;
    let nCurrencies = 0;
    const mats = {};
    const results = { nPeople, nTransactions, nCurrencies, mats };
    Results.applyTransactions(results, transactions, nPeople);
    return results;
  },

  getCurrencies(results) {
    return Object.entries(results.mats)
      .filter(([_, res]) => !Result.isEmpty(res))
      .map(([currency]) => currency);
  },

  applyTransactions(results, transactions, nPeople) {
    results.nPeople = nPeople;
    if (!nPeople) {
      return;
    }
    Object.values(transactions).forEach((tr) => {
      if (!(tr.currency in results.mats)) {
        results.mats[tr.currency] = Result.make(nPeople);
        ++results.nCurrencies;
      }
      Result.applyTransaction(results.mats[tr.currency], tr, 1);
      ++results.nTransactions;
    });
  },

  getSummary(results, id) {
    const ans = [];
    const totals = {};

    if (id < 0 || !results?.nPeople || id >= results.nPeople) {
      return { ans, totals };
    }

    // Loop over the currencies in results
    Object.entries(results.mats).forEach(([currency, result]) => {
      // Call getSummary on each result
      const l = Result.getSummary(result, id);
      let tot = 0;
      if (l.length > 0) {
        l.forEach((v) => {
          ans.push({ currency, person: v.person, amount: v.amount });
          tot += v.amount;
        });
      }
      if (tot != 0) {
        totals[currency] = tot;
      }
    });

    return { ans, totals };
  },

  makeEquivalentTransactionBatch(
    results,
    fromCurrency,
    payerIdx,
    description,
    multiplier = 1.0,
    toCurrency = null,
  ) {
    return Result.makeEquivalentTransactionBatch(
      results.mats[fromCurrency],
      fromCurrency,
      payerIdx,
      description,
      multiplier,
      toCurrency,
    );
  },
};

export default Results;
