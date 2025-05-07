<template>
  <q-btn
    :label="buttonProps.label || selected || 'Select currency'"
    v-bind="buttonProps"
    icon-right="arrow_drop_down"
  >
    <q-menu anchor="bottom left" self="top left" @before-show="onBeforeShow">
      <q-list>
        <q-item>
          <q-item-section>
            <q-input
              v-model="searchQuery"
              debounce="300"
              label="Search currencies"
              placeholder="Type to filter"
              dense
              clearable
            />
          </q-item-section>
        </q-item>
        <q-item
          v-for="(currency, index) in filteredCurrencies"
          :key="currency.value"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-grey-2'"
          clickable
          v-close-popup
          @click="select(currency.value)"
        >
          <q-item-section>{{ currency.label }}</q-item-section>
        </q-item>
        <q-separator v-if="filtered && expandable" />

        <q-item
          v-if="filtered && expandable"
          clickable
          @click="filtered = false"
        >
          <q-item-section>More...</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import currencyCodes from 'currency-codes';

const props = defineProps({
  modelValue: String,
  usedCurrencies: {
    type: Set,
    default: () => new Set(),
  },
  buttonProps: {
    type: Object,
    default: () => ({}),
  },
  expandable: {
    type: Boolean,
    default: true,
  },
  clear: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const selected = ref(props.modelValue);
const filtered = ref(props.usedCurrencies.size > 0);
const searchQuery = ref('');

const onBeforeShow = () => {
  filtered.value = props.usedCurrencies.size > 0;
  if (props.clear) {
    selected.value = null;
    emit('update:modelValue', null);
  }
};

const allCurrencies = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

const filteredCurrencies = computed(() => {
  // Step 1: Apply usedCurrencies filter (if any)
  let result = !props.expandable
    ? allCurrencies.filter(({ value }) => props.usedCurrencies.has(value))
    : props.usedCurrencies.size === 0 || !filtered.value
    ? allCurrencies
    : allCurrencies.filter(({ value }) => props.usedCurrencies.has(value));

  // Step 2: Apply search query filter
  const query = searchQuery.value?.toLowerCase();
  if (query) {
    result = result.filter(({ label }) => label.toLowerCase().includes(query));
  }

  // Step 3: Return result
  return result;
});

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val;
  },
);

function select(code) {
  selected.value = code;
  emit('update:modelValue', code);
}
</script>
