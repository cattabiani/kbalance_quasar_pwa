<template>
  <div class="q-gutter-none text-center">
    <!-- Top line -->
    <div>{{ topLine }}</div>

    <!-- Bottom line with currency -->
    <div class="text-caption" v-if="amount > 0">
      <template v-if="payerIsYou">
        {{ otherName }} owes you
        <CurrencyDisplay
          :currency="currency"
          :amount="splitAmount"
          :reference-currency="store.referenceCurrency"
          :converted-amount="
            store.convertCurrency(
              splitAmount,
              currency,
              store.referenceCurrency,
            )
          "
          color="green"
          inline-conversion
        />
      </template>
      <template v-else>
        You owe {{ otherName }}
        <CurrencyDisplay
          :currency="currency"
          :amount="splitAmount"
          :reference-currency="store.referenceCurrency"
          :converted-amount="
            store.convertCurrency(
              splitAmount,
              currency,
              store.referenceCurrency,
            )
          "
          color="red"
          inline-conversion
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue';
import { useStore } from 'src/stores/store.js';
const store = useStore();

const props = defineProps({
  split: { type: Boolean, default: false }, // false = full, true = split
  payer: { type: Number, required: true },
  youIdx: { type: Number, required: true },
  otherName: { type: String, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Determine if payer is you
const payerIsYou = computed(() => props.payer === props.youIdx);

// Compute amount for this split
const splitAmount = computed(() =>
  props.split ? (props.amount + (props.amount % 2)) / 2 : props.amount,
);

// Compute top line text
const topLine = computed(() => {
  return props.split
    ? payerIsYou.value
      ? 'You paid, split equally'
      : `${props.otherName} paid, split equally`
    : payerIsYou.value
    ? 'You are owed the full amount'
    : `${props.otherName} is owed the full amount`;
});

// Bottom line color
const colorClass = computed(() =>
  payerIsYou.value ? 'text-green' : 'text-red',
);
</script>
