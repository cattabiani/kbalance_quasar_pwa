<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    outlined
    label="Amount"
    @focus="inputRef.select()"
  />
</template>

<script setup>
import { useCurrencyInput } from "vue-currency-input";
import { watch } from "vue";

// Props
const props = defineProps({
  modelValue: Number,
  currency: String,
});

const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput({
  currency: props.currency,
  currencyDisplay: "hidden",
  valueScaling: "precision",
  allowNegative: false,
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  }
);

watch(
  () => props.currency,
  (currency) => {
    setOptions({ currency });
  }
);
</script>
