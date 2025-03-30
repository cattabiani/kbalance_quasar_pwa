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
      <q-card-section class="full-width">
        <people-dropdown
          class="full-width"
          v-if="store.currentSheet"
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
        />
      </q-card-section>

      <q-card-section class="full-width row justify-center">
        <q-select
          class="q-mr-md"
          ref="fromCurrencySelect"
          label="From"
          filled
          v-model="fromCurrency"
          :options="fromCurrencyOptions"
          option-label="label"
          option-value="value"
          option-slot
          emit-value
          use-input
          input-debounce="0"
          @filter="fromFilterFn"
          :style="{ maxWidth: '130px' }"
        />

        <q-btn class="q-mr-md" icon="swap_horiz" @click="swapCurrencies" />

        <q-select
          ref="currencySelect"
          label="To"
          filled
          v-model="toCurrency"
          :options="currencyOptions"
          option-label="label"
          option-value="value"
          option-slot
          emit-value
          use-input
          input-debounce="0"
          @filter="filterFn"
          :style="{ maxWidth: '130px' }"
        />
      </q-card-section>
    </q-card>
    <q-card>
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

    <summary-card :summaries="summaries" :selectedPerson="selectedPerson" />

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
import currencyCodes from 'currency-codes';
import Results from 'src/models/results';
import SummaryCard from 'src/components/SummaryCard.vue';
import TransactionList from 'src/components/TransactionList.vue';
import { ref, watch, computed, onMounted } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const rates = ref(null);
const conversionInputRef = ref(null);
const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  store.personId2Idx(selectedPerson.value),
);

const currencies = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

const currencyOptions = ref(currencies);
const currencySelect = ref(null);

const baseSummaries = computed(() => {
  return Results.getSummary(store.currentSheetResults, selectedPersonIdx.value);
});

const fromCurrencies = currencies.filter((currency) =>
  Object.keys(baseSummaries.value.totals).includes(currency.value),
);
const fromCurrencyOptions = ref(fromCurrencies);
const fromCurrencySelect = ref(null);

const keys = Object.keys(baseSummaries.value.totals);
const fromCurrency = ref(keys.length > 0 ? keys[0] : 'USD');
const toCurrency = ref(
  keys.length > 1 ? keys[1] : keys.length > 0 ? keys[0] : 'USD',
);

const goBack = () => {
  router.go(-1);
};

const swapCurrencies = () => {
  if (Object.keys(baseSummaries.value.totals).includes(toCurrency.value)) {
    [fromCurrency.value, toCurrency.value] = [
      toCurrency.value,
      fromCurrency.value,
    ];
  } else {
    $q.notify({
      message: `Cannot swap: You don't have a balance in ${toCurrency.value}`,
      color: 'negative',
    });
  }
};

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      currencyOptions.value = currencies;
    });
    return;
  }

  toCurrency.value = '';
  const needle = val.toLowerCase();
  update(() => {
    const filtered = currencies.filter((v) =>
      v.value.toLowerCase().includes(needle),
    );
    currencyOptions.value = filtered;

    if (currencyOptions.value.length === 1) {
      toCurrency.value = currencyOptions.value[0].value;
      if (currencySelect.value) {
        currencySelect.value.updateInputValue(''); // Clear input
        setTimeout(() => {
          currencySelect.value.hidePopup(); // Close the dropdown
        }, 0);
      }
    }
  });
};

const fromFilterFn = (val, update) => {
  if (val === '') {
    update(() => {
      fromCurrencyOptions.value = fromCurrencies;
    });
    return;
  }

  fromCurrency.value = '';
  const needle = val.toLowerCase();
  update(() => {
    const filtered = fromCurrencies.filter((v) =>
      v.value.toLowerCase().includes(needle),
    );
    fromCurrencyOptions.value = filtered;

    if (fromCurrencyOptions.value.length === 1) {
      fromCurrency.value = fromCurrencyOptions.value[0].value;
      if (fromCurrencySelect.value) {
        fromCurrencySelect.value.updateInputValue(''); // Clear input
        setTimeout(() => {
          fromCurrencySelect.value.hidePopup(); // Close the dropdown
        }, 0);
      }
    }
  });
};

onMounted(async () => {
  const apiUrl = `https://cdn.jsdelivr.net/gh/ismartcoding/currency-api/latest/data.json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Set the fetched exchange rates in the ref
    rates.value = await response.json();
  } catch (error) {
    $q.notify({ message: error.message || error, color: 'negative' });
  }
});

const conversionMulti = computed(() => {
  if (!rates.value) {
    return 1.0; // If rates is null, return 1.0
  }
  if (!rates.value.quotes[fromCurrency.value]) {
    $q.notify(`Unknown currency ${fromCurrency.value}!`);
    return 1.0;
  }
  if (!rates.value.quotes[toCurrency.value]) {
    $q.notify(`Unknown currency ${toCurrency.value}!`);
    return 1.0;
  }

  return (
    rates.value.quotes[toCurrency.value] /
    rates.value.quotes[fromCurrency.value]
  );
});

const transactions = computed(() => {
  let msg = `🤖 settle ${store.getName(selectedPerson.value)}`;
  const settleTransactions = store.makeEquivalentTransactionBatch(
    fromCurrency.value,
    selectedPersonIdx.value,
    msg,
  );
  msg = `🤖 convert ${store.getName(selectedPerson.value)}`;
  const conversionTransactions = store.makeEquivalentTransactionBatch(
    fromCurrency.value,
    selectedPersonIdx.value,
    msg,
    -conversionMulti.value,
    toCurrency.value,
  );

  return { ...settleTransactions, ...conversionTransactions };
});
const results = computed(() => {
  const res = store.getEditableCurrentSheetResults();
  Results.applyTransactions(
    res,
    transactions.value,
    store.currentSheetPeople.length || 0,
  );
  return res;
});
const summaries = computed(() => {
  return Results.getSummary(results.value, selectedPersonIdx.value);
});

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
