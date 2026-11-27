// Versioned document formats (#39).
//
// Every Firestore document carries an integer `schemaVersion`; a document
// without one is v0. Each collection has its own list of upgrade steps:
// STEPS[collection][n] upgrades a document from version n to n + 1, in place.
// The current version of a collection is the number of its steps.
//
// upgrade() runs on every read (the store's snapshot handlers), so the rest of
// the app only ever sees current documents. The planned admin page (#41) runs
// the same function to migrate stored documents eagerly.
//
// Steps are pure (no Firebase) and tested with fixtures in
// tests/models/schema.test.js. Add a step and a fixture together.

const STEPS = {
  sheets: [
    // v0 → v1: transactions used to have a single payer and amount
    // ({ amount, payer, debts: [{ owedAmount }] }); now they have per-person
    // credits and debts as plain number arrays.
    (sheet) => {
      for (const tr of Object.values(sheet.transactions ?? {})) {
        if (!('amount' in tr)) continue;
        const credits = tr.debts.map(() => 0);
        credits[tr.payer] = tr.amount ?? 0;
        tr.credits = credits;
        tr.debts = tr.debts.map((d) =>
          d && typeof d === 'object' ? d.owedAmount ?? 0 : d,
        );
        delete tr.amount;
        delete tr.payer;
      }
    },
  ],
  users: [
    // v0 → v1: no format change, only introduces `schemaVersion`.
    () => {},
  ],
};

export function currentVersion(collection) {
  const steps = STEPS[collection];
  if (!steps) throw new Error(`Unknown collection: ${collection}`);
  return steps.length;
}

// Returns `doc` itself when it is already current (or newer than this build:
// the version gate, #42, deals with that), otherwise an upgraded copy. Never
// mutates `doc`.
export function upgrade(collection, doc) {
  const current = currentVersion(collection);
  const from = doc.schemaVersion ?? 0;
  if (from >= current) return doc;

  const ans = structuredClone(doc);
  for (let v = from; v < current; v++) {
    STEPS[collection][v](ans);
    ans.schemaVersion = v + 1;
  }
  return ans;
}
