import Transaction from './transaction';
import Utils from '../utils/utils';

const Statistics = {
  getTotalMonths(startTs, endTs) {
    if (!startTs || !endTs) return { totalMonths: 0, monthIndexMap: {} };

    const start = new Date(startTs);
    const end = new Date(endTs);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    const totalMonths =
      (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    return totalMonths;
  },

  getTotalYears(startTs, endTs) {
    if (!startTs || !endTs) return { totalMonths: 0, monthIndexMap: {} };

    const start = new Date(startTs);
    const end = new Date(endTs);

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    return endYear - startYear + 1;
  },

  getMonthIndexMap(startTs, totalMonths) {
    const start = new Date(startTs);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const monthIndexMap = {};
    for (let i = 0; i < totalMonths; i++) {
      const y = startYear + Math.floor((startMonth + i) / 12);
      const m = (startMonth + i) % 12;
      monthIndexMap[`${y}-${m}`] = i;
    }
    return monthIndexMap;
  },

  monthIdx2date(startTs, idx) {
    const start = new Date(startTs);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();

    const y = startYear + Math.floor((startMonth + idx) / 12);
    const m = (startMonth + idx) % 12;

    const date = new Date(y, m, 1);

    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  },
};

export default Statistics;
