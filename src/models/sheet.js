import { v4 as uuidv4 } from 'uuid';
import { currentVersion } from './schema';

// A sheet is one Firestore document, so it can't exceed 1 MiB: once full, it
// can't take new entries. Its JSON length estimates its stored size, but
// low: Firestore stores every number in 8 bytes, while a `0` in `credits` or
// `debts` is one JSON character, so sheets with many people are bigger than
// their JSON. Warning at 60% of the JSON length means warning at ~55% (2
// people) to ~87% (12 people) of the real limit; tests/models/sheet.test.js
// checks it.
const NEARLY_FULL_CHARS = 0.6 * 1024 * 1024;

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
    return JSON.stringify(sheet).length >= NEARLY_FULL_CHARS;
  },
};

export default Sheet;
