<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    outlined
    :label="props.label"
    @focus="inputRef.select()"
  />
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';

const emit = defineEmits(['change', 'update:modelValue']);

// Props
const props = defineProps({
  modelValue: Number,
  currency: String,
  label: String,
});

const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput({
  currency: props.currency,
  currencyDisplay: 'hidden',
  valueScaling: 'precision',
  valueRange: {
    min: 0,
    max: undefined,
  },
  autoSign: true,
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  },
);

watch(
  () => props.currency,
  (currency) => {
    setOptions({ currency });
  },
);
</script>
