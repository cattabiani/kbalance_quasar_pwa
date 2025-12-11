import { describe, it, expect } from 'vitest'
import Transaction from '../src/models/transaction.js'
import Utils from '../src/utils/utils.js'

describe('Transaction.make', () => {
  it('make a transaction', () => {
    const tr = Transaction.make(3, "USD");
  })
});
describe('Transaction.update', () => {
  it('create old version and convert', () => {
    const old = {
      amount: 50,
      payer: 1,
      debts: [
        { isDebtor: true,  owedAmount: 20 },
        { isDebtor: true,  owedAmount: 30 },
        { isDebtor: false, owedAmount: 0 },
      ]
    };

    Transaction.update(old);

    // NEW fields
    expect(old.credits).toEqual([0, 50, 0]);

    // debts → ints
    expect(old.debts).toEqual([20, 30, 0]);

    // old fields removed
    expect(old.credit).toBeUndefined();
    expect(old.payer).toBeUndefined();
  });
});

describe('Transaction.credit', () => {
  it('The total credit is the sum', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [10, 20, 0];
    expect(Transaction.credit(tr)).toBe(30);
  })
});

describe('Transaction.updatePeople', () => {

  it('When more peple join, the transaction adapts', () => {
    const tr = Transaction.make(2, "USD");
    tr.credits = [10, 20];
    tr.debts = [5, 0]; // old format already collapsed to numbers

    // Increase number of people to 4
    Transaction.updatePeople(tr, 4);

    expect(tr.credits).toEqual([10, 20, 0, 0]);
    expect(tr.debts).toEqual([5, 0, 0, 0]);
    expect(tr.credits.length).toBe(4);
    expect(tr.debts.length).toBe(4);

    // If nPeople <= old length, nothing changes
    const tr2 = Transaction.make(3, "USD");
    const originalDebts = [...tr2.debts];
    const originalAmounts = [...tr2.credits];

    Transaction.updatePeople(tr2, 2);

    expect(tr2.credits).toEqual(originalAmounts);
    expect(tr2.debts).toEqual(originalDebts);
  });
});


describe('Transaction.debtors', () => {
  it('If the credit is 0, everybody is a debtor', () => {
    const tr = Transaction.make(3, "USD");

    const res = Transaction.debtors(tr);
    expect(res).toEqual([true, true, true]);
  });

  it('If the credit is not 0, only actual debtors are debtors', () => {
    const tr = Transaction.make(3, "USD");
    tr.debts = [0, 15, 0];
    tr.credits = [10, 0, 5]; // just to make credit(tr) non-zero

    const res = Transaction.debtors(tr);
    expect(res).toEqual([false, true, false]);
  });
});

describe('Transaction.payerIdx', () => {
  it('Nobody payed when the credit is 0', () => {
    const tr = Transaction.make(3, "USD");
    expect(Transaction.payerIdx(tr)).toBe(-1);
  });

  it('Normal result', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 10, 0];  // total = 10
    expect(Transaction.payerIdx(tr)).toBe(1);
  });


  it('Nobody payed if more than person payed', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [5, 5, 0];   // total = 10, no entry is 10
    expect(Transaction.payerIdx(tr)).toBe(-1);
  });
});

describe('Transaction.split', () => {
  it('splits evenly among debtors', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [30, 0, 0];

    const debtors = [true, true, true];

    Transaction.split(tr, debtors);

    // 30 split over 3 → 10 each
    expect(tr.debts).toEqual([10, 10, 10]);
  });

  it('splits one debtor', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [30, 0, 0];

    const debtors = [false, true, false];

    Transaction.split(tr, debtors);

    // 30 split over 3 → 10 each
    expect(tr.debts).toEqual([0, 30, 0]);
  });


  it('assigns remainder starting from highest credit', () => {
    const tr = Transaction.make(3, "USD");
    const debtors = [true, true, true];
    tr.credits = [10, 5, 2];
    Transaction.split(tr, debtors);
    expect(tr.debts).toEqual([5, 6, 6]);
  });

  it('excludes fixed indexes and splits remaining', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [29, 1, 0];
    tr.debts = [5, 0, 0];
    const debtors = [true, true, true];
    const exclude = new Set([0]);

    Transaction.split(tr, debtors, exclude);
    expect(tr.debts).toEqual([5, 12, 13]);
  });

  it('sets all debts to zero if distributable credit <= 0', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [10, 0, 0];
    tr.debts = [15, 0, 0];

    const debtors = [true, true, true];
    const exclude = new Set([0]); // fixedDebt = 15

    Transaction.split(tr, debtors, exclude);

    expect(tr.debts).toEqual([15, 0, 0]);
  });


  it('returns early if list of valid debtors is empty', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [30, 0, 0];
    tr.debts = [1, 2, 3];

    const debtors = [false, false, false];

    Transaction.split(tr, debtors);

    expect(tr.debts).toEqual([0, 0, 0]); // zeroed out, no splitting
  });
});

