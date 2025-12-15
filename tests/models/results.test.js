import { describe, it, expect } from 'vitest';
import Results from '../../src/models/results.js'
import Transaction from '../../src/models/transaction.js'

// Helper to build a valid transaction quickly.
// Invariants enforced by tests:
//  - sum(credits) == sum(debts)
//  - if credits[i] > 0 -> debts[i] == 0, and if debts[i] > 0 -> credits[i] == 0
//  - credits[i] and debts[i] may both be 0
function validTr(n, currency, credits, debts) {
  const tr = Transaction.make(n, currency);
  tr.credits = credits;
  tr.debts = debts;
  return tr;
}

describe('make()', () => {
  it('returns empty result when nPeople <= 0', () => {
    const res = Results.make({}, 0);
    expect(res.nPeople).toBe(0);
    expect(res.nTransactions).toBe(0);
    expect(res.perCurrencyBalance).toEqual({});
  });

  it('processes a single valid transaction (allows zeros for some people)', () => {
    // sum = 10, person 1 has credit, person 2 and 3 split the debt,
    // person 3 could be all zeros in other cases — here nobody has both >0
    const tr = validTr(
      4,
      'USD',
      [10, 0, 0, 0],
      [0, 5, 5, 0] // person 4 has both zeros allowed
    );

    const res = Results.make({ a: tr }, 4);

    expect(res.nTransactions).toBe(1);
    expect(Object.keys(res.perCurrencyBalance)).toEqual(['USD']);
    expect(res.perCurrencyBalance['USD'].credits).toEqual([10, 0, 0, 0]);
    expect(res.perCurrencyBalance['USD'].debts).toEqual([0, 5, 5, 0]);
  });

  it('accumulates multiple valid transactions (some persons can be zero in both arrays)', () => {
    const tr1 = validTr(
      3,
      'USD',
      [5, 0, 0],
      [0, 3, 2]    // sum = 5; person 3 non-zero debt
    );

    const tr2 = validTr(
      3,
      'USD',
      [0, 7, 0],
      [3, 0, 4]    // sum = 7; person 1 gets debt part
    );

    const res = Results.make({ t1: tr1, t2: tr2 }, 3);

    expect(res.nTransactions).toBe(2);
    expect(res.perCurrencyBalance['USD'].credits).toEqual([2, 4, 0]);
    expect(res.perCurrencyBalance['USD'].debts).toEqual([0, 0, 6]);
  });

  it('handles transactions of different currencies independently', () => {
    const usd = validTr(
      2,
      'USD',
      [10, 0],
      [0, 10]
    );

    const eur = validTr(
      2,
      'EUR',
      [0, 6],
      [6, 0]
    );

    const res = Results.make({ u: usd, e: eur }, 2);

    expect(Object.keys(res.perCurrencyBalance).sort()).toEqual(['EUR', 'USD']);
    expect(res.perCurrencyBalance['USD'].credits).toEqual([10, 0]);
    expect(res.perCurrencyBalance['EUR'].credits).toEqual([0, 6]);
  });
});

describe('applyTransaction()', () => {
  it('initializes new currency bucket with a valid transaction', () => {
    const results = {
      nPeople: 3,
      nTransactions: 0,
      perCurrencyBalance: {}
    };

    const tr = validTr(
      3,
      'CHF',
      [4, 0, 0],
      [0, 4, 0] // person 3 allowed to be zero in both arrays
    );

    Results.applyTransaction(results, tr, 3);

    expect(results.nTransactions).toBe(1);
    expect(results.perCurrencyBalance['CHF'].credits).toEqual([12, 0, 0]);
    expect(results.perCurrencyBalance['CHF'].debts).toEqual([0, 12, 0]);
  });

  it('accumulates valid transactions into an existing currency bucket', () => {
    const results = {
      nPeople: 3,
      nTransactions: 0,
      perCurrencyBalance: {
        USD: validTr(
          3,
          'USD',
          [3, 0, 0],
          [0, 1, 2]
        )
      }
    };

    const incoming = validTr(
      3,
      'USD',
      [0, 5, 0],
      [3, 0, 2]
    );

    Results.applyTransaction(results, incoming, 3);

    expect(results.nTransactions).toBe(1);
    expect(results.perCurrencyBalance['USD'].credits).toEqual([0, 14, 0]);
    expect(results.perCurrencyBalance['USD'].debts).toEqual([6, 0, 8]);
  });
});


