<template>
  <div>
    <q-input
      ref="inputRef"
      v-model="formattedValue"
      outlined
      :label="props.label"
      @focus="inputRef.select()"
      :input-class="props.alignRight ? 'text-right' : 'text-left'"
      :readonly="props.readonly"
      :bg-color="props.bgColor"
    >
      <template v-slot:append v-if="!props.readonly">
        <q-btn
          flat
          round
          dense
          icon="calculate"
          @click="calcDialogOpen = true"
          aria-label="Calculate sum"
        />
      </template>
    </q-input>

    <SumCalculatorDialog
      v-model="calcDialogOpen"
      :currency="props.currency"
      @apply="applySum"
    />

    <CurrencyDisplay
      v-if="store.referenceCurrency && props.currency !== store.referenceCurrency"
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
import { ref, watch } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue';
import SumCalculatorDialog from './SumCalculatorDialog.vue';
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
  bgColor: {
    type: String,
    default: ``,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const { inputRef, formattedValue, setValue } = useCurrencyInput({
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

const calcDialogOpen = ref(false);

const applySum = (sumCents) => {
  emit('update:modelValue', sumCents);
};

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  },
);
</script>
