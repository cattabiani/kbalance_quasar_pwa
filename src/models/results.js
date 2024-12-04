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

  applyTransactions(results, transactions, nPeople) {
    results.nPeople = nPeople;
    if (!nPeople) {return; }
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
};

export default Results;
