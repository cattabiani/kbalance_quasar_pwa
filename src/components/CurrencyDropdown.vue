<template>
  <q-btn
    :label="buttonProps.label || selected || 'Select currency'"
    v-bind="buttonProps"
    icon-right="arrow_drop_down"
  >
    <q-menu
      anchor="bottom left"
      self="top left"
      @before-show="onBeforeShow"
      :fit="true"
    >
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
        :class="index % 2 === 0 ? 'bg-white' : 'bg-grey-3'"
        clickable
        v-close-popup
        @click="select(currency.value)"
      >
        <q-item-section>{{ currency.label }}</q-item-section>
      </q-item>
      <q-separator v-if="filtered && isExpandable" />

      <q-item
        v-if="filtered && isExpandable"
        clickable
        @click="filtered = false"
      >
        <q-item-section>More...</q-item-section>
      </q-item>
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
const filtered = ref(props.usedCurrencies?.size > 0);
const searchQuery = ref('');
const isExpandable = computed(
  () => props.expandable && props.usedCurrencies.size > 0,
);

const onBeforeShow = () => {
  filtered.value = props.usedCurrencies?.size > 0;
  if (props.clear) {
    selected.value = null;
    emit('update:modelValue', null);
  }
};

const allCurrencies = currencyCodes.data.map(({ code, currency }) => ({
  label: `${code} - ${
    currency.length > 15 ? currency.slice(0, 15) + '...' : currency
  }`,
  value: code,
}));

const filteredCurrencies = computed(() => {
  // return allCurrencies;
  // If no usedCurrencies, show all currencies with optional search filter
  if (props.usedCurrencies.size === 0) {
    let result = allCurrencies;
    const query = searchQuery.value?.toLowerCase();
    if (query) {
      result = result.filter(({ label }) =>
        label.toLowerCase().includes(query),
      );
    }
    return result;
  }

  // If not expandable, only show usedCurrencies filtered list
  if (!isExpandable.value) {
    let result = allCurrencies.filter(({ value }) =>
      props.usedCurrencies.has(value),
    );
    const query = searchQuery.value?.toLowerCase();
    if (query) {
      result = result.filter(({ label }) =>
        label.toLowerCase().includes(query),
      );
    }
    return result;
  }

  // Expandable and filtered=false means show all currencies
  if (!filtered.value) {
    let result = allCurrencies;
    const query = searchQuery.value?.toLowerCase();
    if (query) {
      result = result.filter(({ label }) =>
        label.toLowerCase().includes(query),
      );
    }
    return result;
  }

  // Otherwise, show filtered usedCurrencies list with optional query
  let result = allCurrencies.filter(({ value }) =>
    props.usedCurrencies.has(value),
  );
  const query = searchQuery.value?.toLowerCase();
  if (query) {
    result = result.filter(({ label }) => label.toLowerCase().includes(query));
  }
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
