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

// Local state for the selected option
const selectedOption = ref("");

// Fixed options for the `q-select`
const options = ["CHF", "EUR", "USD"];
</script>

<style scoped>
/* Add any custom styling if needed */
</style>
