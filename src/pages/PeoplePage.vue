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
      <q-toolbar-title style="font-size: 28px">
        People
        <div class="text-subtitle2">{{ store.user.email }}</div>
      </q-toolbar-title>
      <q-btn
        flat
        class="q-ml-md bg-white text-primary"
        :icon="seeInactive ? 'visibility_off' : 'visibility'"
        :label="seeInactive ? 'Hide' : 'Show'"
        @click="seeInactive = !seeInactive"
      />
      <q-btn
        flat
        class="q-ml-md bg-white text-primary"
        icon="done"
        label="Confirm"
        @click="confirm"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <people-list
      v-model="store.currentSheet.people"
      v-model:seeInactive="seeInactive"
      ref="peopleListRef"
    />
  </q-page>
</template>

<script setup>
defineOptions({
  name: "PeoplePage",
});

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store";
import PeopleList from "src/components/PeopleList.vue";
import { ref, watch } from "vue";

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const seeInactive = ref(false);
const peopleListRef = ref(null);

const confirm = async () => {
  try {
    await store.setPeople(peopleListRef.value.getPeople());
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
    return;
  }
  goBack();
};

const goBack = () => {
  router.go(-1);
};

watch(
  store.currentSheet,
  async (newValue) => {
    if (newValue === null) {
      goBack();
    }
  },
  { immediate: true }
);

const logout = async () => {
  try {
    await store.logout();
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
    return;
  }
};

watch(
  store.userLedger,
  async (newValue) => {
    if (newValue === null) {
      await logout();
    }
  },
  { immediate: true }
);
</script>
