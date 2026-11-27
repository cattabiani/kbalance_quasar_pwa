// Versioned document formats (#39).
//
// A document without `schemaVersion` is v0. STEPS[collection][n] upgrades a
// document from version n to n + 1, in place; the current version is the
// number of steps. The store runs upgrade() on every read.
//
// Steps must tolerate parts already in the newer shape: the app writes
// current-shape fields (e.g. `transactions.<id>`) without bumping the stored
// `schemaVersion`.
//
// Steps are pure (no Firebase). Add a step and a fixture in
// tests/models/schema.test.js together.

const STEPS = {
  sheets: [
    // v0 → v1: transactions used to have a single payer and amount
    // ({ amount, payer, debts: [{ owedAmount }] }); now they have per-person
    // credits and debts as plain number arrays. A missing or invalid payer
    // gets the amount assigned to person 0 rather than losing it.
    (sheet, warn) => {
      for (const tr of Object.values(sheet.transactions ?? {})) {
        if (!('amount' in tr)) continue;
        const credits = tr.debts.map(() => 0);
        let payer = tr.payer;
        if (!Number.isInteger(payer) || payer < 0 || payer >= credits.length) {
          payer = 0;
          const what = `${tr.amount} ${tr.currency ?? ''}`.trim();
          warn(
            `"${tr.name || tr.id}": payer unknown, ` +
              `${what} assigned to ${firstPerson(sheet)}`,
          );
        }
        credits[payer] = tr.amount ?? 0;
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

// Name of the person at index 0 (people are ordered by when they were added).
function firstPerson(sheet) {
  const [first] = Object.values(sheet.people ?? {}).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
  return first?.name || 'the first person';
}

// True if `doc` was written by a newer build than this one: this build
// can't be trusted to read or write it (#42).
export function isNewerThanBuild(collection, doc) {
  return (doc?.schemaVersion ?? 0) > currentVersion(collection);
}

export const VERSIONED_COLLECTIONS = Object.keys(STEPS);

export function isVersioned(collection) {
  return collection in STEPS;
}

export function currentVersion(collection) {
  const steps = STEPS[collection];
  if (!steps) throw new Error(`Unknown collection: ${collection}`);
  return steps.length;
}

// Upgrades `doc` in place to the current version and returns it. Clone first
// if you need the original. A document newer than this build is left alone
// (the version gate, #42, deals with that). `warn(message)` is called when a
// step has to repair data rather than just convert it.
export function upgrade(collection, doc, warn = () => {}) {
  const current = currentVersion(collection);
  for (let v = doc.schemaVersion ?? 0; v < current; v++) {
    STEPS[collection][v](doc, warn);
    doc.schemaVersion = v + 1;
  }
  return doc;
}
