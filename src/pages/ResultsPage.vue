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
      <q-toolbar-title style="font-size: 28px"> Results </q-toolbar-title>
      <q-btn
        flat
        icon="bug_report"
        @click="debug"
        aria-label="Debug"
        class="bg-white text-primary"
      />
    </q-toolbar>
  </q-header>
  <q-page>
    <q-select
      bordered
      class="q-my-md q-mr-md q-ml-md"
      v-model="selectedPerson"
      :options="options"
      label="Person"
      outlined
    />
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      hide-header
      hide-bottom
      :rows-per-page-options="[]"
      :dense="true"
    >
      <template #body-cell-person0="props">
        <q-td :props="props" class="q-pa-md table-font">
          {{ store.currentSheet.people[selectedPerson.value].name }}
        </q-td>
      </template>

      <template #body-cell-icon="props">
        <q-td
          :props="props"
          :class="{
            'text-red': props.value > 0,
            'text-green': props.value < 0,
          }"
          class="q-pa-md table-font"
        >
          <q-icon
            :name="props.value < 0 ? 'arrow_back' : 'arrow_forward'"
            size="lg"
            class="q-mr-sm"
          />
        </q-td>
      </template>

      <template #body-cell-person1="props">
        <q-td :props="props" class="q-pa-md table-font">
          {{ store.currentSheet.people[props.value].name }}
        </q-td>
      </template>

      <template #body-cell-amount="props">
        <q-td :props="props" class="q-pa-md table-font">
          {{ parseFloat(Math.abs(props.value) / 100).toFixed(2) }}
          {{ props.row.currency }}
        </q-td>
      </template>
    </q-table>
    <div
      v-if="rows.length === 0"
      class="table-font text-center bg-primary text-white rounded-borders shadow-2 q-pa-md"
      style="max-width: 50%; margin: 0 auto"
    >
      All settled!
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "ResultsPage",
});

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import Sheet from "../models/sheet";

const store = useStore();
const router = useRouter();

const options = store.currentSheet.people.map((person, id) => ({
  label: person.name,
  value: id,
}));
const selectedPerson = ref(options[0] || null);

const rows = computed(() => {
  const data = Sheet.getSummary(
    store.currentSheet,
    selectedPerson.value?.value
  );

  return data.map((item, index) => ({
    ...item,
    id: index, // Adding a unique id based on the index
  }));
});

const columns = [
  { name: "person0", label: "Person", align: "left", field: "" },
  { name: "icon", label: "Icon", align: "center", field: "amount" },
  { name: "amount", label: "Amount", align: "center", field: "amount" },
  { name: "icon", label: "Icon", align: "center", field: "amount" },
  { name: "person1", label: "Person", align: "left", field: "person" },
];

const debug = () => {
  console.log(rows.value);
};

const goBack = () => {
  router.go(-1); // Go back to the previous page
};
</script>

<style scoped>
.table-font {
  font-size: 1.5rem; /* Default font size for small devices */
}
</style>
