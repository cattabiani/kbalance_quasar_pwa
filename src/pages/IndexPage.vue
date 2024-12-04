<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title style="font-size: 28px"> Sheets </q-toolbar-title>
      <q-btn
        flat
        icon="bug_report"
        @click="debug()"
        class="q-ml-md bg-white text-primary"
        aria-label="Debug"
      />
      <q-btn
        flat
        icon="info"
        @click="showAbout"
        class="q-ml-md bg-white text-primary"
        aria-label="About kBalance"
      />
      <q-btn
        flat
        icon="logout"
        @click="logout"
        class="q-ml-md bg-white text-primary"
        aria-label="Log out"
      />
      <q-btn
        flat
        icon="add"
        @click="addNewSheet()"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new balance sheet"
      />
    </q-toolbar>
  </q-header>

  <q-page v-if="store.fbLedger">
    <q-card>
      <q-card-section>
        <q-input
          v-model="username"
          ref="usernameRef"
          @focus="usernameRef.select()"
          @blur="setUsername"
          label="Username"
          autogrow
          outlined
        />
      </q-card-section>
    </q-card>

        <q-list bordered class="q-mb-md">
          <q-slide-item
            v-for="(obj, index) in store.userSheets"
            :key="index"
            @left="(event) => onLeft(event, obj.id)"
            @click="editSheet(obj.id)"
            left-color="red"
          >
            <template v-slot:left>
              <q-icon name="delete" />
            </template>
            <q-item
              clickable
              :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
            >
              <q-item-section>
                {{ obj.name || "New Sheet" }}
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>

    

    <div v-if="!store.userSheets.length" style="padding: 20px">
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
import AboutContent from "src/components/AboutContent.vue";
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store";

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const isAboutDialogVisible = ref(false);
const timer = ref(null);
const usernameRef = ref(null);
const username = ref("");

const debug = () => {
  const aaa = store.getEditablePerson();
  console.log(aaa);
};

watch(
  () => store.fbLedger, // Watch the `isReady` flag in the store
  (_) => {
    username.value = store.username();
  },
  { immediate: true } // Run immediately to set the username if already ready
);

const setUsername = async () => {
  try {
    await store.setUsername(username.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }
};

const addNewSheet = async () => {
  try {
    await store.addNewSheet();
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }
};

const showAbout = () => {
  // Logic to show the about dialog
  isAboutDialogVisible.value = true; // Set the dialog to visible
};

const editSheet = async (id) => {
  try {
    await store.subscribeCurrentSheet(id);
    router.push({ name: "SheetPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }
};

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const onLeft = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.unfollowSheet(id);
  }, 0);
};

const logout = async () => {
  try {
    await store.logoutUser();
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }
};
</script>

<style scoped></style>
