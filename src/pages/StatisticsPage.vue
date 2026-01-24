<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        icon="arrow_back"
        @click="goBack"
        aria-label="Go Back"
        class="bg-white text-primary"
      />
      <q-toolbar-title style="font-size: 28px"> Stats </q-toolbar-title>
      <q-space />
    </q-toolbar>
  </q-header>

  <q-page padding>
    <!-- Command bar: toggle conversion -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-center">
        <q-btn
          :icon="convertCurrency !== null ? 'toggle_on' : 'toggle_off'"
          label="Convert"
          :color="convertCurrency !== null ? 'secondary' : 'negative'"
          class="text-white q-mr-md"
          unelevated
          @click="toggleConversion"
        />

        <CurrencyDropdown
          v-model="currency"
          :usedCurrencies="store.currencies"
          class="text-subtitle1 full-height"
          :expandable="false"
        />
      </q-card-section>
    </q-card>

    <!-- Keywords filter inputs -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Filter Keywords</div>

        <q-input
          v-model="withKeywords"
          dense
          outlined
          label="Include"
          placeholder="Include"
          class="q-mb-sm"
        />
        <q-input
          v-model="withoutKeywords"
          dense
          outlined
          label="Exclude"
          placeholder="Exclude"
          class="q-mb-sm"
        />
        <q-input
          v-model="inverseKeywords"
          dense
          outlined
          label="Invert"
          placeholder="Invert"
        />
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-start q-gutter-md">
        <!-- Compare mode toggle -->
        <q-btn
          :color="compareByRollingMonths ? 'primary' : 'secondary'"
          :label="compareByRollingMonths ? 'Last Months' : 'Years Ago'"
          :icon="compareByRollingMonths ? 'event_repeat' : 'calendar_today'"
          class="text-white"
          unelevated
          @click="compareByRollingMonths = !compareByRollingMonths"
        />

        <!-- Number of comparisons slider -->
        <div class="row items-center" style="flex: 1">
          <q-slider
            v-model.number="nCompares"
            :min="1"
            :max="maxNcompares"
            :step="1"
            snap
            label
            label-always
            markers
            color="primary"
            style="width: 100%"
          />
        </div>
      </q-card-section>

      <q-card-section
        class="row items-stretch justify-start q-gutter-md"
        style="height: 300px"
      >
        <div class="col">
          <ApexChart
            type="line"
            :options="chartOptions"
            :series="monthData"
            height="100%"
            width="100%"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Graphs and stats go here -->
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'StatisticsPage',
});

import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import Statistics from 'src/models/statistics';
import Utils from 'src/utils/utils';
import { ref, computed, watch } from 'vue';
import bounds from 'binary-search-bounds';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
import ApexChart from 'vue3-apexcharts';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const goBack = () => router.go(-1);

const currencies = store.currencies;
const now = new Date();
const rawStats = Statistics.make(store.currentSheet.transactions);
const { totalMonths, monthIndexMap } =
  Statistics.computeTotalMonthsAndIndex(rawStats);
const monthIndex = ref(totalMonths - 1);

const currency = ref(store.referenceCurrency || store.lastCurrency);
const withKeywords = ref('');
const withoutKeywords = ref('');
const inverseKeywords = ref('');
const convertCurrency = ref(store.convertCurrency);
const compareByRollingMonths = ref(true);
const nCompares = ref(1);

const toggleConversion = () => {
  convertCurrency.value = convertCurrency.value ? null : store.convertCurrency;
};

const stats = computed(() => {
  // tokenize keywords
  const includeKw = withKeywords.value
    .split(' ')
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0);
  const excludeKw = withoutKeywords.value
    .split(' ')
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0);
  const invertKw = inverseKeywords.value
    .split(' ')
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0);

  const filtered = rawStats
    .filter((tr) => {
      const name = (tr.name || '').toLowerCase();

      // 1. Exclude
      if (excludeKw.some((k) => name.includes(k))) return false;

      // 2. Include check (only if includeKw is non-empty)

      if (
        includeKw.length > 0 &&
        !includeKw.concat(invertKw).some((k) => name.includes(k))
      )
        return false;

      return true;
    })
    .map((tr) => {
      const trCurrency = tr.currency;

      // skip if currencies do not match and no conversion
      if (trCurrency !== currency.value && !convertCurrency.value) return null;

      // determine sign
      const sign = invertKw.some((k) =>
        (tr.name || '').toLowerCase().includes(k),
      )
        ? -1
        : 1;

      // compute value with optional conversion
      let value = tr.value * sign;

      let finalCurrency = trCurrency;

      if (trCurrency !== currency.value && convertCurrency.value) {
        value = convertCurrency.value(value, trCurrency, currency.value);
        finalCurrency = currency.value;
      }

      return {
        name: tr.name,
        currency: finalCurrency,
        value,
        timestamp: tr.timestamp,
      };
    })
    // remove skipped entries
    .filter((tr) => tr !== null)
    .sort((a, b) => a.timestamp - b.timestamp); // ensure ascending timestamp

  // compute partial sum
  let runningSum = 0;
  return filtered.map((tr) => {
    runningSum += tr.value;
    return { ...tr, partialSum: runningSum };
  });
});

