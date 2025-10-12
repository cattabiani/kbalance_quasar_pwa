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
          {{ store.getName(selectedPerson) }} is owed
          <template
            v-for="([currency, amount], index) in negativeTotals"
            :key="currency"
          >
            <CurrencyDisplay
              :currency="currency"
              :amount="-amount"
              color="green"
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
          {{ store.getName(selectedPerson) }} owes
          <template
            v-for="([currency, amount], index) in positiveTotals"
            :key="currency"
          >
            <CurrencyDisplay
              :currency="currency"
              :amount="amount"
              color="red"
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
      v-if="!localSummaries || localSummaries.detail.length === 0"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div>All Settled!</div>
      </div>
    </q-card>

    <q-card
      v-if="localSummaries && localSummaries.detail.length > 0"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-for="item in localSummaries.detail" :key="item.id">
          <div>
            <span>
              {{
                item.amount > 0
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
              }}
            </span>
            <span> owes </span>
            <span>
              {{
                item.amount < 0
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
              }}
              &nbsp;
            </span>
            <CurrencyDisplay
              :currency="item.currency"
              :amount="Math.abs(item.amount)"
              :color="item.amount > 0 ? 'red' : 'green'"
              inline-conversion
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

import { computed } from 'vue';

const store = useStore();

const props = defineProps({
  summaries: {
    type: Object,
    required: true,
  },
  selectedPerson: {
    type: [String],
    required: true,
  },
});

const localSummaries = computed(() => {
  const { ans, totals } = props.summaries;

  const detail = ans.map((item, index) => ({
    ...item,
    id: index, // Adding a unique id based on the index
  }));
  return { detail, totals }; // Return both formattedAns and totals
});

const positiveTotals = computed(() => {
  return Object.entries(localSummaries.value.totals).filter(
    ([_, amount]) => amount > 0,
  ); // [[currency, amount], ...]
});

const negativeTotals = computed(() => {
  return Object.entries(localSummaries.value.totals).filter(
    ([_, amount]) => amount < 0,
  ); // [[currency, amount], ...]
});
</script>
