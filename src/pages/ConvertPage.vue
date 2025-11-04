<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        icon="arrow_back"
        @click="goBack"
        aria-label="Go Back"
        class="bg-white text-primary"
      />
      <q-space />
      <q-btn
        v-if="store.currentSheetPeople.length > 2"
        flat
        :icon="store.simplifiedTransactions ? 'toggle_on' : 'toggle_off'"
        :label="store.simplifiedTransactions ? 'Simplify: ON' : 'Simplify: OFF'"
        @click="store.simplifiedTransactions = !store.simplifiedTransactions"
        class="q-ml-md bg-white text-primary"
        aria-label="Simplify"
      />
      <q-btn
        flat
        icon="done"
        label="Confirm"
        @click="saveAndGoBack"
        class="q-ml-md bg-secondary text-white"
        aria-label="Save"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="full-width">
        <people-dropdown
          class="full-width"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
        />
      </q-card-section>

      <q-card-section class="full-width row justify-center">
        <CurrencyDropdown
          v-model="currency1"
          :usedCurrencies="fromCurrencies"
          dense
          :expandable="false"
          class="q-mr-md"
        />
        <q-btn
          class="q-mr-md"
          :icon="direction ? 'arrow_forward' : 'arrow_back'"
          @click="direction = !direction"
        />
        <CurrencyDropdown
          v-model="currency2"
          :usedCurrencies="fromCurrencies"
          dense
        />
      </q-card-section>
      <q-card-section class="full-width row justify-center">
        <q-input
          ref="conversionInputRef"
          outlined
          v-model.number="conversionMulti"
          type="number"
          min="0"
          label="Conversion Rate"
          input-class="text-center"
          @focus="conversionInputRef.select()"
        />
      </q-card-section>
    </q-card>

    <summary-card :summaries="summaries" :selectedPerson="selectedPerson" />

    <transaction-list
      :transactions="transactions"
      :selectedPerson="selectedPerson"
      :disableEdit="true"
      :disableRemove="true"
    />
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'ConvertPage',
});

import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import PeopleDropdown from 'src/components/PeopleDropdown.vue';
import Utils from 'src/utils/utils';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
import Results from 'src/models/results';
import SummaryCard from 'src/components/SummaryCard.vue';
import TransactionList from 'src/components/TransactionList.vue';
import { ref, computed, onMounted } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const conversionInputRef = ref(null);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const baseSummaries = computed(() => {
  return Results.getSummary(store.currentSheetResults, selectedPersonIdx.value);
});

const fromCurrencies = computed(() => {
  return new Set(Object.keys(baseSummaries.value.totals));
});

const keys = Object.keys(baseSummaries.value.totals);
const currency1 = ref(keys.length > 0 ? keys[0] : 'USD');
const currency2 = ref(
  keys.length > 1 ? keys[1] : keys.length > 0 ? keys[0] : 'USD',
);
const direction = ref(true);

const conversionMulti = computed(() => {
  if (direction.value) {
    return store.convertCurrency(1, currency1.value, currency2.value);
  } else {
    return store.convertCurrency(1, currency2.value, currency1.value);
  }
}); // 1.00

const goBack = () => {
  router.go(-1);
};

const transactions = computed(() => {
  let curr1 = currency1.value;
  let curr2 = currency2.value;

  if (!direction.value) {
    [curr1, curr2] = [curr2, curr1];
  }

  let msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
  const settleTransactions = store.makeEquivalentTransactionBatch(
    curr1,
    selectedPersonIdx.value,
    msg,
  );
  msg = `🤖 convert ${store.getName(selectedPerson.value)}`;
  const conversionTransactions = store.makeEquivalentTransactionBatch(
    curr1,
    selectedPersonIdx.value,
    msg,
    -conversionMulti.value,
    curr2,
  );

  return { ...settleTransactions, ...conversionTransactions };
});
const results = computed(() => {
  const res = store.getEditableCurrentSheetResults();
  Results.applyTransactions(
    res,
    transactions.value,
    store.currentSheetPeople.length || 0,
  );
  return res;
});
const summaries = computed(() => {
  return Results.getSummary(results.value, selectedPersonIdx.value);
});

const saveAndGoBack = async () => {
  try {
    await store.addTransactions(transactions.value);
    goBack();
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};
</script>
