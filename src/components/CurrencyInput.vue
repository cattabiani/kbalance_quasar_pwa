<template>
  <div>
    <q-input
      ref="inputRef"
      v-model="formattedValue"
      outlined
      :label="props.label"
      @focus="inputRef.select()"
      :input-class="props.alignRight ? 'text-right' : 'text-left'"
      :readonly=props.readonly
    />
    <CurrencyDisplay
      v-if="
        props.currency !== store.referenceCurrency && props.modelValue !== 0
      "
      :currency="store.referenceCurrency"
      :amount="
        store.convertCurrency(
          props.modelValue,
          props.currency,
          store.referenceCurrency,
        )
      "
      class="text-caption text-left q-mt-xs"
    />
  </div>
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue';
import { useStore } from 'src/stores/store.js';

const store = useStore();

const emit = defineEmits(['change', 'update:modelValue']);

// Props
const props = defineProps({
  modelValue: Number,
  currency: String,
  label: String,
  alignRight: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput({
  currency: 'XXX',
  currencyDisplay: 'hidden',
  valueScaling: 'precision',
  valueRange: {
    min: 0,
    max: undefined,
  },
  autoSign: true,
  locale: 'it-CH',
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  },
);
</script>
