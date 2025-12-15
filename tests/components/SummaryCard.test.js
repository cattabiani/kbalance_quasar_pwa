import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { computed } from 'vue';
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
      convertCurrency: vi.fn((amount) => amount),
    }),
  };
});

// stub CurrencyDisplay (we test logic, not rendering here)
const CurrencyDisplayStub = {
  template: '<div class="currency-display" />',
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

});