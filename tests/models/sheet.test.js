import { describe, it, expect } from 'vitest';
import Sheet, {
  docBytes,
  MAX_DOC_BYTES,
  NEARLY_FULL,
} from '../../src/models/sheet.js';

describe('docBytes', () => {
  // the worked example in Firestore's storage-size docs: 147 bytes
  it('matches the Firestore documentation example', () => {
    const name = 'users/jeff/tasks/my_task_id';
    const [, , collection, id] = name.split('/');
    const data = {
      type: 'Personal',
      done: false,
      priority: 1,
      description: 'Learn Cloud Firestore',
    };
    // docBytes takes a top-level path; add the extra segments' bytes
    const extra = 'users'.length + 1 + 'jeff'.length + 1;
    expect(docBytes(collection, id, data) + extra).toBe(147);
  });

  it('counts nested maps, arrays, null and UTF-8', () => {
    const data = { m: { a: [1, 2], b: null }, é: 'ü' };
    // m: 2 + (a: 2 + 16, b: 2 + 1) ; é: 3 + 3
    const fields = 2 + 18 + 3 + 6;
    expect(docBytes('c', 'i', data)).toBe(2 + 2 + 16 + fields + 32);
  });
});

describe('Sheet.fullness', () => {
  it('is small for a new sheet', () => {
    expect(Sheet.fullness(Sheet.make('Trip', {}, {}))).toBeLessThan(0.001);
  });

  it('grows with the transactions', () => {
    const sheet = Sheet.make('Trip', {}, {});
    sheet.transactions.t = { name: 'x'.repeat(MAX_DOC_BYTES / 2) };
    expect(Sheet.fullness(sheet)).toBeCloseTo(0.5, 2);
  });
});

describe('Sheet.isNearlyFull', () => {
  const sheetOf = (fullness) => {
    const sheet = Sheet.make('Trip', {}, {});
    sheet.transactions.t = { name: 'x'.repeat(fullness * MAX_DOC_BYTES) };
    return sheet;
  };

  it('is false below the threshold and true from it on', () => {
    expect(Sheet.isNearlyFull(sheetOf(NEARLY_FULL - 0.01))).toBe(false);
    expect(Sheet.isNearlyFull(sheetOf(NEARLY_FULL))).toBe(true);
  });
});
