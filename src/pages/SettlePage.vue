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
      <q-card-section class="col">
        <people-dropdown
          class="full-width"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
        />
      </q-card-section>

      <q-card-section class="row items-stretch">
        <CurrencyDropdown
          v-model="currency"
          :usedCurrencies="currencies"
          :expandable="false"
          class="text-subtitle1 full-height"
        />
      </q-card-section>
    </q-card>

    <summary-card :summary="summary" :selectedPerson="selectedPerson" />

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
import Transaction from 'src/models/transaction';
import { ref, computed, onMounted } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const baseSummary = computed(() => {
  return Results.summary(store.currentSheetResults, selectedPersonIdx.value);
});

const currencies = computed(() => {
  return new Set(Object.keys(baseSummary.value));
});

const currency = ref(
  currencies.value.size > 0 ? Array.from(currencies.value)[0] : 'USD',
);

const settleTr = computed(() => {
  const tr = Transaction.settle(
    store.currentSheetResults.perCurrencyBalance[currency.value],
    selectedPersonIdx.value,
    store.currentSheetPeople,
  );

  tr.name = `🤖 settle ${store.getName(selectedPerson.value)} (${
    currency.value
  })`;

  return tr;
});

const transactions = computed(() => {
  if (!store.currentSheet) return {};

  const ans = {
    ...store.currentSheet.transactions,
    [settleTr.value.id]: settleTr.value,
  };

  return ans;
});

const results = computed(() => {
  return Results.make(transactions.value, store.currentSheetPeople.length);
});

const summary = computed(() => {
  return Results.summary(results.value, selectedPersonIdx.value);
});

const goBack = () => {
  router.go(-1);
};

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
