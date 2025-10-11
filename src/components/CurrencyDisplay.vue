<template>
  <span
    class="currency-display"
    style="display: inline-flex; flex-direction: column; align-items: center"
  >
    <!-- Main currency + inline conversion -->
    <span :style="{ color: color }">
      {{ formatCurrency(currency, amount) }}
      <span
        v-if="
          inlineConversion &&
          referenceCurrency &&
          referenceCurrency !== currency
        "
        class="text-grey-8"
      >
        ({{ formatCurrency(referenceCurrency, convertedAmount) }})
      </span>
    </span>

    <!-- Second-line conversion (only if not inline) -->
    <span
      v-if="
        !inlineConversion && referenceCurrency && referenceCurrency !== currency
      "
      class="text-grey-8"
      style="line-height: 1; font-size: 0.6em"
    >
      {{ formatCurrency(referenceCurrency, convertedAmount) }}
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const formatCurrency = (currency, amount) => {
  const formatted = new Intl.NumberFormat('it-CH', {
    maximumFractionDigits: 2,
  }).format(amount / 100);
  return `${currency} ${formatted}`;
};

const props = defineProps({
  currency: String,
  amount: Number,
  referenceCurrency: { type: String, default: null },
  conversionRatio: { type: Number, default: 1.0 },
  color: { type: String, default: '#000000' },
  inlineConversion: { type: Boolean, default: false },
});

const convertedAmount = computed(() => {
  return Math.round(props.amount * props.conversionRatio);
});
</script>
