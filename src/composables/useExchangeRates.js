import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

export function useExchangeRates(fromCurrency, toCurrency) {
  const $q = useQuasar();
  const rates = ref(null);

  onMounted(async () => {
    const apiUrl = `https://cdn.jsdelivr.net/gh/ismartcoding/currency-api/latest/data.json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      rates.value = await response.json();
    } catch (error) {
      $q.notify({ message: error.message || error, color: 'negative' });
    }
  });

  const conversionMulti = computed(() => {
    if (!rates.value) return 1.0;

    const from = rates.value.quotes[fromCurrency.value];
    const to = rates.value.quotes[toCurrency.value];

    if (!from) {
      $q.notify(`Unknown currency ${fromCurrency.value}!`);
      return 1.0;
    }
    if (!to) {
      $q.notify(`Unknown currency ${toCurrency.value}!`);
      return 1.0;
    }

    return to / from;
  });

  return {
    conversionMulti,
    rates,
  };
}
