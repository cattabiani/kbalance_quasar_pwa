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
      <q-space/>
      <q-btn
        flat
        icon="people"
        @click="goToPeople"
        label="People"
        class="q-ml-md bg-white text-primary"
        aria-label="Edit people"
      />
      <q-btn
        class="q-ml-md bg-white text-primary"
        icon="note_add"
        label="Add Entry"
        @click="addTransaction"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-card>
      <q-card-section class="row q-gutter-sm">
        <people-dropdown
          class="col-auto"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :is-fixed-label="false"
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
    <q-card
      v-if="negativeSummaryDisplay || positiveSummaryDisplay"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-if="negativeSummaryDisplay" :style="{ color: 'green' }">
          {{ store.getName(selectedPerson) }} is owed
          {{ negativeSummaryDisplay }}
        </div>

        <div v-if="positiveSummaryDisplay" :style="{ color: 'red' }">
          {{ store.getName(selectedPerson) }} owes
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
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
              }}
            </span>
            <span> owes </span>
            <span>
              {{
                item.amount < 0
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
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
      <q-item
        v-for="(id, index) in store.currentSheetTransactions"
        :key="id"
        clickable
        :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
        @click="editTransaction(id)"
      >
        <q-card flat bordered class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm">
          <q-card-section
            class="column q-pa-none"
            style="display: flex; justify-content: center; align-items: center"
          >
            <div>
              {{
                Utils.getMonth(store.currentSheet.transactions[id].timestamp)
              }}
            </div>
            <div>
              {{ Utils.getDay(store.currentSheet.transactions[id].timestamp) }}
            </div>
          </q-card-section>
        </q-card>

        <q-item-section>
          <q-item-label>
            {{ store.currentSheet.transactions[id].name || "New Transaction" }}
          </q-item-label>
          <q-item-label caption>
            {{ store.getName(store.payerId(id)) }} payed
            {{
              Utils.displayCurrency(
                store.currentSheet.transactions[id].currency,
                store.currentSheet.transactions[id].amount
              )
            }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label
            caption
            v-if="
              Transaction.position(
                store.currentSheet.transactions[id],
                selectedPersonIdx
              ) > 0
            "
            :style="{ color: 'green' }"
          >
            {{ store.getName(selectedPerson) }} lent
          </q-item-label>
          <q-item-label
            caption
            v-if="
              Transaction.position(
                store.currentSheet.transactions[id],
                selectedPersonIdx
              ) < 0
            "
            :style="{ color: 'red' }"
          >
            {{ store.getName(selectedPerson) }} borrowed
          </q-item-label>
          <q-item-label
            v-if="
              Transaction.position(
                store.currentSheet.transactions[id],
                selectedPersonIdx
              ) === 0
            "
          >
            Not Involved
          </q-item-label>
          <q-item-label
            v-else
            :style="{
              color:
                Transaction.position(
                  store.currentSheet.transactions[id],
                  selectedPersonIdx
                ) >= 0
                  ? 'green'
                  : 'red',
            }"
          >
            {{
              Utils.displayCurrency(
                store.currentSheet.transactions[id].currency,
                Math.abs(
                  Transaction.position(
                    store.currentSheet.transactions[id],
                    selectedPersonIdx
                  )
                )
              )
            }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "SheetPage",
});

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store";
import PeopleDropdown from "src/components/PeopleDropdown.vue";
import Utils from "src/utils/utils";
import Transaction from "src/models/transaction";
import Results from "src/models/results";
import { ref, watch, computed } from "vue";

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const name = ref(store.userLedger?.sheets[store.currentSheet?.id]?.name);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.currentSheetPeople.indexOf(selectedPerson.value)
);

const summaries = computed(() => {
  const { ans, totals } = Results.getSummary(
    store.currentSheetResults,
    selectedPersonIdx.value
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

const editTransaction = (id) => {
  store.transactionId = id;
  router.push({ name: "TransactionPage" });
};

const addTransaction = () => {
  store.transactionId = null;
  router.push({ name: "TransactionPage" });
};

const setSheetName = async () => {
  try {
    await store.setSheetName(name.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
  }
};

const goToPeople = () => {
  router.push({ name: "PeoplePage" });
};

const goBack = () => {
  try {
    store.clearCurrentSheet();
    router.go(-1);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
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
  { immediate: true }
);

const logout = async () => {
  try {
    await store.logout();
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
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
  { immediate: true }
);
</script>
