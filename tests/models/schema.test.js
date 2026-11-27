import { describe, it, expect } from 'vitest';
import { upgrade, currentVersion } from '../../src/models/schema.js';
import Sheet from '../../src/models/sheet.js';
import UserLedger from '../../src/models/userLedger.js';

// One fixture per stored version. When adding a step, add the fixture of the
// version it upgrades from and check it reaches the current version.

const sheetV0 = () => ({
  id: 's1',
  name: 'Trip',
  users: { a: 'owner', b: 'owner' },
  people: {
    a: { id: 'a', name: 'Anna', timestamp: 2 },
    b: { id: 'b', name: 'Bob', timestamp: 1 }, // added first: index 0
  },
  timestamp: 1,
  transactions: {
    // single payer + amount, debts as objects
    legacy: {
      id: 'legacy',
      name: 'Dinner',
      currency: 'EUR',
      amount: 50,
      payer: 1,
      debts: [
        { isDebtor: true, owedAmount: 20 },
        { isDebtor: true, owedAmount: 30 },
        { isDebtor: false, owedAmount: 0 },
      ],
    },
    // already credits/debts arrays (written by a newer app on a v0 sheet)
    modern: { id: 'modern', currency: 'EUR', credits: [10, 0], debts: [5, 5] },
  },
});

describe('upgrade: sheets', () => {
  it('v0 → current converts legacy transactions', () => {
    const sheet = upgrade('sheets', sheetV0());

    expect(sheet.schemaVersion).toBe(currentVersion('sheets'));
    expect(sheet.transactions.legacy).toEqual({
      id: 'legacy',
      name: 'Dinner',
      currency: 'EUR',
      credits: [0, 50, 0],
      debts: [20, 30, 0],
    });
    expect(sheet.transactions.modern).toEqual(sheetV0().transactions.modern);
  });

  it.each([
    ['missing', undefined],
    ['out of range', 5],
  ])('v0 with %s payer credits person 0 and warns', (_, payer) => {
    const sheet = sheetV0();
    sheet.transactions.legacy.payer = payer;
    const warnings = [];

    upgrade('sheets', sheet, (msg) => warnings.push(msg));

    expect(sheet.transactions.legacy.credits).toEqual([50, 0, 0]);
    expect(warnings).toEqual([
      '"Dinner": payer unknown, 50 EUR assigned to Bob',
    ]);
  });

  it('v0 without transactions upgrades', () => {
    const { transactions: _, ...noTransactions } = sheetV0();
    expect(upgrade('sheets', noTransactions).schemaVersion).toBe(
      currentVersion('sheets'),
    );
  });

  it('upgrades in place and returns the same object', () => {
    const input = sheetV0();
    expect(upgrade('sheets', input)).toBe(input);
    expect(input.schemaVersion).toBe(currentVersion('sheets'));
  });

  it('leaves a current document unchanged', () => {
    const current = upgrade('sheets', sheetV0());
    const copy = structuredClone(current);
    expect(upgrade('sheets', current)).toEqual(copy);
  });

  it('leaves a document newer than this build alone', () => {
    const future = {
      ...sheetV0(),
      schemaVersion: currentVersion('sheets') + 1,
    };
    const copy = structuredClone(future);
    expect(upgrade('sheets', future)).toEqual(copy);
  });
});

describe('upgrade: users', () => {
  it('v0 → current only adds schemaVersion', () => {
    const ledger = { name: 'me', friends: {}, sheets: {} };
    expect(upgrade('users', ledger)).toEqual({
      ...ledger,
      schemaVersion: currentVersion('users'),
    });
  });
});

describe('upgrade: unknown collection', () => {
  it('throws', () => {
    expect(() => upgrade('nope', {})).toThrow('Unknown collection');
  });
});

describe('new documents are current', () => {
  it('Sheet.make', () => {
    expect(Sheet.make('x', {}, {}).schemaVersion).toBe(
      currentVersion('sheets'),
    );
  });

  it('UserLedger.make', () => {
    expect(UserLedger.make().schemaVersion).toBe(currentVersion('users'));
  });
});
