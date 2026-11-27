import { v4 as uuidv4 } from 'uuid';
import { currentVersion } from './schema';

// A sheet is one Firestore document (max 1 MiB). JSON length underestimates
// its stored size (numbers take 8 bytes), so warn early; the margin is
// checked in tests/models/sheet.test.js.
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
