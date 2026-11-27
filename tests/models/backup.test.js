import { describe, it, expect } from 'vitest';
import {
  assertPlainJson,
  backupFileName,
  compareRestore,
  makeBackup,
  parseBackup,
  planMigration,
  versionStatus,
} from '../../src/models/backup.js';
import { currentVersion } from '../../src/models/schema.js';

const NOW = new Date('2026-11-27T10:00:00.000Z');

// a v0 sheet with one legacy transaction whose payer is missing
const legacySheet = () => ({
  id: 'old',
  name: 'Old trip',
  people: { a: { id: 'a', name: 'Anna', timestamp: 1 } },
  transactions: {
    t1: { id: 't1', name: 'Dinner', currency: 'EUR', amount: 10, debts: [10] },
  },
});

const docs = () => ({
  'sheets/old': legacySheet(),
  'sheets/new': {
    id: 'new',
    name: 'New trip',
    schemaVersion: currentVersion('sheets'),
  },
  'users/me': { name: 'me', friends: {}, sheets: {} },
  'config/app': { minSchemaVersion: { sheets: 1 } },
});

describe('assertPlainJson', () => {
  it('accepts plain JSON values', () => {
    expect(() =>
      assertPlainJson({ a: [1, 'x', true, null, { b: 2.5 }] }),
    ).not.toThrow();
  });

  it.each([
    ['a class instance', { t: new Date() }, 't'],
    ['undefined', { a: [1, undefined] }, 'a[1]'],
    ['NaN', { n: NaN }, 'n'],
  ])('rejects %s and says where', (_, value, where) => {
    expect(() => assertPlainJson(value)).toThrow(`at ${where}`);
  });
});

describe('backup files', () => {
  it('round-trips through JSON', () => {
    const backup = makeBackup(docs(), 'proj', NOW);
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed).toEqual(backup);
    expect(parsed.createdAt).toBe('2026-11-27T10:00:00.000Z');
  });

  it('refuses to back up non-JSON data', () => {
    expect(() => makeBackup({ 'sheets/x': { t: new Date() } }, 'p')).toThrow(
      'sheets/x.t',
    );
  });

  it.each([
    ['not JSON', 'nope', 'Not a JSON file'],
    ['another JSON', '{"a":1}', 'Not a kBalance backup'],
    [
      'a newer format',
      '{"format":"kbalance-backup","formatVersion":99,"docs":{}}',
      'Unsupported backup version',
    ],
    [
      'an unknown path',
      '{"format":"kbalance-backup","formatVersion":1,"docs":{"evil/x":{}}}',
      'Unexpected document path',
    ],
  ])('parseBackup rejects %s', (_, text, message) => {
    expect(() => parseBackup(text)).toThrow(message);
  });

  it('file names are filesystem-safe', () => {
    expect(backupFileName('kbalance-backup', 'proj', NOW)).toBe(
      'kbalance-backup-proj-2026-11-27T10-00-00-000Z.json',
    );
  });
});

describe('versionStatus', () => {
  it('counts documents per version', () => {
    const current = currentVersion('sheets');
    expect(versionStatus(docs())).toEqual({
      sheets: { current, versions: { 0: 1, [current]: 1 } },
      users: { current: currentVersion('users'), versions: { 0: 1 } },
      config: { count: 1 },
    });
  });
});

describe('planMigration', () => {
  it('lists outdated documents with their repairs, without changing them', () => {
    const input = docs();
    const plan = planMigration(input);

    expect(plan).toEqual([
      {
        path: 'sheets/old',
        from: 0,
        to: currentVersion('sheets'),
        repairs: ['"Dinner": payer unknown, 10 EUR assigned to Anna'],
      },
      { path: 'users/me', from: 0, to: currentVersion('users'), repairs: [] },
    ]);
    expect(input).toEqual(docs()); // dry run: input untouched
  });
});

describe('compareRestore', () => {
  it('marks each backup document same, changed or deleted', () => {
    const live = docs();
    live['sheets/new'].name = 'Renamed';
    delete live['users/me'];
    live['sheets/created-later'] = { name: 'Later' };

    expect(compareRestore(docs(), live)).toEqual([
      { path: 'sheets/old', status: 'same', name: 'Old trip' },
      { path: 'sheets/new', status: 'changed', name: 'New trip' },
      { path: 'users/me', status: 'deleted', name: 'me' },
      { path: 'config/app', status: 'same', name: '' },
    ]);
  });
});
