// Firestore access for the admin page (#41). Needs the admin rule
// (firestore.rules, isAdmin) for anything beyond the user's own documents.
//
// Always reads from the server, never from the offline cache: a backup or
// migration must see the real stored data.

import {
  collection,
  doc,
  getDocsFromServer,
  getDocFromServer,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import _ from 'lodash';
import { getDb } from 'src/stores/store';
import { COLLECTIONS, upgradeCopy } from 'src/models/backup';

const BATCH_LIMIT = 500; // Firestore's maximum writes per batch

function onlineDb() {
  if (!navigator.onLine) throw new Error('You are offline.');
  return getDb();
}

// All documents of all backed-up collections: { 'collection/id': data }.
// Top-level collections only: a subcollection (#38's sheets/pages) needs
// collectionGroup() here.
export async function fetchAll() {
  const db = onlineDb();
  const snapshots = await Promise.all(
    COLLECTIONS.map((name) => getDocsFromServer(collection(db, name))),
  );
  const docs = {};
  snapshots.forEach((snapshot, i) =>
    snapshot.forEach((d) => {
      docs[`${COLLECTIONS[i]}/${d.id}`] = d.data();
    }),
  );
  return docs;
}

// The live version of the given documents; missing ones are left out.
export async function fetchDocs(paths) {
  const db = onlineDb();
  const snapshots = await Promise.all(
    paths.map((path) => getDocFromServer(doc(db, path))),
  );
  const docs = {};
  snapshots.forEach((snapshot, i) => {
    if (snapshot.exists()) docs[paths[i]] = snapshot.data();
  });
  return docs;
}

// Overwrites each document with the given data (full replace, no merge).
export async function writeDocs(docs) {
  const db = onlineDb();
  for (const chunk of _.chunk(Object.entries(docs), BATCH_LIMIT)) {
    const batch = writeBatch(db);
    chunk.forEach(([path, data]) => batch.set(doc(db, path), data));
    await batch.commit();
  }
}

// Upgrades each document to the current schema. One transaction per
// document: it re-reads the live version, so concurrent edits by users
// are upgraded too, never overwritten. A document that fails is skipped;
// returns { rewritten, failed: [{ path, error }] }.
// Single-document steps only: a step that writes several documents (#38)
// needs this to execute a write plan instead of one set().
export async function migrateDocs(paths) {
  const db = onlineDb();
  let rewritten = 0;
  const failed = [];
  for (const path of paths) {
    const ref = doc(db, path);
    try {
      // The callback may run several times (retries): count via its result.
      const wrote = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists()) return false;
        const { after, changed } = upgradeCopy(path, snapshot.data());
        if (changed) transaction.set(ref, after);
        return changed;
      });
      if (wrote) rewritten++;
    } catch (e) {
      failed.push({ path, error: e.message });
    }
  }
  return { rewritten, failed };
}
