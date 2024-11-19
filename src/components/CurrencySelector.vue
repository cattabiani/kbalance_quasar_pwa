<template>
  <q-select
    v-model="selectedOption"
    :options="options"
    label="Select a Currency"
    outlined
  />
</template>

<script setup>
import { ref } from "vue";
import currencyCodes from "currency-codes";

// Local state for the selected option
const selectedOption = ref("");

// Fixed options for the `q-select`
const options = currencyCodes.data.map((currency) => currency.code);
</script>

<style scoped>
/* Add any custom styling if needed */
</style>