describe('Transaction.setAmount', () => {
  it('sets the payer credit and zeros all others', () => {
    const tr = Transaction.make(3, "USD");

    const debtors = [true, true, true];
    Transaction.setAmount(tr, 62, 1, debtors);

    expect(tr.credits).toEqual([0, 62, 0]);
  });

  it('splits debt after setting payer', () => {
    const tr = Transaction.make(3, "USD");
    const debtors = [true, true, true];

    // set payer index 0 → credit = 60
    Transaction.setAmount(tr, 62, 0, debtors);

    // split() should divide 60 equally
    expect(tr.debts).toEqual([20, 21, 21]);
  });

  it('produces zero split when payer credit is 0', () => {
    const tr = Transaction.make(3, "USD");
    const debtors = [true, true, true];

    Transaction.setAmount(tr, 0, 2, debtors);

    expect(tr.credits).toEqual([0, 0, 0]);
    expect(tr.debts).toEqual([0, 0, 0]);
  });
});

describe('Transaction.setCustomDebt', () => {

  it('applies a custom debt and excludes index during split', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [31, 0, 0];
    tr.debts   = [0, 0, 0];

    const debtors = [true, true, true];
    const exclude = new Set();

    Transaction.setCustomDebt(tr, 11, 1, debtors, exclude, 0);

    // fixed: index1 = 10 → remainder = 20
    expect(tr.debts).toEqual([10, 11, 10]); // redistributed 20 equally: 10,10
  });


  it('forces a new credit when fixed debts exceed original total', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [20, 0, 0];  // total = 20
    tr.debts   = [0, 0, 0];

    const debtors = [true, true, true];
    const exclude = new Set();

    // This creates fixedDebt = 25, greater than 20
    Transaction.setCustomDebt(tr, 25, 1, debtors, exclude, 0);

    // setAmount gets called with value 25.
    // Then split redistributes remaining 0 (because only index 1 is excluded)
    expect(tr.credits).toEqual([25, 0, 0]);
    expect(tr.debts).toEqual([0, 25, 0]);
  });


  it('preserves other previously excluded fixed debts when total grows', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [30, 0, 0];  // total = 30
    tr.debts   = [5, 10, 0];

    const debtors = [true, true, true];
    const exclude = new Set([0]);   // index 0 already fixed

    // Add new custom debt: idx2 = 20
    // fixedDebt = 5 + 20 = 25 (<=30) → no credit change
    Transaction.setCustomDebt(tr, 20, 2, debtors, exclude, 0);

    // remaining = 30 - 25 = 5 → only index1 gets the remainder
    expect(tr.debts).toEqual([5, 5, 20]);
  });


  it('triggers credit increase when multiple excluded debts exceed credit', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [10, 0, 0];
    tr.debts   = [6, 3, 0];

    const debtors = [true, true, true];
    const exclude = new Set([0]); // first excluded

    // Adding index1 → new fixedDebt = 6 + 15 = 21
    Transaction.setCustomDebt(tr, 15, 1, debtors, exclude, 2);

    // total increased to 21
    expect(tr.credits).toEqual([0, 0, 21]); // payer index=2
    expect(tr.debts).toEqual([6, 15, 0]);   // no remainder to distribute
  });

});


