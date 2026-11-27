import { v4 as uuidv4 } from 'uuid';
import { currentVersion } from './schema';

// Firestore's maximum document size. A sheet keeps all its transactions in
// one document, so a sheet that reaches it can't take new entries.
export const MAX_DOC_BYTES = 1024 * 1024;

// Stored size of a field value, per Firestore's rules
// (https://firebase.google.com/docs/firestore/storage-size).
function valueBytes(value) {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return 1;
  }
  if (typeof value === 'number') return 8;
  if (typeof value === 'string') return stringBytes(value);
  if (Array.isArray(value)) {
    return value.reduce((sum, v) => sum + valueBytes(v), 0);
  }
  return fieldsBytes(value);
}

const encoder = new TextEncoder();
const stringBytes = (s) => encoder.encode(s).length + 1;

const fieldsBytes = (map) =>
  Object.entries(map).reduce(
    (sum, [key, value]) => sum + stringBytes(key) + valueBytes(value),
    0,
  );

// Stored size of document `collection/id` with fields `data`, in bytes.
export function docBytes(collection, id, data) {
  const name = stringBytes(collection) + stringBytes(id) + 16;
  return name + fieldsBytes(data) + 32;
}

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

  // How full the sheet's document is: 0 (empty) to 1 (Firestore's limit).
  fullness(sheet) {
    return docBytes('sheets', sheet.id, sheet) / MAX_DOC_BYTES;
  },
};

export default Sheet;
