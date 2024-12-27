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
        New Sheet Wizard
        <div class="text-subtitle2">{{ store.user.email }}</div>
      </q-toolbar-title>
      <q-btn
        flat
        class="q-ml-md bg-white text-primary"
        icon="done"
        label="Proceed"
        @click="submit"
      />
    </q-toolbar>
  </q-header>

  <q-page>
    <q-form ref="formRef">
      <q-card>
        <q-card-section>
          <q-input
            ref="nameRef"
            outlined
            v-model="name"
            @focus="nameRef.select()"
            :rules="[
              (val) => (val && val.length > 0) || 'Name cannot be empty',
            ]"
            label="Sheet Name"
          />
        </q-card-section>
      </q-card>
    </q-form>
    <people-list
      v-model="people"
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
import Person from "src/models/person";
import { ref, watch } from "vue";

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const userPerson = Person.user2person(store.user);
const people = ref({ [userPerson.id]: userPerson });
const seeInactive = ref(true);
const name = ref("");
const nameRef = ref(null);
const formRef = ref(null);
const peopleListRef = ref(null);

const goBack = () => {
  router.go(-1);
};

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

const submit = async () => {
  // Manually trigger form validation
  const isValid = await formRef.value.validate();

  if (!isValid) {
    return;
  }

  try {
    const newPeople = peopleListRef.value.getPeople();
    const newSheet = await store.addSheetFromNameAndPeople(
      name.value,
      newPeople
    );
    $q.notify(`Sheet ${newSheet.name} added successfully`);
    await store.subscribeCurrentSheet(newSheet.id);
    router.replace({ name: "SheetPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
  }
};
</script>
