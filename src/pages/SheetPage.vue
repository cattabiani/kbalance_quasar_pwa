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
      <q-toolbar-title style="font-size: 28px"> Sheet </q-toolbar-title>
      <q-btn
        flat
        icon="people"
        @click="goToPeople"
        class="q-ml-md bg-white text-primary"
        aria-label="Edit people"
      />
      <q-btn
        flat
        icon="add"
        @click="goToTransaction()"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new transaction"
      />
    </q-toolbar>
  </q-header>
  <q-page>
    <q-input
      class="q-my-md q-mr-md q-ml-md"
      ref="nameInput"
      v-model="name"
      label="Sheet Name"
      autogrow
      outlined
      @focus="nameInput.select()"
      @blur="setCurrentSheetName"
    />
    <SelectPerson v-model="selectedPerson" :peopleOptions="peopleOptions" />

    <q-card
      v-if="negativeSummaryDisplay || positiveSummaryDisplay"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-if="negativeSummaryDisplay" :style="{ color: 'green' }">
          {{ store.username(store.currentSheetPeople[selectedPerson]) }} is owed
          {{ negativeSummaryDisplay }}
        </div>

        <div v-if="positiveSummaryDisplay" :style="{ color: 'red' }">
          {{ store.username(store.currentSheetPeople[selectedPerson]) }} owes
          {{ positiveSummaryDisplay }}
        </div>
      </div>
    </q-card>
    <q-card v-if="summaries.detail.length > 0" class="q-my-md q-mr-md q-ml-md">
      <div class="q-pa-md">
        <div v-for="item in summaries.detail" :key="item.id">
          <div>
            <span>
              {{
                item.amount > 0
                  ? store.username(store.currentSheetPeople[selectedPerson])
                  : store.username(store.currentSheetPeople[item.person])
              }}
            </span>
            <span> owes </span>
            <span>
              {{
                item.amount < 0
                  ? store.username(store.currentSheetPeople[selectedPerson])
                  : store.username(store.currentSheetPeople[item.person])
              }}
              &nbsp;
            </span>
            <span :style="{ color: item.amount > 0 ? 'red' : 'green' }">
              {{ Utils.displayCurrency(item.currency, Math.abs(item.amount)) }}
            </span>
          </div>
        </div>
      </div>
    </q-card>

    <q-list>
      <q-slide-item
        v-for="(id, index) in store.currentSheetTransactions"
        :key="index"
        @left="(event) => onLeft(event, id)"
        @click="goToTransaction(id)"
        left-color="red"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>

        <q-item clickable :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'">
          <q-card flat bordered class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm">
            <q-card-section
              class="column q-pa-none"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div>
                {{
                  Utils.getMonth(store.currentSheet.transactions[id].timestamp)
                }}
              </div>
              <div>
                {{
                  Utils.getDay(store.currentSheet.transactions[id].timestamp)
                }}
              </div>
            </q-card-section>
          </q-card>
          <q-item-section>
            <q-item-label>
              {{
                store.currentSheet.transactions[id].name || "New Transaction"
              }}
            </q-item-label>
            <q-item-label caption>
              {{
                store.username(
                  store.currentSheetPeople[
                    store.currentSheet.transactions[id].payer
                  ]
                ) || "Nobody"
              }}
              paid
              {{
                Utils.displayCurrency(
                  store.currentSheet.transactions[id].currency,
                  store.currentSheet.transactions[id].amount
                )
              }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            v-if="store.currentSheet.transactions[id].payer === selectedPerson"
            :style="{ color: 'green' }"
          >
            <q-item-label caption :style="{ color: 'green' }">
              {{
                store.username(store.currentSheetPeople[selectedPerson]) ||
                "Nobody"
              }}
              lent
            </q-item-label>
            <q-item-label>
              {{
                Utils.displayCurrency(
                  store.currentSheet.transactions[id].currency,
                  store.currentSheet.transactions[id].amount -
                    store.currentSheet.transactions[id].debts[
                      store.currentSheet.transactions[id].payer
                    ].owedAmount
                )
              }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            v-else-if="
              (store.currentSheet.transactions[id].debts[selectedPerson]
                ?.owedAmount ?? 0) > 0
            "
            :style="{ color: 'red' }"
          >
            <q-item-label caption :style="{ color: 'red' }">
              {{
                store.username(store.currentSheetPeople[selectedPerson]) ||
                "Nobody"
              }}
              borrowed
            </q-item-label>
            <q-item-label>
              {{
                Utils.displayCurrency(
                  store.currentSheet.transactions[id].currency,
                  store.currentSheet.transactions[id].debts[selectedPerson]
                    ?.owedAmount
                )
              }}
            </q-item-label>
          </q-item-section>
          <q-item-section side v-else>
            <q-item-label> not involved </q-item-label>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "SheetPage",
});

import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store";
import { useQuasar } from "quasar";
import Utils from "src/utils/utils";
import Results from "src/models/results";
import SelectPerson from "src/components/SelectPerson.vue";
const $q = useQuasar();
const store = useStore();
const router = useRouter();
const nameInput = ref(null);

const timer = ref(null);
const name = ref(null);

const selectedPerson = ref(
  store.currentSheetPeople.indexOf(store.getCurrentUserId())
);

// Compute the options based on the store
const peopleOptions = computed(() => {
  const currentPeople = store.currentSheetPeople || [];
  return currentPeople.map((id, index) => ({
    label: store.username(id) || "New Person",
    isUser: store.isUser(id),
    value: index,
  }));
});

watch(
  () => store.currentSheetLedger, // Watch the `isReady` flag in the store
  (newValue) => {
    name.value = newValue?.name;
  },
  { immediate: true } // Run immediately to set the username if already ready
);

const setCurrentSheetName = async () => {
  try {
    await store.setCurrentSheetName(name.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }
};

const summaries = computed(() => {
  const { ans, totals } = Results.getSummary(
    store.currentSheetResults,
    selectedPerson.value
  );

  const detail = ans.map((item, index) => ({
    ...item,
    id: index, // Adding a unique id based on the index
  }));

  return { detail, totals }; // Return both formattedAns and totals
});

const positiveSummaryDisplay = computed(() => {
  return Object.entries(summaries.value.totals)
    .filter(([_, amount]) => amount > 0) // Filter for positive values
    .map(([currency, amount]) => Utils.displayCurrency(currency, amount)) // Format the string
    .join(" + ");
});

const negativeSummaryDisplay = computed(() => {
  return Object.entries(summaries.value.totals)
    .filter(([_, amount]) => amount < 0) // Filter for positive values
    .map(([currency, amount]) => Utils.displayCurrency(currency, -amount)) // Format the string
    .join(" + ");
});

const goToTransaction = (id = null) => {
  store.transactionId = id;
  router.push({ name: "TransactionPage" });
};

const goBack = async () => {
  await store.clearCurrentSheet();
  router.go(-1); // Go back to the previous page
};

const goToPeople = () => {
  router.push({ name: "PeoplePage" });
};

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const onLeft = async ({ reset }, id) => {
  finalize(reset);

  // Wrap setTimeout in a Promise to use async/await correctly
  await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await store.removeTransaction(id);
        // If needed, resolve after the async operation completes
        resolve();
      } catch (error) {
        $q.notify({
          message: error.message || error,
        });
        resolve(); // resolve the promise even if there's an error
      }
    }, 0); // You can adjust the timeout duration here
  });
};
</script>
