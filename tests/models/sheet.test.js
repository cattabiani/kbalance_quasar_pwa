import { describe, it, expect } from 'vitest';
import Sheet from '../../src/models/sheet.js';
import Transaction from '../../src/models/transaction.js';
import Person from '../../src/models/person.js';

const MAX_DOC_BYTES = 1024 * 1024;

// Stored size of a sheet doc per Firestore's rules
// (https://firebase.google.com/docs/firestore/storage-size).
const strBytes = (s) => new TextEncoder().encode(s).length + 1;
function bytes(value) {
  if (typeof value === 'string') return strBytes(value);
  if (typeof value === 'number') return 8;
  if (value === null || typeof value === 'boolean') return 1;
  if (Array.isArray(value)) return value.reduce((s, v) => s + bytes(v), 0);
  return Object.entries(value).reduce(
    (s, [k, v]) => s + strBytes(k) + bytes(v),
    0,
  );
}
const NAME_EXTRA = 16; // added to a document name's segments
const DOC_EXTRA = 32; // per document
const docBytes = (sheet) =>
  strBytes('sheets') +
  strBytes(sheet.id) +
  NAME_EXTRA +
  bytes(sheet) +
  DOC_EXTRA;

// A sheet with `nPeople` people, grown one transaction at a time until
// isNearlyFull() says so.
function growUntilNearlyFull(nPeople) {
  const people = Object.fromEntries(
    Array.from({ length: nPeople }, (_, i) => {
      const p = Person.make('', `Persön ${i}`, `p${i}@example.com`, i + 1);
      return [p.id, p];
    }),
  );
  const sheet = Sheet.make('Trip', people, {});
  while (!Sheet.isNearlyFull(sheet)) {
    for (let i = 0; i < 100; i++) {
      const tr = Transaction.make(nPeople, 'EUR');
      tr.name = 'Dinner at the café';
      tr.credits[0] = 4250;
      tr.debts[1] = 2125;
      tr.debts[2 % nPeople] += 2125;
      sheet.transactions[tr.id] = tr;
    }
  }
  return sheet;
}

describe('Sheet.isNearlyFull', () => {
  it('is false for a new sheet', () => {
    expect(Sheet.isNearlyFull(Sheet.make('Trip', {}, {}))).toBe(false);
  });

  // the warning must come before Firestore's limit, with room to spare,
  // even when most numbers are zeros (the JSON estimate's worst case)
  it.each([2, 4, 8, 12])('warns before the limit with %i people', (n) => {
    const size = docBytes(growUntilNearlyFull(n));
    expect(size).toBeLessThan(0.95 * MAX_DOC_BYTES);
    expect(size).toBeGreaterThan(0.5 * MAX_DOC_BYTES);
  });
});
