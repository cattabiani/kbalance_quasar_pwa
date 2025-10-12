<template>
  <span
    class="currency-display"
    style="display: inline-flex; flex-direction: column; align-items: center"
  >
    <!-- Main currency + inline conversion -->
    <span :style="{ color: color }">
      {{ Utils.formatCurrency(currency, amount) }}
      <span
        v-if="
          inlineConversion &&
          referenceCurrency &&
          referenceCurrency !== currency
        "
        class="text-grey-8"
      >
        ({{ Utils.formatCurrency(referenceCurrency, convertedAmount) }})
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
      {{ Utils.formatCurrency(referenceCurrency, convertedAmount) }}
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import Utils from 'src/utils/utils';

const props = defineProps({
  currency: String,
  amount: Number,
  referenceCurrency: { type: String, default: null },
  convertedAmount: { type: Number, default: 100 },
  color: { type: String, default: '#000000' },
  inlineConversion: { type: Boolean, default: false },
});
</script>
