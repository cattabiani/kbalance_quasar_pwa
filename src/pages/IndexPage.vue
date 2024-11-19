<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title style="font-size: 28px"> Sheets </q-toolbar-title>
      <q-btn
        flat
        icon="add"
        @click="addSheet"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new balance sheet"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-list bordered class="q-my-md">
      <q-slide-item
        v-for="(sheet, id) in store.sheets"
        :key="id"
        @left="(event) => onLeft(event, id)"
        @dblclick="editSheet(id)"
        left-color="red"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>

        <q-item clickable :class="id % 2 === 0 ? 'bg-grey-1' : 'bg-white'">
          <q-item-section>
            {{ sheet.name || "New Sheet" }}
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
import { ref } from "vue";
import { useStore } from "src/stores/store.js";
import { useRouter } from "vue-router";

const store = useStore();
const timer = ref(null);
const router = useRouter();

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const addSheet = () => {
  store.setSheetID();
  store.addSheet();
};

const onLeft = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.removeSheet(id);
  }, 1);
};

const editSheet = (id) => {
  store.setSheetID(id);
  router.push({ name: "SheetPage" });
};
</script>
