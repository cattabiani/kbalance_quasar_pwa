<template>
  <div>
    <q-card
      v-if="
        (positiveTotals.length || negativeTotals.length) &&
        store.currentSheetPeople.length > 2
      "
      class="q-my-md q-mr-md q-ml-md"
    > 
      <div class="q-pa-md">
        <div v-if="negativeTotals.length">
          {{ store.getName(props.selectedPerson) }} owes
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
            <span v-if="index < negativeTotals.length - 1"> + </span>
          </template>
        </div>

        <div v-if="positiveTotals.length">
          {{ store.getName(props.selectedPerson) }} is owed
          <template
            v-for="([currency, amount], index) in positiveTotals"
            :key="currency"
          >
            <CurrencyDisplay
              :currency="currency"
              :amount="amount"
              color="green"
              :converted-amount="
                store.convertCurrency(amount, currency, store.referenceCurrency)
              "
              :reference-currency="store.referenceCurrency"
            />
            <span v-if="index < positiveTotals.length - 1"> + </span>
          </template>
        </div>
      </div>
    </q-card>

<q-card
  v-if="!props.summary || Object.keys(props.summary).length === 0"
  class="q-my-md q-mr-md q-ml-md"
>
  <div class="q-pa-md">
    <div>All Settled!</div>
  </div>
</q-card>

  <q-card v-if="summaryItems.length" class="q-my-md q-mr-md q-ml-md">
  <div class="q-pa-md">
    <div v-for="item in summaryItems" :key="item.id">
      <span>
        {{ store.getName(store.personIdx2Id(item.debtorIdx)) }}
      </span>
      <span> owes </span>
      <span>
        {{ store.getName(store.personIdx2Id(item.creditorIdx)) }}
        &nbsp;
      </span>
      <CurrencyDisplay
        :currency="item.currency"
        :amount="item.amount"
        :color="item.creditorIdx === selectedPersonIdx ? 'green' : 'red'"
        :converted-amount="store.convertCurrency(Math.abs(item.amount), item.currency, store.referenceCurrency)"
        :reference-currency="store.referenceCurrency"
      />
    </div>
  </div>
</q-card>
  </div>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import CurrencyDisplay from 'src/components/CurrencyDisplay.vue';

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
});

const selectedPersonIdx = computed(() =>
  store.personId2Idx(props.selectedPerson),
);

const summaryItems = computed(() => {
  if (!props.summary) return [];

  
  const ans = Object.entries(props.summary).flatMap(
    ([currency, data]) => {
      const list = data.transactions;

      if (!Array.isArray(list)) return [];

      return list.map((tx, idx) => ({
        id: `${currency}-${idx}`,
        currency,
        amount: tx.amount,
        creditorIdx: tx.creditorIdx,
        debtorIdx: tx.debtorIdx,
      }));
    }
  );

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
