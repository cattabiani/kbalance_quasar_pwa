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
        v-for="(id, index) in store.currentSheetPeople"
        :key="index"
        @left="(event) => onLeft(event, id)"
        @right="(event) => onRight(event, id)"
        @click="editPerson(id)"
        left-color="red"
        right-color="green"
        v-show="store.isPersonActive(id) || !showOnlyActive"
        v-ripple
        :class="index % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
      >
        <template v-slot:left>
          <q-icon name="delete" />
        </template>
        <template v-slot:right>
          <q-icon name="done" />
        </template>

        <q-item>
          <q-item-section>
            <div class="q-gutter-sm" style="display: flex; align-items: center">
              <q-icon
                v-if="!showOnlyActive && !store.isPersonActive(id)"
                name="radio_button_unchecked"
                color="black"
                aria-label="Inactive"
              />
              <q-icon
                v-if="!showOnlyActive && store.isPersonActive(id)"
                name="check_circle"
                color="primary"
                aria-label="Active"
              />
              <q-icon
                name="person"
                :color="store.isUser(id) ? 'primary' : 'grey'"
                :aria-label="store.isUser(id) ? 'Real user' : 'Fake user'"
              />
              <div style="display: flex; align-items: center">
                {{ store.username(id) || "New Person" }}
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </q-page>

  <q-dialog v-model="isEditablePerson" persistent @open="focusInput">
    <q-card>
      <q-card-section>
        <SelectPerson v-model="selectedPerson" :peopleOptions="peopleOptions" />

        <q-input
          ref="personInput"
          v-model="editablePerson.name"
          label="Person"
          autogrow
          outlined
          @blur="resetToFakeUser"
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

import { ref, nextTick, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import { useQuasar } from "quasar";
import SelectPerson from "src/components/SelectPerson.vue";
const $q = useQuasar();

const timer = ref(null);
const personInput = ref(null);
const showOnlyActive = ref(true);
const editablePerson = ref(null);
const isEditablePerson = ref(false);
const selectedPerson = ref(null);
let oldPersonId = null;
let isNewPerson = false;

const store = useStore();
const router = useRouter();

watch(selectedPerson, (newValue) => {
  if (newValue !== null) {
    editablePerson.value.name = null;
    editablePerson.value.id = store.users[newValue];
  }
});

const resetToFakeUser = () => {
  selectedPerson.value = null;
  editablePerson.value.id = oldPersonId;
};

// Compute the options based on the store
const peopleOptions = computed(() => {
  const users = store.users || [];
  return users.map((id, index) => ({
    label: store.username(id) || "New Person",
    isUser: true,
    value: index,
  }));
});

watch(editablePerson, (newValue) => {
  isEditablePerson.value = !!newValue;
  if (isEditablePerson.value) {
    selectedPerson.value = null;
  }
});

const goBack = () => {
  router.go(-1); // Go back to the previous page
};

const addPerson = () => {
  editablePerson.value = store.getEditablePerson();
  oldPersonId = editablePerson.value.id;
  isNewPerson = true;

  focusInput();
};

const focusInput = () => {
  nextTick(() => {
    personInput.value?.focus(); // Optional chaining to focus input if it exists
    personInput.value?.select(); // Select all text
  });
};

const editPerson = (id) => {
  oldPersonId = id;
  isNewPerson = false;
  editablePerson.value = store.getEditablePerson(id);
  focusInput();
};

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const onLeft = async ({ reset }, id) => {
  finalize(reset);

  // Wrap setTimeout in a Promise to use async/await correctly
  await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await store.removePerson(id);
        // If needed, resolve after the async operation completes
        resolve();
      } catch (error) {
        $q.notify({
          message: error.message || error,
        });
        resolve(); // resolve the promise even if there's an error
      }
    }, 0); // You can adjust the timeout duration here
  });
};

const onRight = async ({ reset }, id) => {
  finalize(reset);

  // Wrap setTimeout in a Promise to use async/await correctly
  await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await store.activatePerson(id);
        // If needed, resolve after the async operation completes
        resolve();
      } catch (error) {
        $q.notify({
          message: error.message || error,
        });
        resolve(); // resolve the promise even if there's an error
      }
    }, 0); // You can adjust the timeout duration here
  });
};

// Save note and close the modal
const saveAndCloseModal = async () => {
  try {
    await store.addPerson(
      editablePerson.value,
      isNewPerson ? null : oldPersonId
    );
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }

  closeModal();
};

// Close the modal and reset the edit note ID
const closeModal = () => {
  editablePerson.value = null;
};
</script>
