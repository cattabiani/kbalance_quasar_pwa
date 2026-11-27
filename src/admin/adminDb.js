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

function requireOnline() {
  if (!navigator.onLine) throw new Error('You are offline.');
}

// All documents of all backed-up collections: { 'collection/id': data }.
export async function fetchAll() {
  requireOnline();
  const db = getDb();
  const docs = {};
  for (const name of COLLECTIONS) {
    const snapshot = await getDocsFromServer(collection(db, name));
    snapshot.forEach((d) => {
      docs[`${name}/${d.id}`] = d.data();
    });
  }
  return docs;
}

// The live version of the given documents; missing ones are left out.
export async function fetchDocs(paths) {
  requireOnline();
  const db = getDb();
  const docs = {};
  for (const path of paths) {
    const snapshot = await getDocFromServer(doc(db, path));
    if (snapshot.exists()) docs[path] = snapshot.data();
  }
  return docs;
}

// Overwrites each document with the given data (full replace, no merge).
export async function writeDocs(docs) {
  requireOnline();
  const db = getDb();
  for (const chunk of _.chunk(Object.entries(docs), BATCH_LIMIT)) {
    const batch = writeBatch(db);
    chunk.forEach(([path, data]) => batch.set(doc(db, path), data));
    await batch.commit();
  }
}

// Upgrades each document to the current schema. One transaction per
// document: it re-reads the live version, so concurrent edits by users
// are upgraded too, never overwritten. Returns the number rewritten.
export async function migrateDocs(paths) {
  requireOnline();
  const db = getDb();
  let rewritten = 0;
  for (const path of paths) {
    const ref = doc(db, path);
    // The callback may run several times (retries): count via its result.
    const wrote = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) return false;
      const { after, changed } = upgradeCopy(path, snapshot.data());
      if (changed) transaction.set(ref, after);
      return changed;
    });
    if (wrote) rewritten++;
  }
  return rewritten;
}
