// Backup files and migration planning for the admin page (#41).
// Pure: no Firebase. Documents are handled as a map { 'collection/id': data }.

import _ from 'lodash';
import { upgrade, currentVersion, isVersioned } from './schema';

// Top-level collections included in backups. #38 adds the `pages`
// subcollection of sheets: list it here and in adminDb.fetchAll().
export const COLLECTIONS = ['sheets', 'users', 'config'];

const FORMAT = 'kbalance-backup';
const FORMAT_VERSION = 1;

// Collection key of a document path: its collection segments, so a
// subcollection document (sheets/x/pages/y → 'sheets/pages') is never taken
// for a document of its parent collection. null for a malformed path.
function collectionOf(path) {
  const segments = path.split('/');
  if (segments.length % 2 || segments.some((s) => !s)) return null;
  return segments.filter((segment, i) => i % 2 === 0).join('/');
}

// Paths inside `value` that JSON can't round-trip (e.g. a Firestore
// Timestamp, NaN): a backup must restore exactly what was read.
export function nonJsonPaths(value, where = '') {
  if (value === null || ['string', 'boolean'].includes(typeof value)) {
    return [];
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? [] : [where];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => nonJsonPaths(v, `${where}[${i}]`));
  }
  if (_.isPlainObject(value)) {
    return Object.entries(value).flatMap(([k, v]) =>
      nonJsonPaths(v, where ? `${where}.${k}` : k),
    );
  }
  return [where];
}

// Throws listing every value that can't be backed up, so they can all be
// fixed (e.g. in the Firestore console) in one go.
export function makeBackup(docs, projectId, createdAt = new Date()) {
  const bad = Object.entries(docs).flatMap(([path, data]) =>
    nonJsonPaths(data, path),
  );
  if (bad.length) {
    throw new Error(`Values that can't be backed up: ${bad.join(', ')}`);
  }
  return {
    format: FORMAT,
    formatVersion: FORMAT_VERSION,
    projectId,
    createdAt: createdAt.toISOString(),
    docs,
  };
}

export function backupFileName(prefix, projectId, createdAt = new Date()) {
  const stamp = createdAt.toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${projectId}-${stamp}.json`;
}

// Parses and validates a backup file's text. Throws a readable error.
export function parseBackup(text) {
  let backup;
  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error('Not a JSON file.');
  }
  if (backup?.format !== FORMAT) {
    throw new Error('Not a kBalance backup file.');
  }
  if (backup.formatVersion !== FORMAT_VERSION) {
    throw new Error(`Unsupported backup version ${backup.formatVersion}.`);
  }
  if (!backup.docs || typeof backup.docs !== 'object') {
    throw new Error('Backup has no documents.');
  }
  for (const [path, data] of Object.entries(backup.docs)) {
    if (!COLLECTIONS.includes(collectionOf(path))) {
      throw new Error(`Unexpected document path in backup: ${path}`);
    }
    if (!_.isPlainObject(data)) {
      throw new Error(`Document ${path} in backup is not an object.`);
    }
  }
  return backup;
}

// Per collection: number of documents per schemaVersion, e.g.
// { sheets: { current: 1, versions: { 0: 3, 1: 40 } }, config: { count: 1 } }
export function versionStatus(docs) {
  const status = {};
  for (const collection of COLLECTIONS) {
    const entries = Object.entries(docs).filter(
      ([path]) => collectionOf(path) === collection,
    );
    if (!isVersioned(collection)) {
      status[collection] = { count: entries.length };
      continue;
    }
    const versions = _.countBy(entries, ([, data]) => data.schemaVersion ?? 0);
    status[collection] = { current: currentVersion(collection), versions };
  }
  return status;
}

// Upgrades a deep copy of `data`; returns { after, repairs, changed }.
// Single-document steps only (see adminDb.migrateDocs).
export function upgradeCopy(path, data) {
  const repairs = [];
  const after = upgrade(collectionOf(path), _.cloneDeep(data), (msg) =>
    repairs.push(msg),
  );
  return { after, repairs, changed: !_.isEqual(after, data) };
}

// Dry run: which documents the migration would rewrite, and the repairs it
// would make: [{ path, from, to, repairs }]. A document whose upgrade throws
// gets { path, from, error } instead and is skipped by the migration.
export function planMigration(docs) {
  return Object.entries(docs)
    .filter(([path]) => isVersioned(collectionOf(path)))
    .map(([path, data]) => {
      const from = data.schemaVersion ?? 0;
      try {
        const { after, repairs, changed } = upgradeCopy(path, data);
        return changed && { path, from, to: after.schemaVersion, repairs };
      } catch (e) {
        return { path, from, error: e.message };
      }
    })
    .filter(Boolean);
}

// Compares a backup with live data, per backup document:
// 'same' | 'changed' (live differs) | 'deleted' (no longer live).
// Live documents not in the backup are not listed: restore never deletes.
export function compareRestore(backupDocs, liveDocs) {
  return Object.entries(backupDocs).map(([path, data]) => {
    let status = 'deleted';
    if (path in liveDocs) {
      status = _.isEqual(liveDocs[path], data) ? 'same' : 'changed';
    }
    return { path, status, name: data.name ?? '' };
  });
}
