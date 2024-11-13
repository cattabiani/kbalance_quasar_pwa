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
      <q-toolbar-title style="font-size: 28px"> People </q-toolbar-title>
      <!-- <q-btn
        flat
        icon="bug_report"
        @click="debug"
        class="q-ml-md bg-white text-primary"
        aria-label="Debug"
      /> -->
      <q-btn
        flat
        :icon="showOnlyActive ? 'visibility_off' : 'visibility'"
        @click="showOnlyActive = !showOnlyActive"
        class="q-ml-md bg-white text-primary"
        aria-label="Toggle active state"
      />
      <q-btn
        flat
        icon="add"
        @click="addPerson"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new person"
      />
    </q-toolbar>
  </q-header>
  <q-page>
    <q-list bordered class="q-my-md">
      <q-slide-item
        v-for="(person, id) in filteredPeople"
        :key="id"
        @left="(event) => onLeft(event, id)"
        @right="(event) => onRight(event, id)"
        @dblclick="editPerson(id)"
        left-color="red"
        right-color="green"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>
        <template v-slot:right>
          <q-icon name="done" />
        </template>

        <q-item clickable :class="id % 2 === 0 ? 'bg-grey-1' : 'bg-white'">
          <q-item-section>
            <div class="q-gutter-sm" style="display: flex; align-items: left">
              <q-icon
                v-if="!showOnlyActive && !person.active"
                name="radio_button_unchecked"
                class="q-mr-md"
                color="black"
                aria-label="Inactive"
              />
              <q-icon
                v-if="!showOnlyActive && person.active"
                class="text-green q-mr-md"
                name="check_circle"
                color="green"
                aria-label="Active"
              />
              {{ person.name || "New Person" }}
            </div>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </q-page>

  <q-dialog v-model="isEditablePerson" persistent @open="focusInput">
    <q-card>
      <q-card-section>
        <q-input
          ref="personInput"
          v-model="editablePerson.name"
          label="Person"
          autogrow
          outlined
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn icon="close" color="red" @click="closeModal" />
        <q-btn icon="check" color="primary" @click="saveAndCloseModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineOptions({
  name: "PeoplePage",
});

import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";

const timer = ref(null);
const personInput = ref(null);
const showOnlyActive = ref(true);
const editablePerson = ref(null);

const store = useStore();
const router = useRouter();

const isEditablePerson = computed(() => {
  return editablePerson.value !== null;
});

const filteredPeople = computed(() => {
  return store.currentSheet.people.filter(
    (person) => !showOnlyActive.value || person.active
  );
});

const goBack = () => {
  router.go(-1); // Go back to the previous page
};

const addPerson = () => {
  store.personID = -1;
  editablePerson.value = store.getEditablePerson();
  focusInput();
};

const focusInput = () => {
  nextTick(() => {
    personInput.value?.focus(); // Optional chaining to focus input if it exists
    personInput.value?.select(); // Select all text
  });
};

const editPerson = (id) => {
  store.personID = id;
  editablePerson.value = store.getEditablePerson();
  focusInput();
};

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const onLeft = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.deletePerson(id);
  }, 1);
};

const onRight = ({ reset }, id) => {
  finalize(reset);
  setTimeout(() => {
    store.currentSheet.people[id].active = true;
  }, 1);
};

// Save note and close the modal
const saveAndCloseModal = () => {
  store.saveInCurrentPerson(editablePerson.value);
  closeModal();
};

// Close the modal and reset the edit note ID
const closeModal = () => {
  store.personID = -1;
  editablePerson.value = null;
};
</script>
