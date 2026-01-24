import Transaction from './transaction';

const Statistics = {
  /**
   * Compute baseline stats from transactions.
   * Only returns name, currency, and value (sum of credits).
   * Does NOT filter or apply convertCurrency.
   */
  make(transactions) {
    const results = [];

    for (const tr of Object.values(transactions)) {
      const value = Transaction.credit(tr); // sum of credits
      results.push({
        name: tr.name,
        currency: tr.currency,
        value,
        timestamp: tr.timestamp,
      });
    }

    // Sort by timestamp ascending
    results.sort((a, b) => a.timestamp - b.timestamp);

    return results;
  },

    computeTotalMonthsAndIndex(statsArray) {
    if (!statsArray || statsArray.length === 0) return { totalMonths: 0, monthIndexMap: {} };

    const firstDate = new Date(statsArray[0].timestamp);
    const lastDate = new Date(statsArray[statsArray.length - 1].timestamp);

    const startYear = firstDate.getFullYear();
    const startMonth = firstDate.getMonth();
    const endYear = lastDate.getFullYear();
    const endMonth = lastDate.getMonth();

    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    const monthIndexMap = {};

    for (let i = 0; i < totalMonths; i++) {
        const y = startYear + Math.floor((startMonth + i) / 12);
        const m = (startMonth + i) % 12;
        monthIndexMap[`${y}-${m}`] = i;
    }

    return { totalMonths, monthIndexMap };
    }
};

export default Statistics;
