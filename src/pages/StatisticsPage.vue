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
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-center q-gutter-md">
        <people-dropdown
          v-model="selectedPerson"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
          all-label="Cumulative"
        />
      </q-card-section>
      <q-card-section class="row items-center justify-center q-gutter-md">
        <CurrencyDropdown
          v-model="currency"
          :usedCurrencies="store.currencies"
          class="text-subtitle1 full-height"
          :expandable="false"
        />

        <q-btn
          :icon="convertCurrency !== null ? 'toggle_on' : 'toggle_off'"
          label="Convert"
          :color="convertCurrency !== null ? 'secondary' : 'negative'"
          class="text-white"
          unelevated
          @click="toggleConversion"
        />
      </q-card-section>
    </q-card>

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

    <q-card flat bordered>
      <q-card-section
        class="row items-center justify-center q-gutter-md q-pb-none"
      >
        <q-btn
          :color="compareByRollingMonths ? 'primary' : 'secondary'"
          :label="compareByRollingMonths ? 'Last Months' : 'Years Ago'"
          :icon="compareByRollingMonths ? 'event_repeat' : 'calendar_today'"
          class="text-white"
          unelevated
          @click="compareByRollingMonths = !compareByRollingMonths"
        />

        <div class="row" style="flex: 1">
          <q-slider
            v-model.number="nMonthCompares"
            :min="1"
            :max="Nmonths"
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

      <div class="full-height full-width">
        <q-carousel
          v-model="monthIndex"
          swipeable
          animated
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          control-color="primary"
          class="no-padding-carousel q-pa-none q-ma-none"
          style="height: 220px; overflow: hidden"
        >
          <q-carousel-slide
            v-for="n in totalMonths"
            :key="n - 1"
            :name="n - 1"
            class="q-pa-none flex w-full h-full items-center justify-center"
          >
            <ApexChart
              type="line"
              :options="monthChartOptions"
              :series="monthIndex === n - 1 ? monthData : []"
              height="100%"
              width="100%"
              class="w-full h-full"
            />
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <q-slider
          v-model.number="nYearCompares"
          :min="1"
          :max="Math.min(4, totalYears)"
          :step="1"
          snap
          label
          label-always
          markers
          color="primary"
          style="width: 100%"
        />
      </q-card-section>
      <q-card-section>
        <q-carousel
          v-model="yearIndex"
          swipeable
          animated
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          control-color="primary"
          class="no-padding-carousel q-pa-none q-ma-none"
          style="height: 220px; overflow: hidden"
        >
          <q-carousel-slide
            v-for="n in totalYears"
            :key="n - 1"
            :name="n - 1"
            class="q-pa-none flex w-full h-full items-center justify-center"
          >
            <ApexChart
              type="bar"
              :options="monthYearChartOptions"
              :series="yearIndex === n - 1 ? yearMonthData : []"
              height="100%"
              width="100%"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <ApexChart
          type="bar"
          :options="yearChartOptions"
          :series="yearData"
          height="100%"
          width="100%"
        />
      </q-card-section>
    </q-card>
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
import Transaction from 'src/models/transaction';
import Utils from 'src/utils/utils';
import PeopleDropdown from 'src/components/PeopleDropdown.vue';
import { ref, computed, onMounted } from 'vue';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
import ApexChart from 'vue3-apexcharts';

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const goBack = () => router.go(-1);

const selectedPerson = ref(store.user.id);
const selectedPersonIdx = computed(() =>
  selectedPerson.value === '__ALL__'
    ? -1
    : store.personId2Idx(selectedPerson.value),
);

const firstTr =
  store.currentSheet.transactions[
    store.currentSheetTransactions[store.currentSheetTransactions.length - 1]
  ];
const lastTr =
  store.currentSheet.transactions[store.currentSheetTransactions[0]];

const totalMonths = Statistics.getTotalMonths(
  firstTr.timestamp,
  lastTr.timestamp,
);