describe('Transaction.searchString', () => {
  it('returns lowercase name|debts|credits', () => {
    const tr = {
      name: 'Dinner',
      credits: [10, 0, 5],
      debts: [0, 3, 0]
    };

    const res = Transaction.searchString(tr);
    expect(res).toBe('dinner|10 5|3');
  });

  it('handles empty or missing fields', () => {
    const tr = {};
    const res = Transaction.searchString(tr);
    expect(res).toBe('||');
  });

  it('filters out zero fields', () => {
    const tr = {
      name: 'A',
      credits: [0, 0],
      debts: [0, 10]
    };

    expect(Transaction.searchString(tr)).toBe('a||10');
  });
});

describe('Transaction.getTransactionList', () => {
  it('returns empty list for falsy input', () => {
    expect(Transaction.getTransactionList(null)).toEqual([]);
    expect(Transaction.getTransactionList(undefined)).toEqual([]);
  });

  it('returns ids sorted by timestamp (desc)', () => {
    const tr = {
      a: { timestamp: 100 },
      b: { timestamp: 300 },
      c: { timestamp: 200 },
    };

    const list = Transaction.getTransactionList(tr);
    expect(list).toEqual(['b', 'c', 'a']);
  });
});

describe('Transaction.check', () => {
  it('throws if debts do not match total credit', () => {
    const tr = Transaction.make(2, "USD");
    tr.credits = [50, 0];
    tr.debts = [30, 10]; // total debt = 40

    expect(() => Transaction.check(tr)).toThrow();
  });

  it('does not throw if debts match credit', () => {
    const tr = Transaction.make(2, "USD");
    tr.credits = [40, 0];
    tr.debts = [10, 30];

    expect(() => Transaction.check(tr)).not.toThrow();
  });
});

describe('Transaction.csvHeader', () => {
  it('returns correct header with names', () => {
    const names = ['Alice', 'Bob'];
    const header = Transaction.csvHeader(names);
    expect(header).toEqual([
      'id', 'name', 'currency', 'timestamp', 'date',
      'Alice', 'Bob',
      'Alice', 'Bob'
    ]);
  });

  it('works with empty list', () => {
    const header = Transaction.csvHeader([]);
    expect(header).toEqual([
      'id', 'name', 'currency', 'timestamp', 'date'
    ]);
  });
});

describe('Transaction.toCsvLine', () => {
  it('returns correct CSV line for transaction', () => {
    const tr = Transaction.make(2, "USD");

    tr.id = 'abc';
    tr.name = 'Test';
    tr.currency = 'USD';
    tr.timestamp = 1700000000000;  // stable test
    tr.credits = [10, 20];
    tr.debts = [1, 2];  // already converted form

    const line = Transaction.toCsvLine(tr);

    const formattedDate = new Intl.DateTimeFormat('en-GB')
      .format(new Date(tr.timestamp));

    expect(line).toEqual([
      'abc',
      'Test',
      'USD',
      1700000000000,
      formattedDate,
      10, 20,
      undefined, undefined, // because tr.debts.map(d => d.owedAmount)
    ]);
  });
});

describe('Transaction.state', () => {
  it('returns -1 when debts length != 2', () => {
    const tr = Transaction.make(3, "USD");
    expect(Transaction.state(tr)).toBe(-1);
  });

  it('returns 1 when debts[0] = 0 and credits[1] = 0', () => {
    const tr = Transaction.make(2, "USD");
    tr.debts = [0, 5];
    tr.credits = [5, 0];
    expect(Transaction.state(tr)).toBe(0);
  });

  it('returns 0 when debts[0] = 0', () => {
    const tr = Transaction.make(2, "USD");
    tr.debts = [10, 0];
    tr.credits = [0, 10];
    expect(Transaction.state(tr)).toBe(0);
  });

  it('returns 0 when debts[1] = 0', () => {
    const tr = Transaction.make(2, "USD");
    tr.debts = [10, 0];
    tr.credits = [0, 10];
    expect(Transaction.state(tr)).toBe(0);
  });

  it('returns 1 when both debts >= half credit', () => {
    const tr = Transaction.make(2, "USD");
    Transaction.setAmount(tr, 41, 0, [true, true]);
    expect(Transaction.state(tr)).toBe(1);
    Transaction.setAmount(tr, 40, 1, [true, true]);
    expect(Transaction.state(tr)).toBe(1);
    Transaction.setCustomAmount(tr, 41, 0, [true, true]);
    expect(Transaction.state(tr)).toBe(1);
  });

  it('returns -1 for all other cases', () => {
    const tr = Transaction.make(2, "USD");
    tr.credits = [40, 0];
    tr.debts = [10, 30];
    expect(Transaction.state(tr)).toBe(-1);
  });
});

