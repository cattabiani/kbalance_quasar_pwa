import { describe, it, expect } from 'vitest';
import {
  nonJsonPaths,
  backupFileName,
  compareRestore,
  docLabels,
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

describe('nonJsonPaths', () => {
  it('accepts plain JSON values', () => {
    expect(nonJsonPaths({ a: [1, 'x', true, null, { b: 2.5 }] })).toEqual([]);
  });

  it('lists every value JSON cannot round-trip', () => {
    expect(nonJsonPaths({ t: new Date(), a: [1, undefined], n: NaN })).toEqual([
      't',
      'a[1]',
      'n',
    ]);
  });
});

describe('backup files', () => {
  it('round-trips through JSON', () => {
    const backup = makeBackup(docs(), 'proj', NOW);
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed).toEqual(backup);
    expect(parsed.createdAt).toBe('2026-11-27T10:00:00.000Z');
  });

  it('refuses to back up non-JSON data, listing all of it', () => {
    const bad = { 'sheets/x': { t: new Date() }, 'sheets/y': { n: NaN } };
    expect(() => makeBackup(bad, 'p')).toThrow('sheets/x.t, sheets/y.n');
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
    [
      'an unknown subcollection',
      '{"format":"kbalance-backup","formatVersion":1,"docs":{"sheets/x/pages/y":{}}}',
      'Unexpected document path',
    ],
    [
      'an empty id',
      '{"format":"kbalance-backup","formatVersion":1,"docs":{"sheets/":{}}}',
      'Unexpected document path',
    ],
    [
      'a document that is not an object',
      '{"format":"kbalance-backup","formatVersion":1,"docs":{"sheets/x":null}}',
      'not an object',
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
        name: 'Old trip',
        from: 0,
        to: currentVersion('sheets'),
        repairs: ['"Dinner": payer unknown, 10 EUR assigned to Anna'],
      },
      {
        path: 'users/me',
        name: 'me',
        from: 0,
        to: currentVersion('users'),
        repairs: [],
      },
    ]);
    expect(input).toEqual(docs()); // dry run: input untouched
  });

  it('never runs the sheet upgrade on a subcollection document', () => {
    const page = { 'sheets/old/pages/2024': legacySheet() };
    expect(planMigration(page)).toEqual([]);
  });

  it('reports a document whose upgrade fails instead of failing the plan', () => {
    const input = docs();
    delete input['sheets/old'].transactions.t1.debts; // breaks the v0 step

    const plan = planMigration(input);

    expect(plan[0]).toMatchObject({ path: 'sheets/old', from: 0 });
    expect(plan[0].error).toBeTruthy();
    expect(plan[1].path).toBe('users/me'); // the rest is still planned
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

describe('docLabels', () => {
  it('labels nameless ledgers with the name or email others know them by', () => {
    const labels = docLabels({
      'sheets/s': {
        name: 'Trip',
        people: {
          anon: { id: 'anon', name: '', email: 'anon@x.org' },
          bob: { id: 'bob', name: '', email: 'bob@x.org' },
        },
      },
      'users/me': { name: 'Me', friends: { bob: { id: 'bob', name: 'Bob' } } },
      'users/anon': { name: '' },
      'users/bob': { name: '' },
      'users/ghost': { name: '' },
    });

    expect(labels).toEqual({
      'sheets/s': 'Trip',
      'users/me': 'Me', // own name wins
      'users/anon': 'anon@x.org', // no name anywhere: email
      'users/bob': 'Bob', // a name from a friend list beats an email
      'users/ghost': '', // unknown: the page shows the path
    });
  });
});
