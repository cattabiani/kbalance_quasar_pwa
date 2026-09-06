import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SummaryCard from '../../src/components/SummaryCard.vue';

// ---- mocks ----

// mock Pinia store
vi.mock('src/stores/store', () => {
  return {
    useStore: () => ({
      currentSheetPeople: ['a', 'b', 'c'],
      referenceCurrency: 'CHF',
      getName: (id) => `Person-${id}`,
      personIdx2Id: (idx) => `p${idx}`,
      personId2Idx: (id) => Number(String(id).replace('p', '')),
      convertCurrency: vi.fn((amount) => amount),
    }),
  };
});

// stub CurrencyDisplay (we test logic, not rendering here)
// Renders its currency so tests can assert on display *order*.
const CurrencyDisplayStub = {
  props: ['currency'],
  template: '<div class="currency-display">{{ currency }}</div>',
};

// ---- helpers ----

const factory = (overrides = {}) => {
  return mount(SummaryCard, {
    props: {
      summary: {
        // default empty summary
        ...{},
        ...overrides.summary,
      },
      selectedPerson: 'p0',
      ...overrides,
    },
    global: {
      stubs: {
        CurrencyDisplay: CurrencyDisplayStub,
        'q-card': {
          template: '<div class="q-card"><slot /></div>',
        },
      },
    },
  });
};

describe('SummaryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mounts correctly', () => {
    const wrapper = factory();
    expect(wrapper.exists()).toBe(true);
  });

  it('shows "All Settled!" when no details are present', () => {
    const wrapper = factory({
      summaries: {
        ans: [],
        totals: {},
      },
    });

    expect(wrapper.text()).toContain('All Settled!');
  });

  describe('currency ordering', () => {
    const currenciesOf = (wrapper) =>
      wrapper.findAll('.currency-display').map((el) => el.text());

    // The mocked store's referenceCurrency is 'CHF'.
    it('puts the preferred currency first, then the rest alphabetically', () => {
      const wrapper = factory({
        summary: {
          USD: { total: 100, transactions: [] },
          CHF: { total: 300, transactions: [] },
          EUR: { total: 200, transactions: [] },
          AUD: { total: 400, transactions: [] },
        },
      });

      expect(currenciesOf(wrapper)).toEqual(['CHF', 'AUD', 'EUR', 'USD']);
    });

    it('orders owed and owing currencies independently', () => {
      const wrapper = factory({
        summary: {
          USD: { total: -100, transactions: [] },
          CHF: { total: -300, transactions: [] },
          EUR: { total: 200, transactions: [] },
          AUD: { total: 400, transactions: [] },
        },
      });

      // negativeTotals ("owes") renders before positiveTotals ("is owed"),
      // and CHF leads its own group.
      expect(currenciesOf(wrapper)).toEqual(['CHF', 'USD', 'AUD', 'EUR']);
    });

    it('falls back to plain alphabetical when the preferred currency is absent', () => {
      const wrapper = factory({
        summary: {
          USD: { total: 100, transactions: [] },
          EUR: { total: 200, transactions: [] },
          AUD: { total: 400, transactions: [] },
        },
      });

      expect(currenciesOf(wrapper)).toEqual(['AUD', 'EUR', 'USD']);
    });

    it('orders the detail rows by currency too', () => {
      const tx = (amount) => ({ amount, creditorIdx: 0, debtorIdx: 1 });
      const wrapper = factory({
        summary: {
          USD: { total: 100, transactions: [tx(100)] },
          EUR: { total: 200, transactions: [tx(200)] },
          CHF: { total: 300, transactions: [tx(300)] },
        },
        showTotals: false,
      });

      expect(currenciesOf(wrapper)).toEqual(['CHF', 'EUR', 'USD']);
    });
  });
});
