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
        icon="people"
        @click="goToPeople"
        label="People"
        class="q-ml-md bg-white text-primary"
        aria-label="Edit people"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="row q-gutter-sm">
        <people-dropdown
          class="col-auto"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
        />
        <q-input
          class="col"
          v-model="name"
          @blur="setSheetName"
          outlined
          label="Sheet Name"
        />
      </q-card-section>
    </q-card>

    <summary-card :summaries="summaries" :selectedPerson="selectedPerson" />

    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="row justify-center items-center q-pb-none">
        <q-btn
          flat
          dense
          class="bg-primary text-white"
          icon="note_add"
          label="Add Entry"
          @click="addTransaction"
        />
        <q-btn
          flat
          dense
          class="q-ml-md bg-purple text-white"
          icon="currency_exchange"
          label="Convert"
          @click="goToConvert"
          v-if="summaries.ans.length"
        />
      </q-card-section>
      <q-card-section class="row justify-center items-center q-bt-sm">
        <q-btn-dropdown
          label="Settle"
          icon="payments"
          flat
          dense
          class="bg-green text-white"
          v-if="summaries.ans.length"
        >
          <q-list>
            <q-item
              v-for="currency in usedCurrencies"
              :key="currency.value"
              clickable
              v-close-popup
              @click="settleCurrency(currency.value)"
            >
              <q-item-section>{{ currency.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>
    </q-card>

    <transaction-list
      :transactions="store.currentSheet?.transactions || {}"
      :selectedPerson="selectedPerson"
      @remove="removeTransaction"
      @edit="editTransaction"
    />
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'SheetPage',
});

import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import PeopleDropdown from 'src/components/PeopleDropdown.vue';
import SummaryCard from 'src/components/SummaryCard.vue';
import currencyCodes from 'currency-codes';
import TransactionList from 'src/components/TransactionList.vue';
import Utils from 'src/utils/utils';
import Transaction from 'src/models/transaction';
import Results from 'src/models/results';
import { ref, watch, computed } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const name = ref(store.userLedger?.sheets[store.currentSheet?.id]?.name);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const summaries = computed(() => {
  return Results.getSummary(store.currentSheetResults, selectedPersonIdx.value);
});

const currencies = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

const usedCurrencies = computed(() => {
  return currencies.filter((currency) =>
    Object.keys(summaries.value.totals).includes(currency.value),
  );
});

const settleCurrency = async (currency) => {
  let msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
  const transactions = store.makeEquivalentTransactionBatch(
    currency,
    selectedPersonIdx.value,
    msg,
  );

  try {
    await store.addTransactions(transactions);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};

const removeTransaction = async (reset, id) => {
  try {
    const message = `Are you sure you want to remove ${Transaction.name(
      store.currentSheet.transactions[id],
    )}?`;

    $q.notify({
      message,
      timeout: 0,
      actions: [
        { label: 'Cancel', color: 'white', handler: () => reset() },
        {
          label: 'Confirm',
          color: 'red',
          handler: async () => {
            store.removeTransaction(id);
            $q.notify({ message: 'Transaction removed successfully!' });
          },
        },
      ],
    });
  } catch (error) {
    reset();
    $q.notify({ message: error.message || error, color: 'negative' });
  }
};

const editTransaction = (id) => {
  store.transactionId = id;
  router.push({ name: 'TransactionPage' });
};

const addTransaction = () => {
  store.transactionId = null;
  router.push({ name: 'TransactionPage' });
};

const setSheetName = async () => {
  try {
    await store.setSheetName(name.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
  }
};

const goToPeople = () => {
  router.push({ name: 'PeoplePage' });
};

const goToConvert = () => {
  router.push({ name: 'ConvertPage' });
};

const goBack = () => {
  try {
    store.clearCurrentSheet();
    router.go(-1);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};

watch(
  store.currentSheet,
  async (newValue) => {
    if (newValue === null) {
      goBack();
    }
  },
  { immediate: true },
);

const logout = async () => {
  try {
    await store.logout();
    router.push({ name: 'LoginPage' });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};

watch(
  store.userLedger,
  async (newValue) => {
    if (newValue === null) {
      await logout();
    }
  },
  { immediate: true },
);
</script>
