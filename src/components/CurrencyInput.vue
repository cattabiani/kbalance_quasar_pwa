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
          @click="openCalculator"
          aria-label="Calculate sum"
        />
      </template>
    </q-input>

    <q-dialog v-model="calcDialogOpen">
      <q-card style="min-width: 320px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Sum Calculator</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input
            v-model="calcExpression"
            type="textarea"
            outlined
            placeholder="Enter numbers (e.g. 10 + 25.50 + 5 or list line-by-line)"
            autofocus
            rows="4"
          />
          <div class="row justify-between items-center q-mt-md text-subtitle1">
            <span class="text-weight-bold">Total:</span>
            <span class="text-primary text-weight-bold">{{ formattedSum }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Apply" color="primary" @click="applySum" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CurrencyDisplay
      v-if="
        store.referenceCurrency &&
        props.currency !== store.referenceCurrency &&
        props.modelValue !== 0
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
import { ref, computed, watch } from 'vue';
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
  bgColor: {
    type: String,
    default: ``,
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

const calcDialogOpen = ref(false);
const calcExpression = ref('');

const computedSum = computed(() => {
  if (!calcExpression.value) return 0;
  // Match numbers (including decimals and negative signs)
  const numbers = calcExpression.value.match(/-?\d+(\.\d+)?/g);
  if (!numbers) return 0;
  return numbers.reduce((sum, num) => sum + parseFloat(num), 0);
});

const formattedSum = computed(() => {
  return `${computedSum.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${props.currency || ''}`;
});

const openCalculator = () => {
  calcExpression.value = '';
  calcDialogOpen.value = true;
};

const applySum = () => {
  emit('update:modelValue', computedSum.value);
  calcDialogOpen.value = false;
};

watch(
  () => props.modelValue,
  (value) => {
    setValue(value);
  },
);
</script>