const totalYears = Statistics.getTotalYears(
  firstTr.timestamp,
  lastTr.timestamp,
);

const monthIndexMap = Statistics.getMonthIndexMap(
  firstTr.timestamp,
  totalMonths,
);

const monthIndex = ref(0);
const yearIndex = ref(0);

const currency = ref(store.referenceCurrency || store.lastCurrency);
const withKeywords = ref('');
const withoutKeywords = ref('');
const inverseKeywords = ref('');
const convertCurrency = ref(store.convertCurrency);
const compareByRollingMonths = ref(true);
const nMonthCompares = ref(1);
const nYearCompares = ref(1);

const toggleConversion = () => {
  convertCurrency.value = convertCurrency.value ? null : store.convertCurrency;
};

onMounted(() => {
  monthIndex.value = totalMonths - 1;
  yearIndex.value = totalYears - 1;
});

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

  const filtered = store.currentSheetTransactions
    .filter((id) => {
      const tr = store.currentSheet.transactions[id];
      Transaction.update(tr);
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
    .map((id) => {
      const tr = store.currentSheet.transactions[id];
      Transaction.update(tr);
      const trCurrency = tr.currency;

      // skip if currencies do not match and no conversion
      if (trCurrency !== currency && !convertCurrency) return null;

      let value = 0;

      if (selectedPersonIdx.value < 0) {
        value = Transaction.credit(tr);
      } else if (selectedPersonIdx.value < tr.credits.length) {
        value = tr.credits[selectedPersonIdx.value];
      }

      // determine sign
      const sign = invertKw.some((k) =>
        (tr.name || '').toLowerCase().includes(k),
      )
        ? -1
        : 1;

      // compute value with optional conversion
      value *= sign;

      let finalCurrency = trCurrency;

      if (trCurrency !== currency.value && convertCurrency.value) {
        value = convertCurrency.value(value, trCurrency, currency.value);
        finalCurrency = currency;
      }

      return {
        name: tr.name,
        currency: finalCurrency,
        value,
        timestamp: tr.timestamp,
      };
    })
    // remove skipped entries
    .filter((tr) => tr !== null);

  // compute partial sum
  let runningSum = 0;
  return filtered.reverse().map((tr) => {
    runningSum += tr.value;
    return { ...tr, partialSum: runningSum };
  });
});

const Nmonths = computed(() => {
  if (!stats.value.length) return 1;

  let ans = totalMonths;

  if (!compareByRollingMonths.value) {
    ans = Math.floor(ans / 12) + 1;
  }

  return Math.min(ans, 12);
});

