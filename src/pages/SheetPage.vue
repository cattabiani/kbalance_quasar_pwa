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
      <q-toolbar-title style="font-size: 28px">
        {{ store.currentSheet.name }}
      </q-toolbar-title>
      <!-- <q-btn
        flat
        icon="bug_report"
        @click="debug"
        class="q-ml-md bg-white text-primary"
        aria-label="Debug"
      /> -->
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
        @click="addTransaction"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new transaction"
      />
    </q-toolbar>
  </q-header>
  <q-page>
    <q-input
      class="q-my-md q-mr-md q-ml-md"
      ref="nameInput"
      v-model="store.currentSheet.name"
      label="Description"
      autogrow
      outlined
      @focus="nameInput.select()"
    />
    <q-select
      bordered
      class="q-my-md q-mr-md q-ml-md"
      v-model="selectedPerson"
      :options="peopleOptions"
      label="Selected Person"
      outlined
    />

    <q-card
      v-if="negativeSummaryDisplay || positiveSummaryDisplay"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-if="negativeSummaryDisplay" :style="{ color: 'green' }">
          {{ store.currentSheet.people[selectedPerson.value].name }} is owed
          {{ negativeSummaryDisplay }}
        </div>

        <div v-if="positiveSummaryDisplay" :style="{ color: 'red' }">
          {{ store.currentSheet.people[selectedPerson.value].name }} owes
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
                  ? store.currentSheet.people[selectedPerson.value].name
                  : store.currentSheet.people[item.person].name
              }}
            </span>
            <span> owes </span>
            <span>
              {{
                item.amount < 0
                  ? store.currentSheet.people[selectedPerson.value].name
                  : store.currentSheet.people[item.person].name
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
        v-for="(item, index) in store.currentSheet.transactions
          .slice()
          .reverse()"
        :key="index"
        @left="
          (event) =>
            onLeft(event, store.currentSheet.transactions.length - 1 - index)
        "
        @dblclick="
          editTransaction(store.currentSheet.transactions.length - 1 - index)
        "
        left-color="red"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>

        <q-item clickable :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'">
          <q-card flat bordered class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm">
            <q-card-section class="column q-pa-none" style="display: flex; justify-content: center; align-items: center;">
            <q-card-label>{{ Utils.getMonth(item.date) }}</q-card-label>
            <q-card-label>{{ Utils.getDay(item.date) }}</q-card-label>
          </q-card-section>
          </q-card>
          <q-item-section>
            <q-item-label>
              {{ item.name || "New Transaction" }}
            </q-item-label>
            <q-item-label caption>
              {{ store.currentSheet.people[item.payer]?.name || "Nobody" }} paid
              {{ Utils.displayCurrency(item.currency, item.amount) }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            v-if="item.payer === selectedPerson?.value"
            :style="{ color: 'green' }"
          >
            <q-item-label caption :style="{ color: 'green' }">
              {{
                store.currentSheet.people[selectedPerson?.value]?.name ||
                "Nobody"
              }}
              lent
            </q-item-label>
            <q-item-label>
              {{
                Utils.displayCurrency(
                  item.currency,
                  item.amount - item.owed[item.payer]
                )
              }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            v-else-if="item.owed[selectedPerson?.value] > 0"
            :style="{ color: 'red' }"
          >
            <q-item-label caption :style="{ color: 'red' }">
              {{
                store.currentSheet.people[selectedPerson?.value]?.name ||
                "Nobody"
              }}
              borrowed
            </q-item-label>
            <q-item-label>
              {{
                Utils.displayCurrency(
                  item.currency,
                  item.amount - item.owed[selectedPerson?.value]
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

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import Sheet from "../models/sheet";
import Utils from "../utils/utils";

const timer = ref(null);
const nameInput = ref(null);

const store = useStore();
const router = useRouter();

const peopleOptions = computed(() => {
  return store.currentSheet.people.map((person, index) => ({
    label: person.name,
    value: index, // Assuming `id` is a unique field in your `person` object
  }));
});
const selectedPerson = ref(peopleOptions.value[0] || null);
const summaries = computed(() => {
  const { ans, totals } = Sheet.getSummary(
    store.currentSheet,
    selectedPerson.value?.value
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

const debug = () => {
  console.log(summaryByCurrency.value);
};

const goBack = () => {
  router.go(-1); // Go back to the previous page
};

const goToPeople = () => {
  router.push({ name: "PeoplePage" });
};

const addTransaction = () => {
  store.setTransactionID();
  router.push({ name: "TransactionPage" });
};

onMounted(() => {
  if (nameInput.value) {
    nameInput.value.focus();
  }
});

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const onLeft = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.removeTransaction(id);
  }, 1);
};

const editTransaction = (id) => {
  store.setTransactionID(id);
  router.push({ name: "TransactionPage" });
};
</script>
