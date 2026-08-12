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

          <q-item clickable v-close-popup @click="goToConvert">
            <q-item-section avatar>
              <q-icon name="currency_exchange" />
            </q-item-section>
            <q-item-section>Convert</q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="goToSettle"
            v-if="Object.keys(summary).length > 0"
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

          <q-item clickable v-close-popup @click="goToStatistics">
            <q-item-section avatar>
              <q-icon name="insights" />
            </q-item-section>
            <q-item-section>Statistics</q-item-section>
          </q-item>

          <!-- <q-item clickable v-close-popup @click="repairSheet">
          <q-item-section avatar>
            <q-icon name="build" />
          </q-item-section>
          <q-item-section>Repair</q-item-section>
        </q-item> -->
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
    <div
      ref="stickyHeaderRef"
      class="sticky-history-header bg-white"
      style="position: sticky; top: 0; z-index: 10"
    >
      <q-card class="q-my-md q-mr-md q-ml-md">
        <q-card-section class="row no-wrap items-center">
          <div
            class="col-6"
            style="text-overflow: ellipsis; white-space: nowrap"
          >
            <people-dropdown
              v-if="store.currentSheet"
              v-model="selectedPerson"
              :people="store.currentSheet.people"
              :sorted-people="store.currentSheetPeople"
              style="width: 100%"
            />
          </div>

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

      <summary-card
        :summary="summary"
        :selectedPerson="selectedPerson"
        :show-detail="isSmallSheet"
        :cutoff-timestamp="isViewingHistory ? historyCutoff : null"
      />

      <div class="row justify-center items-center q-pb-md">
        <q-btn
          class="bg-primary text-white"
          icon="note_add"
          label="Add Entry"
          @click="addTransaction"
        />
      </div>
    </div>

    <summary-card
      v-if="!isSmallSheet"
      :summary="liveSummary"
      :selectedPerson="selectedPerson"
      :show-totals="false"
    />

    <transaction-list
      :transactions="store.currentSheet?.transactions || {}"
      :selectedPerson="selectedPerson"
      :search-string="searchString"
      :top-offset="stickyHeaderHeight"
      @remove="removeTransaction"
      @edit="editTransaction"
      @cutoff="handleCutoff"
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
import Results from 'src/models/results';
import Transaction from 'src/models/transaction';
import {
  ref,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue';

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

// The totals card only ever shows for >2 people, so for 2-person sheets the
// detail card is the only summary content and stays small -- safe to keep
// it sticky too. For larger sheets the detail card can grow a lot as more
// currencies/counterparties appear, so it scrolls with the list instead.
const isSmallSheet = computed(() => store.currentSheetPeople.length <= 2);

// Tracks the sticky header's rendered height so TransactionList knows how
// far down the "topmost visible transaction" threshold sits -- it changes
// as the "Viewing as of" caption appears/disappears.
const stickyHeaderRef = ref(null);
const stickyHeaderHeight = ref(0);
let stickyHeaderObserver = null;

onMounted(() => {
  if (stickyHeaderRef.value) {
    stickyHeaderObserver = new ResizeObserver(([entry]) => {
      stickyHeaderHeight.value = entry.contentRect.height;
    });
    stickyHeaderObserver.observe(stickyHeaderRef.value);
  }
});

onBeforeUnmount(() => {
  stickyHeaderObserver?.disconnect();
});

// The timestamp of the topmost transaction currently visible in
// TransactionList -- i.e. "as of" this point. Reported by TransactionList's
// scroll tracking. null until it reports at least once.
const historyCutoff = ref(null);

const handleCutoff = ({ timestamp }) => {
  historyCutoff.value = timestamp;
};

const sortedTransactionIds = computed(() =>
  Transaction.getTransactionList(store.currentSheet?.transactions || {}),
);

// The cutoff is only worth surfacing to the user once it excludes at least
// the newest transaction -- otherwise we're still looking at "live".
const isViewingHistory = computed(() => {
  if (historyCutoff.value === null || !store.currentSheet?.transactions)
    return false;
  const newestId = sortedTransactionIds.value[0];
  if (!newestId) return false;
  return historyCutoff.value < store.currentSheet.transactions[newestId].timestamp;
});

// Historical results always fold over the *full* transaction set up to
// the cutoff, regardless of any active search filter -- "as of" a date
// must reflect everything that actually happened by then, not just what
// currently matches the search.
const historicalResults = computed(() => {
  if (historyCutoff.value === null || !store.currentSheet?.transactions) {
    return store.currentSheetResults;
  }

  const filtered = Object.fromEntries(
    Object.entries(store.currentSheet.transactions).filter(
      ([, tr]) => tr.timestamp <= historyCutoff.value,
    ),
  );
  return Results.make(filtered, store.currentSheetPeople.length || 0);
});

const summary = computed(() => {
  return Results.summary(historicalResults.value, selectedPersonIdx.value);
});

// Always the current, live balance -- used by the non-sticky detail card so
// its size never changes purely because the user scrolled past it while
// looking at history further down. Only the sticky card above reacts to
// historyCutoff.
const liveSummary = computed(() => {
  return Results.summary(store.currentSheetResults, selectedPersonIdx.value);
});

const removeTransaction = async (reset, id) => {
  try {
    const message = `Are you sure you want to remove ${
      store.currentSheet.transactions[id] || '(New Transaction)'
    }?`;

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

const goToStatistics = () => {
  router.push({ name: 'StatisticsPage' });
};

const repairSheet = async () => {
  try {
    await store.repairSheet();
    $q.notify({
      message: 'Sheet repaired successfully',
    });
  } catch (error) {
    $q.notify({
      message: error?.message || String(error),
      color: 'negative',
    });
  }
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
  () => store.currentSheet,
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
  () => store.userLedger,
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