const statsByMonth = computed(() => {
  if (stats.value.length === 0) return [];

  // --- get start year and month from first stat ---
  const firstDate = new Date(firstTr.timestamp);
  const startYear = firstDate.getFullYear();
  const startMonth = firstDate.getMonth();

  // --- prefill all months ---
  const months = Array.from({ length: totalMonths }, (_, i) => {
    const y = startYear + Math.floor((startMonth + i) / 12);
    const m = (startMonth + i) % 12;

    return {
      name: `${Utils.getMonth(new Date(y, m).getTime())} ${Utils.getYear(
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
  const result = [];
  const step = compareByRollingMonths.value ? 1 : 12;

  let current = monthIndex.value;

  // --- handle first series separately ---
  const firstMonth = statsByMonth.value[current];
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
  for (let count = 1; count < nMonthCompares.value && current >= 0; count++) {
    const month = statsByMonth.value[current];
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

const binsByYearMonth = computed(() => {
  if (!stats.value.length) return [];

  const byYear = {};

  // 1️⃣ Build month totals in forward order (old → recent)
  stats.value.forEach((stat) => {
    const d = new Date(stat.timestamp);
    const y = d.getFullYear();
    const m = d.getMonth(); // 0–11

    if (!byYear[y]) {
      byYear[y] = Array(12).fill(0);
    }

    byYear[y][m] += stat.value / 100;
  });
  return byYear;
});

const yearMonthData = computed(() => {
  if (!stats.value.length) return [];

  // 2️⃣ Sort years ascending (old → recent)
  const years = Object.keys(binsByYearMonth.value).sort((a, b) => a - b);

  // 3️⃣ Compute slice indices going backwards from yearIndex
  const endIdx = yearIndex.value + 1; // exclusive
  const startIdx = Math.max(0, endIdx - nYearCompares.value);

  const selectedYears = years.slice(startIdx, endIdx).reverse(); // reverse → most recent first

  // 4️⃣ Format for ApexChart
  return selectedYears.map((year) => ({
    name: year,
    data: binsByYearMonth.value[year],
  }));
});

const yearData = computed(() => {
  const byYear = binsByYearMonth.value;
  if (!byYear || !Object.keys(byYear).length) return [];

  const years = Object.keys(byYear).sort((a, b) => a - b); // ascending years

  return [
    {
      name: 'Yearly total',
      data: years.map((year) => byYear[year].reduce((sum, m) => sum + m, 0)),
    },
  ];
});

const yearCategories = computed(() =>
  Object.keys(binsByYearMonth.value).sort((a, b) => a - b),
);

const yearChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: false },
    animations: { enabled: false },
    padding: { left: 0, right: 0, top: 0, bottom: 0 },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%', // reasonable width
      distributed: false, // not needed for single series
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: yearCategories.value, // one label per bar (year)
    labels: {
      show: true,
      rotate: -30,
      trim: false,
      style: { fontSize: '12px', fontWeight: 500 },
      offsetX: 0,
      offsetY: 0,
      minHeight: 25,
    },
    tickPlacement: 'on',
  },
  yaxis: {
    labels: {
      formatter: (val) => {
        if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
        if (val >= 1e3) return (val / 1e3).toFixed(1) + 'k';
        return val.toFixed(0);
      },
      style: { fontSize: '10px' },
    },
  },
  tooltip: { y: { formatter: (v) => v.toFixed(2) } },
  legend: { show: false },
  grid: {
    padding: { left: 0, right: 0 },
    row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        xaxis: {
          labels: { rotate: -45, style: { fontSize: '10px' }, minHeight: 30 },
        },
      },
    },
  ],
}));

const monthYearChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: false },
    animations: { enabled: false },
    padding: { left: 0, right: 0, top: 0, bottom: 0 },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '80%', // thinner bars on mobile
      distributed: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: {
      rotate: -45, // tilt
      trim: true,
      style: { fontSize: '10px', fontWeight: 500 },
      offsetX: 0,
      offsetY: 0,
      minHeight: 30, // ensures space for tilt
    },
    tickPlacement: 'on',
  },
  yaxis: {
    labels: {
      formatter: (val) => {
        if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
        if (val >= 1e3) return (val / 1e3).toFixed(1) + 'k';
        return val.toFixed(0);
      },
      style: { fontSize: '10px' },
    },
  },
  tooltip: {
    y: { formatter: (v) => v.toFixed(2) },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    offsetY: 0,
    offsetX: 0,
  },
  grid: {
    padding: { left: 0, right: 0 },
    row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        xaxis: {
          labels: { rotate: -60, style: { fontSize: '8px' }, minHeight: 35 },
        },
      },
    },
  ],
}));

const monthChartOptions = computed(() => {
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
        format: nMonthCompares.value === 1 ? 'dd MMM' : 'dd', // only format changes
        trim: true,
        style: { fontSize: '10px' },
      },
      tickAmount: nMonthCompares.value === 1 ? undefined : 31,

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
    legend: {
      show: true,
      showForSingleSeries: true,
      offsetY: 0,
      offsetX: 0,
    },

    grid: {
      padding: { left: 10, right: 10, top: 0, bottom: 0 },
    },
  };
});
</script>
