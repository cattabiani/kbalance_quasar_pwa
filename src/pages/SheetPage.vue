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

      <q-btn-dropdown
        flat
        class="q-ma-none bg-white text-primary"
        label="More"
        icon="more_vert"
        menu-anchor="bottom right"
        menu-self="top right"
      >
        <q-list>
          <q-item clickable v-close-popup @click="goToPeople" class="bg-grey-3">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>People</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="goToConvert"
            v-if="summaries.ans.length"
          >
            <q-item-section avatar>
              <q-icon name="currency_exchange" />
            </q-item-section>
            <q-item-section>Convert</q-item-section>
          </q-item>

          <q-item :class="summaries.ans.length ? 'bg-grey-3' : ''">
            <q-item-section>
              <CurrencyDropdown
                v-model="setCurrency"
                :usedCurrencies="usedCurrencies"
                label="Settle"
                icon="payments"
                clear
                flat
                :expandable="false"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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

    <div class="row justify-center items-center q-pb-md">
      <q-btn
        class="bg-primary text-white"
        icon="note_add"
        label="Add Entry"
        @click="addTransaction"
      />
    </div>

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
import TransactionList from 'src/components/TransactionList.vue';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
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
const setCurrency = ref(null);

const summaries = computed(() => {
  return Results.getSummary(store.currentSheetResults, selectedPersonIdx.value);
});

const usedCurrencies = computed(() => {
  return new Set(Object.keys(summaries.value.totals));
});

watch(setCurrency, async (currency) => {
  if (currency == null) return;

  const msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
  store.settleCurrencyPerson(currency, selectedPersonIdx.value, msg);
});

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
