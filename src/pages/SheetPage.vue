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
      <q-toolbar-title style="font-size: 28px"> Transactions </q-toolbar-title>
      <!-- <q-btn
        flat
        icon="bug_report"
        class="q-ml-md bg-white text-primary"
        aria-label="Debug"
        @click="debug"
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
    <q-list bordered class="q-my-md">
      <q-slide-item
        v-for="(transaction, id) in store.currentSheet.transactions"
        :key="id"
        @left="(event) => onLeft(event, id)"
        @dblclick="editTransaction(id)"
        left-color="red"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>

        <q-item clickable :class="id % 2 === 0 ? 'bg-grey-1' : 'bg-white'">
          <q-item-section>
            <div class="q-gutter-sm" style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              {{ transaction.name || "New Transaction" }}
            </div>
            <div>
              <CurrencyInput
                  class="q-mr-md"
                  v-model="transaction.amount"
                  :currency="transaction.currency"
                  :disable="true"
                />
            </div>
          </div>
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

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import CurrencyInput from "../components/CurrencyInput.vue";

const timer = ref(null);

const store = useStore();
const router = useRouter();

// const debug = () => {
//   console.log(store.currentSheet.results);
// }

const goBack = () => {
  store.clearSheet();
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

const onLeft = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.deleteTransaction(id);
  }, 1);
};

const editTransaction = (id) => {
  store.transactionID = id;
  router.push({ name: "TransactionPage" });
};

const addTransaction = () => {
  store.transactionID = -1;
  router.push({ name: "TransactionPage" });
};
</script>
