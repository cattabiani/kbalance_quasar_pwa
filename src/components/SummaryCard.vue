<template>
  <div>
    <q-card
      v-if="
        props.showTotals &&
        (positiveTotals.length || negativeTotals.length) &&
        store.currentSheetPeople.length > 2
      "
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="row no-wrap items-stretch">
        <div v-if="props.cutoffTimestamp" class="cutoff-badge bg-secondary text-white">
          <div class="text-caption">
            {{ Utils.getMonth(props.cutoffTimestamp) }}
          </div>
          <div class="text-caption">
            {{ Utils.getDay(props.cutoffTimestamp) }}
          </div>
        </div>
        <div class="q-pa-md col" style="min-width: 0">
          <div v-if="negativeTotals.length" class="row no-wrap items-center">
            <span
              class="ellipsis q-mr-xs"
              style="min-width: 0; flex-shrink: 1"
            >
              {{ store.getName(props.selectedPerson) }} owes
            </span>
            <span class="row no-wrap items-center" style="flex-shrink: 0">
              <template
                v-for="([currency, amount], index) in negativeTotals"
                :key="currency"
              >
                <CurrencyDisplay
                  :currency="currency"
                  :amount="-amount"
                  color="red"
                  :converted-amount="
                    store.convertCurrency(
                      -amount,
                      currency,
                      store.referenceCurrency,
                    )
                  "
                  :reference-currency="store.referenceCurrency"
                />
                <span v-if="index < negativeTotals.length - 1"
                  >&nbsp;+&nbsp;</span
                >
              </template>
            </span>
          </div>

          <div v-if="positiveTotals.length" class="row no-wrap items-center">
            <span
              class="ellipsis q-mr-xs"
              style="min-width: 0; flex-shrink: 1"
            >
              {{ store.getName(props.selectedPerson) }} is owed
            </span>
            <span class="row no-wrap items-center" style="flex-shrink: 0">
              <template
                v-for="([currency, amount], index) in positiveTotals"
                :key="currency"
              >
                <CurrencyDisplay
                  :currency="currency"
                  :amount="amount"
                  color="green"
                  :converted-amount="
                    store.convertCurrency(
                      amount,
                      currency,
                      store.referenceCurrency,
                    )
                  "
                  :reference-currency="store.referenceCurrency"
                />
                <span v-if="index < positiveTotals.length - 1"
                  >&nbsp;+&nbsp;</span
                >
              </template>
            </span>
          </div>
        </div>
      </div>
    </q-card>

    <q-card
      v-if="
        props.showDetail &&
        (!props.summary || Object.keys(props.summary).length === 0)
      "
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="row no-wrap items-stretch">
        <div v-if="props.cutoffTimestamp" class="cutoff-badge bg-secondary text-white">
          <div class="text-caption">
            {{ Utils.getMonth(props.cutoffTimestamp) }}
          </div>
          <div class="text-caption">
            {{ Utils.getDay(props.cutoffTimestamp) }}
          </div>
        </div>
        <div class="q-pa-md col">
          <div>All Settled!</div>
        </div>
      </div>
    </q-card>

    <q-card
      v-if="props.showDetail && summaryItems.length"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="row no-wrap items-stretch">
        <div v-if="props.cutoffTimestamp" class="cutoff-badge bg-secondary text-white">
          <div class="text-caption">
            {{ Utils.getMonth(props.cutoffTimestamp) }}
          </div>
          <div class="text-caption">
            {{ Utils.getDay(props.cutoffTimestamp) }}
          </div>
        </div>
        <div class="q-pa-md col" style="min-width: 0">
          <div
            v-for="item in summaryItems"
            :key="item.id"
            class="row no-wrap items-center"
          >
            <span class="ellipsis q-mr-xs" style="min-width: 0; flex-shrink: 1">
              {{ store.getName(store.personIdx2Id(item.debtorIdx)) }} owes
              {{ store.getName(store.personIdx2Id(item.creditorIdx)) }}
            </span>
            <CurrencyDisplay
              style="flex-shrink: 0"
              :currency="item.currency"
              :amount="item.amount"
              :color="item.creditorIdx === selectedPersonIdx ? 'green' : 'red'"
              :converted-amount="
                store.convertCurrency(
                  Math.abs(item.amount),
                  item.currency,
                  store.referenceCurrency,
                )
              "
              :reference-currency="store.referenceCurrency"
            />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import CurrencyDisplay from 'src/components/CurrencyDisplay.vue';
import Utils from 'src/utils/utils';

import { computed } from 'vue';

const store = useStore();

const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
  selectedPerson: {
    type: [String],
    required: true,
  },
  showTotals: {
    type: Boolean,
    default: true,
  },
  showDetail: {
    type: Boolean,
    default: true,
  },
  // When set, shows a small month/day badge spanning the full card height
  // on the left, indicating the historical cutoff this summary reflects.
  cutoffTimestamp: {
    type: Number,
    default: null,
  },
});

const selectedPersonIdx = computed(() =>
  store.personId2Idx(props.selectedPerson),
);

const summaryItems = computed(() => {
  if (!props.summary) return [];

  const ans = Object.entries(props.summary).flatMap(([currency, data]) => {
    const list = data.transactions;

    if (!Array.isArray(list)) return [];

    return list.map((tx, idx) => ({
      id: `${currency}-${idx}`,
      currency,
      amount: tx.amount,
      creditorIdx: tx.creditorIdx,
      debtorIdx: tx.debtorIdx,
    }));
  });

  return ans;
});

const positiveTotals = computed(() => {
  return Object.entries(props.summary)
    .filter(([_, data]) => data.total > 0)
    .map(([currency, data]) => [currency, data.total]); // [[currency, amount], ...]
});

const negativeTotals = computed(() => {
  return Object.entries(props.summary)
    .filter(([_, data]) => data.total < 0)
    .map(([currency, data]) => [currency, data.total]); // [[currency, amount], ...]
});
</script>

<style scoped>
.cutoff-badge {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 44px;
}
</style>
