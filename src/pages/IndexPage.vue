<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title style="font-size: 28px"> Sheets </q-toolbar-title>
      <q-btn
        flat
        icon="info"
        @click="showAbout"
        class="q-ml-md bg-white text-primary"
        aria-label="About kNote"
      />
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
        v-for="([key, sheet], id) in Object.entries(store.sheets)"
        :key="key"
        @left="(event) => onLeft(event, key)"
        @dblclick="editSheet(key)"
        left-color="red"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>

        <q-item clickable :class="id % 2 === 0 ? 'bg-grey-3' : 'bg-white'">
          <q-item-section>
            {{ sheet.name || "New Sheet" }}
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
    <!-- empty state -->
    <div v-if="store.sheets.length === 0" style="padding: 20px">
      <AboutContent />
    </div>
  </q-page>

  <q-dialog v-model="isAboutDialogVisible" persistent>
    <q-card style="width: 90%">
      <q-card-section><AboutContent /></q-card-section>
      <q-card-actions align="center">
        <q-btn icon="close" color="red" @click="isAboutDialogVisible = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
import { ref, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store.js";
import { useRouter } from "vue-router";
import AboutContent from "../components/AboutContent.vue";
import Sheet from "../models/sheet";

const store = useStore();
const timer = ref(null);
const router = useRouter();
const $q = useQuasar();
const isAboutDialogVisible = ref(false);

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const showAbout = () => {
  // Logic to show the about dialog
  isAboutDialogVisible.value = true; // Set the dialog to visible
};

const addSheet = () => {
  const newSheet = Sheet.make();
  store.addSheet(newSheet);
  store.setSheetID(newSheet.id);
  router.push({ name: "SheetPage" });
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

const installPromptHandler = (event) => {
  event.preventDefault(); // Prevent the default prompt from appearing

  notification = $q.notify({
    actions: [
      {
        label: "Install",
        color: "white",
        handler: () => {
          if (event) {
            event.prompt(); // Show the install prompt
            notification.close(); // Dismiss the notification
          }
        },
      },
      {
        label: "Dismiss",
        color: "white",
        handler: () => {
          notification.close(); // Dismiss the notification
        },
      },
    ],
    timeout: 0, // Prevent it from auto-closing
  });
};

window.addEventListener("beforeinstallprompt", installPromptHandler);

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", installPromptHandler);
});
</script>
