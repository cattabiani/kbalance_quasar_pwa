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
    <q-card class="q-my-md q-mx-md row items-stretch q-gutter-x-md">
      <!-- Left: flexible -->
      <q-card-section class="col">
        <people-dropdown
          class="full-width"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
        />
      </q-card-section>

      <!-- Right: auto width, stretches to same height -->
      <q-card-section class="row items-stretch">
        <CurrencyDropdown
          v-model="currency"
          :usedCurrencies="usedCurrencies"
          :expandable="false"
          class="text-subtitle1 full-height"
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
  name: 'SettlePage',
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

const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const baseSummaries = computed(() => {
  return Results.getSummary(store.currentSheetResults, selectedPersonIdx.value);
});
const usedCurrencies = computed(() => {
  return new Set(Object.keys(baseSummaries.value.totals));
});
const keys = Object.keys(baseSummaries.value.totals);
const currency = ref(keys.length > 0 ? keys[0] : 'USD');

const goBack = () => {
  router.go(-1);
};

const transactions = computed(() => {
  let msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
  const settleTransactions = store.makeEquivalentTransactionBatch(
    currency.value,
    selectedPersonIdx.value,
    msg,
  );

  return { ...settleTransactions };
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
