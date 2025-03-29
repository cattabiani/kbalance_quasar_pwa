<template>
  <div>
    <q-card
      v-if="negativeSummaryDisplay || positiveSummaryDisplay"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-if="negativeSummaryDisplay" :style="{ color: 'green' }">
          {{ store.getName(selectedPerson) }} is owed
          {{ negativeSummaryDisplay }}
        </div>

        <div v-if="positiveSummaryDisplay" :style="{ color: 'red' }">
          {{ store.getName(selectedPerson) }} owes
          {{ positiveSummaryDisplay }}
        </div>
      </div>
    </q-card>

    <q-card v-else class="q-my-md q-mr-md q-ml-md">
      <div class="q-pa-md">
        <div>All Settled!</div>
      </div>
    </q-card>

    <q-card
      v-if="localSummaries && localSummaries.detail.length > 0"
      class="q-my-md q-mr-md q-ml-md"
    >
      <div class="q-pa-md">
        <div v-for="item in localSummaries.detail" :key="item.id">
          <div>
            <span>
              {{
                item.amount > 0
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
              }}
            </span>
            <span> owes </span>
            <span>
              {{
                item.amount < 0
                  ? store.getName(selectedPerson)
                  : store.getName(store.personIdx2Id(item.person))
              }}
              &nbsp;
            </span>
            <span :style="{ color: item.amount > 0 ? 'red' : 'green' }">
              {{ Utils.displayCurrency(item.currency, Math.abs(item.amount)) }}
            </span>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import Utils from 'src/utils/utils';
import Results from 'src/models/results';

import { ref, watch, computed } from 'vue';

const store = useStore();

const props = defineProps({
  summaries: {
    type: Object,
    required: true,
  },
  selectedPerson: {
    type: [String],
    required: true,
  },
});

const localSummaries = computed(() => {
  const { ans, totals } = props.summaries;

  const detail = ans.map((item, index) => ({
    ...item,
    id: index, // Adding a unique id based on the index
  }));
  return { detail, totals }; // Return both formattedAns and totals
});

const positiveSummaryDisplay = computed(() => {
  return Object.entries(localSummaries.value.totals)
    .filter(([_, amount]) => amount > 0) // Filter for positive values
    .map(([currency, amount]) => Utils.displayCurrency(currency, amount)) // Format the string
    .join(' + ');
});

const negativeSummaryDisplay = computed(() => {
  return Object.entries(localSummaries.value.totals)
    .filter(([_, amount]) => amount < 0) // Filter for positive values
    .map(([currency, amount]) => Utils.displayCurrency(currency, -amount)) // Format the string
    .join(' + ');
});
</script>