describe("currency conversion", () => {
  const people = ['A', 'B', 'C'];
  it("converts an array fairly (proportional rounding)", () => {
    const arr = [10, 20, 5];
    const rate = 0.92;

    const res = Utils.convertArray(arr, rate);

    // expected float total
    const floatTotal = arr.reduce((s, x) => s + x * rate, 0);
    const intTotal = res.reduce((a, b) => a + b, 0);

    expect(intTotal).toBe(Math.round(floatTotal));
    // no negative values
    expect(res.every(x => x >= 0)).toBe(true);

    // lengths preserved
    expect(res.length).toBe(arr.length);
  });

  it("converts a full transaction", () => {
    const tr = Transaction.make(people, 'USD');
    tr.credits = [10, 30, 0];
    tr.debts = [0, 0, 40];

    const rate = 1.1;
    const newTr = Transaction.convert(tr, rate, "EUR");

    expect(newTr.currency).toBe("EUR");

    // credits total preserved
    const floatCredits = tr.credits.reduce((s, v) => s + v * rate, 0);
    const newCreditsTotal = newTr.credits.reduce((s, v) => s + v, 0);
    expect(newCreditsTotal).toBe(Math.round(floatCredits));

    // debts total preserved
    const floatDebts = tr.debts.reduce((s, v) => s + v * rate, 0);
    const newDebtsTotal = newTr.debts.reduce((s, v) => s + v, 0);
    expect(newDebtsTotal).toBe(Math.round(floatDebts));

    // original and new arrays must have same length
    expect(newTr.credits.length).toBe(tr.credits.length);
    expect(newTr.debts.length).toBe(tr.debts.length);
  });
});

describe('Transaction.isEmpty', () => {
  it('should return true if nTransactions is 0', () => {
    const tr = Transaction.make(3, 'USD');
    expect(Transaction.isEmpty(tr)).toBe(true);
  });

  it('should return false if any balance is non-zero', () => {
    const tr = Transaction.make(3, 'USD');
    tr.credits[1] = 2
    tr.credits[2] = 2
    expect(Transaction.isEmpty(tr)).toBe(false);
  });
});

describe('Transaction.add', () => {

  it('adds credits and debts with multiplier', () => {
    const tr0 = {
      currency: 'EUR',
      name: 'whatever',
      credits: [10, 20],
      debts:   [1,  2]
    };

    const tr1 = {
      currency: 'EUR',
      credits: [3, 4],
      debts:   [5, 6]
    };

    // act
    Transaction.add(tr0, tr1, 2);

    // name must be reset
    expect(tr0.name).toBe('');

    // credits += 2 * tr1.credits
    expect(tr0.credits).toEqual([10-1+2*3-2*5, 20-2+2*4-2*6]);

  //   // debts += 2 * tr1.debts
    expect(tr0.debts).toEqual([0, 0]);
  });

  it('throws when currencies differ', () => {
    const tr0 = { currency: 'EUR', credits: [], debts: [] };
    const tr1 = { currency: 'USD', credits: [], debts: [] };

    expect(() => Transaction.add(tr0, tr1, 1)).toThrow(
      /different currencies/
    );
  });

  it('supports negative multiplier', () => {
    const tr0 = {
      currency: 'CHF',
      name: 'x',
      credits: [10],
      debts:   [5]
    };

    const tr1 = {
      currency: 'CHF',
      credits: [3],
      debts:   [2]
    };

    // act
    Transaction.add(tr0, tr1, -1);

    expect(tr0.name).toBe('');
    expect(tr0.credits).toEqual([10 -5 -3+2]);
    expect(tr0.debts).toEqual([0]);
  });

});

