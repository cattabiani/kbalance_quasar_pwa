import { v4 as uuidv4 } from 'uuid';
import { currentVersion } from './schema';

// A sheet is one Firestore document (max 1 MiB), almost all transactions.
// One transaction takes ~150 bytes (ids, a short name, currency, timestamp)
// plus 16 per person (a credit and a debt, 8 bytes each). Warn at 80%: the
// margin covers longer names. tests/models/sheet.test.js checks the estimate.
const txBytes = (nPeople) => 150 + 16 * nPeople;
const NEARLY_FULL_BYTES = 0.8 * 1024 * 1024;

const Sheet = {
  make(name, people, users) {
    const id = uuidv4();
    const timestamp = Date.now();
    const transactions = {};
    const newSheet = {
      schemaVersion: currentVersion('sheets'),
      name,
      users,
      id,
      people,
      transactions,
      timestamp,
    };
    return newSheet;
  },

  isNearlyFull(sheet) {
    const nPeople = Object.keys(sheet.people ?? {}).length;
    const nTransactions = Object.keys(sheet.transactions ?? {}).length;
    return nTransactions * txBytes(nPeople) >= NEARLY_FULL_BYTES;
  },
};

export default Sheet;
