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
        Conversion Rates Settings
      </q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page class="q-pa-md flex flex-center column">
    <!-- Last updated display -->

    <!-- Update button -->
    <q-btn
      label="Update Conversion Rates"
      color="primary"
      class="q-my-md"
      @click="updateRates"
    />

    <!-- Auto-update dropdown -->
    <q-select
      v-model="store.conversionRatesAutoUpdateRate"
      label="Update frequency"
      :options="updateOptions"
      emit-value
      map-options
      outlined
      class="q-my-md"
      style="width: 80%"
    />

    <q-card class="q-pa-md q-mb-md" style="width: 80%">
      <q-card-section class="column items-center">
        <div class="q-mb-sm">Reference Currency</div>
        <CurrencyDropdown v-model="store.referenceCurrency" allow-no-currency />
      </q-card-section>

      <q-card-section class="column items-center">
        Rates from: {{ prettyRatesDate }}
      </q-card-section>

      <q-card-section
        v-if="
          store.conversionRates &&
          store.conversionRates.eur &&
          store.referenceCurrency
        "
        class="column items-center"
      >
        <q-input
          v-model="searchQuery"
          debounce="300"
          label="Search currencies"
          placeholder="Type to filter"
          dense
          clearable
          class="q-mb-md"
          style="width: 80%"
        />
        <div style="width: 80%">
          <q-table
            :rows="filteredConversionRows"
            :columns="conversionColumns"
            dense
            flat
            :rows-per-page-options="[0]"
            hide-pagination
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
// Search query for filtering currencies
const searchQuery = ref('');

// Filtered conversion rows based on search
const filteredConversionRows = computed(() => {
  const query = (searchQuery.value || '').trim().toLowerCase();
  if (!query) return conversionRows.value;
  return conversionRows.value.filter((row) =>
    row.currency.toLowerCase().includes(query),
  );
});

import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
import Utils from 'src/utils/utils';
const store = useStore();
const router = useRouter();
const $q = useQuasar();

const goBack = () => router.go(-1);

const updateRates = async () => {
  try {
    await store.fetchConversionRates();
    $q.notify({ message: 'Conversion rates updated!' });
  } catch (error) {
    $q.notify({ message: error.message || error, color: 'negative' });
  }
};

// Pretty print the data date
const prettyRatesDate = computed(() => {
  const d = store.conversionRates?.date;
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

// Dropdown options
const updateOptions = [
  { label: 'Never', value: -1 },
  { label: 'Daily', value: 24 * 60 * 60 * 1000 },
  { label: 'Weekly', value: 7 * 24 * 60 * 60 * 1000 },
  { label: 'Monthly', value: 30 * 24 * 60 * 60 * 1000 },
];

// Table columns for conversion rates (reactive label)
const conversionColumns = computed(() => [
  { name: 'currency', label: 'Currency', field: 'currency', align: 'left' },
  {
    name: 'value',
    label: `1 ${store.referenceCurrency} =`,
    field: 'value',
    align: 'right',
  },
]);

// Table rows for conversion rates
const conversionRows = computed(() => {
  if (!store.conversionRates?.eur || !store.referenceCurrency) return [];
  return Object.keys(store.conversionRates.eur)
    .map((currency) => {
      if (currency === store.referenceCurrency) return null;
      // Convert 1 reference currency to each other currency
      const rate = store.convertCurrency(
        100,
        store.referenceCurrency,
        currency,
      );
      return {
        currency,
        value: Utils.formatCurrency('', rate),
      };
    })
    .filter(Boolean);
});
</script>
