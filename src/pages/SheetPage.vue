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
        icon="search"
        label="Search"
        @click="toggleSearch"
        class="bg-white text-primary q-mr-sm"
      />

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

          <q-item
            clickable
            v-close-popup
            @click="goToSettle"
            v-if="summaries.ans.length"
          >
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section>Settle</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="downloadSheet">
            <q-item-section avatar>
              <q-icon name="download" />
            </q-item-section>
            <q-item-section>Download (csv)</q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="
              store.simplifiedTransactions = !store.simplifiedTransactions
            "
          >
            <q-item-section avatar>
              <q-icon
                :name="
                  store.simplifiedTransactions ? 'toggle_on' : 'toggle_off'
                "
              />
            </q-item-section>
            <q-item-section>
              {{
                store.simplifiedTransactions ? 'Simplify: ON' : 'Simplify: OFF'
              }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
    <q-toolbar v-show="searchActive" class="bg-primary q-pa-sm">
      <q-input
        ref="searchInput"
        dense
        outlined
        debounce="300"
        v-model="searchString"
        placeholder="Type to search..."
        clearable
        class="col bg-white"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="row no-wrap items-center">
        <!-- dropdown 50% -->
        <div class="col-6" style="text-overflow: ellipsis; white-space: nowrap">
          <people-dropdown
            v-if="store.currentSheet"
            v-model="selectedPerson"
            :people="store.currentSheet.people"
            :sorted-people="store.currentSheetPeople"
            style="width: 100%"
          />
        </div>

        <!-- input 50% with small margin -->
        <div
          class="col-6"
          style="
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 8px;
          "
        >
          <q-input
            v-model="name"
            @blur="setSheetName"
            outlined
            label="Sheet Name"
            dense
            style="width: 100%"
          />
        </div>
      </q-card-section>
    </q-card>

    <summary-card :summaries="displaySummaries" :selectedPerson="selectedPerson" />

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
      :search-string="searchString"
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
import { ref, watch, computed, nextTick } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const name = ref(store.userLedger?.sheets[store.currentSheet?.id]?.name);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);
const searchString = ref(null);
const searchActive = ref(false);
const searchInput = ref(null);

const summaries = computed(() => {
  return Results.getSummary(
    store.currentSheetResults,
    selectedPersonIdx.value,
  );
});

const displaySummaries = computed(() => {
  return Results.getSummary(
    store.currentSheetResults,
    selectedPersonIdx.value,
    store.simplifiedTransactions,
  );
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

const goToSettle = () => {
  router.push({ name: 'SettlePage' });
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

const toggleSearch = () => {
  searchActive.value = !searchActive.value;
  if (!searchActive.value) {
    searchString.value = '';
  } else {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const downloadSheet = () => {
  const csvContent = store.currentSheetToCsv();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sheet.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
</script>