const maxNcompares = computed(() => {
  if (!stats.value.length) return 1;

  let ans = totalMonths;

  if (!compareByRollingMonths.value) {
    ans = Math.floor(ans / 12) + 1;
  }

  return Math.min(ans, 12);
});

const allMonthData = computed(() => {
  if (!rawStats || rawStats.length === 0) return [];

  // --- get start year and month from first stat ---
  const firstDate = new Date(rawStats[0].timestamp);
  const startYear = firstDate.getFullYear();
  const startMonth = firstDate.getMonth();

  // --- prefill all months ---
  const months = Array.from({ length: totalMonths }, (_, i) => {
    const y = startYear + Math.floor((startMonth + i) / 12);
    const m = (startMonth + i) % 12;

    return {
      name: `${Utils.getYear(new Date(y, m).getTime())} ${Utils.getMonth(
        new Date(y, m).getTime(),
      )}`,
      year: y,
      month: m,
      data: [],
    };
  });

  let monthIndex = 0;
  let prevPartial = 0;
  // --- assign stats to month using monthIndexMap ---
  stats.value.forEach((stat, idx) => {
    const d = new Date(stat.timestamp);
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
    if (monthIndexMap[monthKey] !== monthIndex) {
      prevPartial = idx > 0 ? stats.value[idx - 1].partialSum : 0;
    }

    monthIndex = monthIndexMap[monthKey];

    if (monthIndex != null && monthIndex < months.length) {
      months[monthIndex].data.push([
        stat.timestamp,
        (stat.partialSum - prevPartial) / 100,
        idx,
      ]);
    }
  });

  return months;
});

const monthData = computed(() => {
  const n = nCompares.value;
  const rollingMonths = compareByRollingMonths.value;

  const result = [];
  const step = rollingMonths ? 1 : 12;

  let current = monthIndex.value;

  // --- handle first series separately ---
  const firstMonth = allMonthData.value[current];
  if (!firstMonth) return result;

  const firstMonthTimestamp = new Date(
    firstMonth.year,
    firstMonth.month,
    1,
  ).getTime();

  result.push({
    name: firstMonth.name,
    year: firstMonth.year,
    month: firstMonth.month,
    data: firstMonth.data, // no shift
  });

  current -= step;

  // --- handle remaining series ---
  for (let count = 1; count < n && current >= 0; count++) {
    const month = allMonthData.value[current];
    if (!month) {
      current -= step;
      continue;
    }

    const monthStartTs = new Date(month.year, month.month, 1).getTime();
    const shift = firstMonthTimestamp - monthStartTs;

    const shiftedData = month.data.map(([ts, val, idx]) => [
      ts + shift,
      val,
      idx,
    ]);

    result.push({
      name: month.name,
      year: month.year,
      month: month.month,
      data: shiftedData,
    });

    current -= step;
  }

  return result.reverse(); // oldest first
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        rotate: -45,
        format: nCompares.value === 1 ? 'dd MMM' : 'dd', // only format changes
        trim: true,
        style: { fontSize: '10px' },
      },
      tickAmount: nCompares.value === 1 ? undefined : 31,

      tooltip: {
        enabled: true,
        formatter: (val, { seriesIndex, w }) => {
          const series = w.globals.initialSeries?.[seriesIndex];
          if (!series) return '';

          const day = new Date(val).getDate().toString().padStart(2, '0');
          const monthStr = new Date(2000, series.month).toLocaleDateString(
            undefined,
            { month: 'short' },
          );

          return `${day} ${monthStr}`;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
          if (val >= 1e3) return (val / 1e3).toFixed(1) + 'k';
          return val.toFixed(0);
        },
        minWidth: 10,
        maxWidth: 50,
        style: { fontSize: '10px' },
      },
    },
    tooltip: {
      shared: false,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const series = w.globals.initialSeries?.[seriesIndex];
        const seriesData = series?.data;

        if (!seriesData || !seriesData[dataPointIndex]) {
          return '<div style="padding:6px 10px;">No data</div>';
        }

        const [, , statIdx] = seriesData[dataPointIndex];
        const baseStatIdx = seriesData[0]?.[2];

        const stat = stats.value[statIdx];
        const baseStat = stats.value[baseStatIdx];
        if (!stat || !baseStat) {
          return '<div style="padding:6px 10px;">No data</div>';
        }

        const formatVal = (v) => {
          const x = v / 100;
          if (x >= 1e6) return (x / 1e6).toFixed(1) + 'M';
          if (x >= 1e3) return (x / 1e3).toFixed(1) + 'k';
          return x.toFixed(0);
        };

        const rebasedTotal = stat.partialSum - baseStat.partialSum + stat.value;

        return `
      <div style="
        line-height:1.3;
        text-align:left;
        font-size:12px;
        padding:6px 10px;
        border-radius:4px;
        background:#fff;
        color:#000;
        box-shadow:0 2px 6px rgba(0,0,0,0.15);
      ">
        <div style="font-weight:600;">
          ${stat.name || 'N/A'}
        </div>
        Val: ${formatVal(stat.value)}, Tot: ${formatVal(rebasedTotal)}
      </div>
    `;
      },
    },

    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 5 },
  };
});
</script>