describe('currencies()', () => {
  it('returns empty list when everything is empty', () => {
    const results = {
      nPeople: 3,
      nTransactions: 0,
      perCurrencyBalance: {
        USD: Transaction.make(3, 'USD'),
        EUR: Transaction.make(3, 'EUR')
      }
    };

    // Ensure Result.isEmpty returns true for these empty aggregates
    expect(Transaction.isEmpty(results.perCurrencyBalance['USD'])).toBe(true);
    expect(Transaction.isEmpty(results.perCurrencyBalance['EUR'])).toBe(true);

    const cur = Results.currencies(results);
    expect(cur).toEqual([]);
  });

  it('returns only currencies with non-empty aggregates', () => {
    const usd = validTr(
      3, 'USD',
      [10, 0, 0],
      [0, 10, 0]
    );

    const eur = Transaction.make(3, 'EUR'); // empty

    const results = {
      nPeople: 3,
      nTransactions: 1,
      perCurrencyBalance: { USD: usd, EUR: eur }
    };

    // mock: USD is non-empty, EUR is empty
    expect(Transaction.isEmpty(usd)).toBe(false);
    expect(Transaction.isEmpty(eur)).toBe(true);

    const cur = Results.currencies(results);
    expect(cur).toEqual(['USD']);
  });

  it('returns multiple non-empty currencies', () => {
    const usd = validTr(2, 'USD', [5, 0], [0, 5]);
    const eur = validTr(2, 'EUR', [0, 7], [7, 0]);

    const results = {
      nPeople: 2,
      nTransactions: 2,
      perCurrencyBalance: { USD: usd, EUR: eur }
    };

    const cur = Results.currencies(results).sort();
    expect(cur).toEqual(['EUR', 'USD']);
  });
});


describe('summary()', () => {
  it('returns empty object if all totals are zero for person idx', () => {
    // Person 0 has no net effect in both currencies
    const usd = validTr(2, 'USD', [0, 5], [0, 5]); // person 0: 0-0 = 0
    const eur = validTr(2, 'EUR', [0, 7], [0, 7]); // person 0: 0-0 = 0

    const results = {
      perCurrencyBalance: { USD: usd, EUR: eur }
    };

    const ans = Results.summary(results, 0);
    expect(ans).toEqual({});
  });

  it('includes only currencies where person idx has non-zero total', () => {
    const usd = validTr(
      3, 'USD',
      [10, 0, 0],   // person 1 = 0
      [0, 0, 10]
    );
    const eur = validTr(
      3, 'EUR',
      [0, 4, 0],    // person 1 contributes: credits[1]=4, debts[1]=0 -> net +4
      [0, 0, 4]
    );

    const results = {
      perCurrencyBalance: { USD: usd, EUR: eur }
    };

    const ans = Results.summary(results, 1);

    // USD contributes 0, EUR contributes +4
    expect(Object.keys(ans)).toEqual(['EUR']);
    expect(ans['EUR'].total).toBe(4);
    expect(ans['EUR'].transactions.length).toBe(1);
  });

  it('accumulates multiple transactions per currency for the same person', () => {
    const t1 = validTr(
      3, 'USD',
      [0, 5, 0],     // person 1: +5
      [3, 0, 2]
    );

    Transaction.add(t1, validTr(
      3, 'USD',
      [0, 7, 0],     // person 1: +7
      [4, 0, 3]
    ), 1);

    const ttot = validTr(
      3, 'USD',
      [0, 12, 0],    // total credits
      [7, 0, 5]      // total debts
    );

    const results = {
      perCurrencyBalance: { USD: t1 }
    };

    const ans = Results.summary(results, 1);

    // net = (5 - 0) + (7 - 0) = 12
    expect(ans['USD'].total).toBe(12);
  });

  it('ignores currencies where idx has net zero even if transactions exist', () => {
    const usd = validTr(
      2, 'USD',
      [10, 0],
      [10, 0]    // person 1 has 0 - 0 = 0
    );

    const results = {
      perCurrencyBalance: { USD: usd }
    };

    const ans = Results.summary(results, 1);
    expect(ans).toEqual({});
  });
});
