<template>
  <q-dialog
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
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
          inputmode="decimal"
        />
        <div class="row justify-between items-center q-mt-md text-subtitle1">
          <span class="text-weight-bold">Total:</span>
          <CurrencyDisplay
            :currency="props.currency"
            :amount="computedSumCents"
            :referenceCurrency="store.referenceCurrency"
            :convertedAmount="
              store.convertCurrency(
                computedSumCents,
                props.currency,
                store.referenceCurrency,
              )
            "
            inlineConversion
            color="var(--q-primary)"
            class="text-weight-bold"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Apply" color="primary" @click="applySum" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue';
import { useStore } from 'src/stores/store.js';

const store = useStore();

const props = defineProps({
  modelValue: Boolean,
  currency: String,
});

const emit = defineEmits(['update:modelValue', 'apply']);

const calcExpression = ref('');

const computedSum = computed(() => {
  if (!calcExpression.value) return 0;
  // Match numbers (including decimals and negative signs)
  const numbers = calcExpression.value.match(/-?\d+(\.\d+)?/g);
  if (!numbers) return 0;
  return numbers.reduce((sum, num) => sum + parseFloat(num), 0);
});

const computedSumCents = computed(() => {
  return Math.round(computedSum.value * 100);
});

// Reset expression when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      calcExpression.value = '';
    }
  },
);

const applySum = () => {
  emit('apply', computedSumCents.value);
  emit('update:modelValue', false);
};
</script>
