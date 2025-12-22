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
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="full-width row no-wrap items-center">
        <people-dropdown
          class="q-mr-md"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
          style="flex: 1 1 auto"
        />

        <q-btn
          :icon="convertAll ? 'apps' : 'person'"
          :label="convertAll ? 'All' : store.getName(selectedPerson)"
          color="primary"
          toggle
          dense
          @click="convertAll = !convertAll"
        />
      </q-card-section>
      <q-card-section class="full-width row items-center justify-center">
        <CurrencyDropdown
          v-model="fromCurrency"
          :usedCurrencies="fromCurrencies"
          dense
          :expandable="false"
          class="q-mr-sm"
        />

        <div class="column items-center q-mx-sm">
          <q-icon name="arrow_forward" size="md" class="q-mb-xs" />
          <q-btn dense round icon="swap_horiz" @click="swapCurrencies" />
        </div>

        <CurrencyDropdown
          v-model="toCurrency"
          :usedCurrencies="fromCurrencies"
          dense
          class="q-ml-sm"
        />
      </q-card-section>

      <q-card-section class="full-width row justify-center">
        <q-input
          ref="conversionInputRef"
          outlined
          v-model.number="conversionMulti"
          type="number"
          min="0"
          label="Conversion Rate"
          input-class="text-center"
          @focus="conversionInputRef.select()"
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
  name: 'ConvertPage',
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
import { ref, computed, onMounted, watch } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const convertAll = ref(false);
const conversionInputRef = ref(null);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const baseSummary = computed(() => {
  return Results.summary(store.currentSheetResults, selectedPersonIdx.value);
});

const fromCurrencies = computed(() => {
  return new Set(Object.keys(baseSummary.value));
});

watch(convertAll, (newVal) => {
  const msg = newVal
    ? `Convert all the balance sheet`
    : `Convert only ${store.getName(selectedPerson.value)}'s part`;
  $q.notify({
    message: msg,
  });
});

const initCurrencies = (currencies, referenceCurrency) => {
  const arr = [...currencies];
  let to = null;
  let from = null;

  if (arr.length === 0) {
    return { from, to };
  }

  if (arr.length === 1) {
    to =
      referenceCurrency && referenceCurrency !== arr[0]
        ? referenceCurrency
        : arr[0];
    from = arr[0];
  } else {
    to = arr.includes(referenceCurrency) ? referenceCurrency : arr[0];
    from =
      arr.find((c) => c !== to && c !== referenceCurrency) ||
      arr.find((c) => c !== to) ||
      arr[0];
  }

  return { from, to };
};

const { from: initialFrom, to: initialTo } = initCurrencies(
  new Set(Object.keys(baseSummary.value)),
  store.referenceCurrency,
);

const fromCurrency = ref(initialFrom);
const toCurrency = ref(initialTo);

const swapCurrencies = () => {
  if (fromCurrency === toCurrency) return;

  if (!fromCurrencies.value.has(toCurrency.value)) {
    $q.notify({
      message: `Cannot swap currencies: no balance in ${fromCurrency.value}.`,
    });
    return;
  }

  [fromCurrency.value, toCurrency.value] = [
    toCurrency.value,
    fromCurrency.value,
  ];
};

const conversionMulti = computed(() => {
  return store.convertCurrency(1, fromCurrency.value, toCurrency.value);
}); // 1.00

const goBack = () => {
  router.go(-1);
};

const convertionTransactions = computed(() => {
  let ans = [];

  if (convertAll.value) {
    ans = Transaction.convertAll(
      store.currentSheetResults.perCurrencyBalance[fromCurrency.value],
      conversionMulti.value,
      toCurrency.value,
    );
  } else {
    ans = Transaction.convertPerson(
      store.currentSheetResults.perCurrencyBalance[fromCurrency.value],
      selectedPersonIdx.value,
      store.currentSheetPeople,
      conversionMulti.value,
      toCurrency.value,
    );
  }

  if (ans.length >= 2) {
    ans[0].name = `🤖 settle ${store.getName(selectedPerson.value)} (${
      fromCurrency.value
    })`;
    ans[1].name = `🤖 convert ${store.getName(selectedPerson.value)} (${
      fromCurrency.value
    } → ${toCurrency.value})`;
    return { [ans[0].id]: ans[0], [ans[1].id]: ans[1] };
  }
  return {};
});

const transactions = computed(() => {
  if (!store.currentSheet) return {};

  const ans = {
    ...store.currentSheet.transactions,
    ...convertionTransactions.value,
  };

  return ans;
});

const results = computed(() => {
  return Results.make(transactions.value, store.currentSheetPeople.length);
});

const summary = computed(() => {
  return Results.summary(results.value, selectedPersonIdx.value);
});

// const transactions = computed(() => {
//   let curr1 = currency1.value;
//   let curr2 = currency2.value;

//   if (!direction.value) {
//     [curr1, curr2] = [curr2, curr1];
//   }

//   let msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
//   const settleTransactions = store.makeEquivalentTransactionBatch(
//     curr1,
//     selectedPersonIdx.value,
//     msg,
//   );
//   msg = `🤖 convert ${store.getName(selectedPerson.value)}`;
//   const conversionTransactions = store.makeEquivalentTransactionBatch(
//     curr1,
//     selectedPersonIdx.value,
//     msg,
//     -conversionMulti.value,
//     curr2,
//   );

//   return { ...settleTransactions, ...conversionTransactions };
// });
// const results = computed(() => {
//   const res = store.getEditableCurrentSheetResults();
//   Results.applyTransactions(
//     res,
//     transactions.value,
//     store.currentSheetPeople.length || 0,
//   );
//   return res;
// });
// const summaries = computed(() => {
//   return Results.getSummary(results.value, selectedPersonIdx.value);
// });

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