describe('Transaction.minCashFlow', () => {
  const people = ["A", "B", "C"];
  it('should return empty when all balances are zero', () => {
    const tr = Transaction.make(people, 'USD');
    const trList = Transaction.minCashFlow(tr, people);
    expect(trList.length).toEqual(0);
  });

  it('should settle one debtor → one creditor', () => {
    // Person 0 owes 10; Person 1 must receive 10
    const tr = Transaction.make(3, "USD");
    tr.credits[1] = 10
    tr.debts[0] = 10
    const trList = Transaction.minCashFlow(tr, people);

    expect(trList.length).toEqual(1);
    expect(trList[0].credits).toEqual([10, 0, 0]);
    expect(trList[0].debts).toEqual([0, 10, 0]);
  });

  it('should settle multiple creditors/debtors', () => {
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 16];
    tr.debts = [10, 6, 0];
    const trList = Transaction.minCashFlow(tr, people);

    // Possible valid settlement sequence:
    expect(trList.length).toEqual(2);
    expect(trList[0].credits).toEqual([10, 0, 0]);
    expect(trList[0].debts).toEqual([0, 0, 10]);
    expect(trList[1].credits).toEqual([0 , 6, 0]);
    expect(trList[1].debts).toEqual([0, 0, 6]);
  });

  it('should handle a chain scenario', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 30];
    tr.debts = [10, 20, 0];
    const trList = Transaction.minCashFlow(tr, people);

    expect(trList.length).toEqual(2);
    expect(trList[0].credits).toEqual([0, 20, 0]);
    expect(trList[0].debts).toEqual([0, 0, 20]);
    expect(trList[1].credits).toEqual([10 , 0, 0]);
    expect(trList[1].debts).toEqual([0, 0, 10]);
  });

  it('should handle alternating positives/negatives', () => {
    // 0 +10, 1 -5, 2 +20, 3 -25
    const tr = Transaction.make(4, "USD");
    tr.credits = [10, 0, 20, 0];
    tr.debts = [0, 6, 0, 24];
    
    const trList = Transaction.minCashFlow(tr, ["A", "B", "C", "D"]);

    expect(trList.length).toEqual(3);
    expect(trList[0].credits).toEqual([0, 0, 0, 20]);
    expect(trList[0].debts).toEqual([0, 0, 20, 0]);
    expect(trList[1].credits).toEqual([0, 6, 0, 0]);
    expect(trList[1].debts).toEqual([6, 0, 0, 0]);
    expect(trList[2].credits).toEqual([0, 0, 0, 4]);
    expect(trList[2].debts).toEqual([4, 0, 0, 0]);
  });
});

describe('Result.summary', () => {
  const people = ["A", "B", "C"];
  it('should filter only 0', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 30];
    tr.debts = [10, 20, 0];
    const trList = Transaction.summary(tr, people, 0);
    expect(trList.length).toEqual(1);
    expect(trList[0].credits).toEqual([10, 0, 0]);
    expect(trList[0].debts).toEqual([0, 0, 10]);
  });
});

describe('Result.settle', () => {
  const people = ["A", "B", "C"];
  it('settle is the inverted balances', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 30];
    tr.debts = [10, 20, 0];
    const settleTr = Transaction.settle(tr, people, 2);

    expect(settleTr.credits).toEqual([10, 20, 0]);
    expect(settleTr.debts).toEqual([0, 0, 30]);
  });

  it('settle is a portion of the inverted balances', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(4, "USD");
    tr.credits = [0, 0, 30, 5];
    tr.debts = [10, 25, 0, 0];
    const settleTr = Transaction.settle(tr, ["A", "B", "C", "D"], 2);

    expect(settleTr.credits).toEqual([5, 25, 0, 0]);
    expect(settleTr.debts).toEqual([0, 0, 30, 0]);
  });

  it('settle really cleans results', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 30];
    tr.debts = [10, 20, 0];
    const settleTr = Transaction.settle(tr, people, 2);
    Transaction.add(tr, settleTr, 1);

    expect(tr.credits).toEqual([0, 0, 0]);
    expect(tr.debts).toEqual([0, 0, 0]);
  });
});

describe('Result.convert', () => {
  const people = ["A", "B", "C"];
  it('convert balance', () => {
    // Classic example: 0 owes 10, 1 owes 20, 2 must receive 30
    const tr = Transaction.make(3, "USD");
    tr.credits = [0, 0, 30];
    tr.debts = [10, 20, 0];
    const convertTr = Transaction.convert(tr, 1.0, "EUR");
    expect(tr.credits).toEqual(convertTr.credits);
    expect(tr.debts).toEqual(convertTr.debts);
  });
});