import Transaction from './transaction';
import Utils from '../utils/utils.js';

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
      if (!(tr.currency in results.perCurrencyBalance)) {
        results.perCurrencyBalance[tr.currency] = Transaction.make(tr.credits.length, tr.currency);
      }
      Transaction.add(results.perCurrencyBalance[tr.currency], tr, multi);
      ++results.nTransactions;
  },

  currencies(results) {
        return Object.entries(results.perCurrencyBalance)
      .filter(([_, res]) => !Transaction.isEmpty(res))
      .map(([currency]) => currency);
  },

  summary(results, idx){
    const ans = {};
    for (const [currency, result] of Object.entries(results.perCurrencyBalance)) {
      const transactions = Transaction.summary(result, idx);
      let total = 0;
      transactions.forEach((v => {
        total += v.credits[idx] - v.debts[idx];
      }));
      if (total !== 0) {
        ans[currency] = {total, transactions};
      }
    }
    return ans;
  }
};

export default Results;



  // getSummary(results, id) {
  //   const ans = [];
  //   const totals = {};

  //   if (id < 0 || !results?.nPeople || id >= results.nPeople) {
  //     return { ans, totals };
  //   }

  //   // Loop over the currencies in results
  //   Object.entries(results.mats).forEach(([currency, result]) => {
  //     // Call getSummary on each result
  //     const l = Result.getSummary(result, id);
  //     let tot = 0;
  //     if (l.length > 0) {
  //       l.forEach((v) => {
  //         ans.push({ currency, person: v.person, amount: v.amount });
  //         tot += v.amount;
  //       });
  //     }
  //     if (tot != 0) {
  //       totals[currency] = tot;
  //     }
  //   });

  //   return { ans, totals };
  // },

  // makeEquivalentTransactionBatch(
  //   results,
  //   fromCurrency,
  //   payerIdx,
  //   description,
  //   multiplier = 1.0,
  //   toCurrency = null,
  // ) {
  //   return Result.makeEquivalentTransactionBatch(
  //     results.mats[fromCurrency],
  //     fromCurrency,
  //     payerIdx,
  //     description,
  //     multiplier,
  //     toCurrency,
  //   );
  // },




    /////////////////

  // _simplify(result) {
  //   if (result.mat.length < 3) {
  //     return;
  //   }

  //   const ans = [];
  //   for (let i = 0; i < result.mat.length; i++) {
  //     ans.push(Array(i).fill(0));
  //   }

  //   const transactions = this._minCashFlow(result.mat);
  //   for (const [i, j, w] of transactions) {
  //     this._apply(ans, i, j, w);
  //   }

  //   result.mat = ans;
  // },

  // getSummary(result, id) {
  //   if (id === null || id === undefined || id < 0 || id >= result.mat.length) {
  //     return [];
  //   }

  //   const ans = [];

  //   // Add the values from the row at 'id' with 0 appended
  //   for (let i = 0; i < result.mat[id].length; i++) {
  //     if (result.mat[id][i] !== 0) {
  //       ans.push({ person: i, amount: result.mat[id][i] });
  //     }
  //   }

  //   // Add the negative values of the column at 'id' from the lower triangle
  //   for (let i = id + 1; i < result.mat.length; i++) {
  //     if (result.mat[i][id] !== 0) {
  //       ans.push({ person: i, amount: -result.mat[i][id] });
  //     }
  //   }

  //   // Filter out zero values
  //   return ans;
  // },

  // applyTransaction(result, transaction, multi) {
  //   const j = transaction.payer;
  //   for (let i = 0; i < transaction.debts.length; ++i) {
  //     this._apply(result.mat, i, j, multi * transaction.debts[i].owedAmount);
  //   }

  //   result.ntransactions += multi;
  // },

  // _apply(mat, i, j, v) {
  //   if (i === j) {
  //     return;
  //   }

  //   if (i < j) {
  //     [i, j] = [j, i];
  //     v = -v;
  //   }

  //   mat[i][j] += v;
  // },

  // makeEquivalentTransactionBatch(
  //   result,
  //   fromCurrency,
  //   payerIdx,
  //   description,
  //   multiplier = 1.0,
  //   toCurrency = null,
  // ) {
  //   // leaving the default values this function gives the settlement transactions. Adjusting multiplier and toCurrency
  //   // you can create the conversion transactions
  //   if (payerIdx == null || payerIdx < 0 || payerIdx >= result.mat.length) {
  //     return [];
  //   }

  //   toCurrency = toCurrency || fromCurrency; // Default to fromCurrency if not provided

  //   const n = result.mat.length;
  //   const transactions = new Array(n).fill(0); // Preallocate array with zeros

  //   // Compute transactions before the payer index
  //   for (let i = 0; i < payerIdx; i++) {
  //     transactions[i] = Math.round(multiplier * result.mat[payerIdx][i]);
  //   }

  //   // Compute transactions after the payer index
  //   for (let i = payerIdx + 1; i < n; i++) {
  //     transactions[i] = -Math.round(multiplier * result.mat[i][payerIdx]); // Flip sign
  //   }

  //   return Transaction.makeBatch(
  //     n,
  //     toCurrency,
  //     payerIdx,
  //     transactions,
  //     description,
  //   );
  // },
