import { describe, it, expect } from 'vitest';
import Sheet from '../../src/models/sheet.js';

describe('Sheet.isNearlyFull', () => {
  const sheetWith = (chars) => {
    const sheet = Sheet.make('Trip', {}, {});
    sheet.transactions.t = { name: 'x'.repeat(chars) };
    return sheet;
  };

  it('is false for a new sheet', () => {
    expect(Sheet.isNearlyFull(Sheet.make('Trip', {}, {}))).toBe(false);
  });

  it('is true at about 90% of 1 MiB', () => {
    expect(Sheet.isNearlyFull(sheetWith(900_000))).toBe(false);
    expect(Sheet.isNearlyFull(sheetWith(950_000))).toBe(true);
  });
});
