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
    </q-toolbar>
  </q-header>

  <q-page>

        <q-card>
<q-card-section class="full-width row justify-center">

<CurrencyInput
          v-model="amount"
          :currency="'XXX'"
          label="Amount"
          class="q-mr-md"
        />
        <CurrencyDropdown
          v-model="fromCurrency"
          dense
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
          class="q-mr-md"
        />
        <q-btn  icon="swap_vert" @click="swapCurrencies" />
      </q-card-section>

      <q-card-section class="full-width row justify-center">
    <CurrencyInput
          :model-value="convertedAmount"
          :currency="'XXX'"
          label="Amount"
          class="q-mr-md"
          readonly
        />
                <CurrencyDropdown
          v-model="toCurrency"
          dense
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

defineOptions({
  name: 'ConvertTestPage',
});

import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';

import { ref, computed, onMounted } from 'vue';


const router = useRouter();
const $q = useQuasar();

const fromCurrency = ref("USD");
const toCurrency = ref("USD");
const rates = ref(null);
const amount = ref(100);

const goBack = () => {
  router.go(-1);
};

const swapCurrencies = () => {
  if (fromCurrency.value === toCurrency.value) return;
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
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

const convertedAmount = computed(() => {
  return amount.value * conversionMulti.value;
});



</script>
