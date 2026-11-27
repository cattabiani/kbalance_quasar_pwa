import { v4 as uuidv4 } from 'uuid';
import { currentVersion } from './schema';

// A sheet is one Firestore document, so it can't exceed 1 MiB: once full, it
// can't take new entries. Its JSON length is a good enough (slightly high)
// estimate of its stored size; warn at about 90%.
const NEARLY_FULL_CHARS = 0.9 * 1024 * 1024;

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
