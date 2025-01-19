<template>
  <q-list bordered class="q-my-md">
    <q-slide-item
      v-for="(id, index) in peopleList"
      :key="id"
      @left="(event) => removePerson(event, id)"
      @click="editPerson(id)"
      @right="(event) => activatePerson(event, id)"
      left-color="red"
      right-color="green"
      :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
    >
      <template v-slot:left>
        <q-icon name="delete" />
      </template>
      <template v-slot:right>
        <q-icon name="done" />
      </template>
      <q-item clickable>
        <q-item-section>
          <person-item :id="id" :people="people" />
        </q-item-section>
        <people-dropdown
          v-if="!store.isUserOrFriend(id)"
          :people="store.userLedger.friends"
          :ignored-people="people"
          @itemClick="(newid) => upgradeToUser(id, newid)"
          is-upgrade
          @click="stopPropagation($event)"
        />
        <q-btn
          v-if="store.isUserOrFriend(id) && store.isPersonFullyRemovable(id)"
          color="grey"
          icon="arrow_circle_down"
          label="Downgrade"
          @click="downgradeUser($event, id)"
        />
      </q-item>
    </q-slide-item>
  </q-list>

  <div class="q-mt-sm q-mb-sm q-gutter-sm flex justify-center">
    <people-dropdown
      :people="store.userLedger.friends"
      :ignored-people="people"
      @itemClick="addUser"
    />
    <q-btn color="grey" icon="person" label="Add Person" @click="addPerson" />
  </div>

  <receive-string
    :hideScan="true"
    v-model="editPersonName"
    v-model:isVisible="isEditPersonDialog"
  />

</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import { event, useQuasar } from "quasar";
import { ref, computed, watch } from "vue";
import ReceiveString from "src/components/ReceiveString.vue";
import PeopleDropdown from "src/components/PeopleDropdown.vue";
import PersonItem from "src/components/PersonItem.vue";
import Person from "src/models/person";
import _ from "lodash";

const store = useStore();
const router = useRouter();
const $q = useQuasar();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  seeInactive: {
    type: Boolean,
    required: true,
  },
});

// Create a deep copy of the modelValue
const people = ref(_.cloneDeep(props.modelValue));
const peopleList = computed(() => {
  const filteredPeople = Object.keys(people.value).filter((id) => {
    return props.seeInactive || people.value[id].active;
  });
  return filteredPeople.sort(
    (a, b) => people.value[a].timestamp - people.value[b].timestamp
  );
});
const friends = computed(() => {
  // Filter the friends who are not in people.value
  return Object.values(store.userLedger.friends)
    .filter((value) => !(value.id in people.value)) // Exclude friends already in people.value
    .sort((a, b) => Person.compare(a, b)) // Sort by Person.compare
    .map((friend) => friend.id); // Extract only the IDs
});
const editPersonName = ref(null);
const isEditPersonDialog = ref(false);
const editPersonId = ref(null);
const timer = ref(null);

defineExpose({
  // Exposing a method for parent access
  getPeople: () => {
    return people.value;
  },
});

const upgradeToUser = (oldid, newid) => {
  addUser(newid, people.value[oldid].timestamp);
  delete people.value[oldid];
};

const downgradeUser = (event, id) => {
  const newPerson = Person.make(
    null,
    people.value[id].name,
    "",
    people.value[id].timestamp
  );
  people.value[newPerson.id] = newPerson;
  delete people.value[id];

  stopPropagation(event);
};

const stopPropagation = (event) => {
  event.stopPropagation();
};

const editPerson = (id) => {
  editPersonName.value = people.value[id].name;
  isEditPersonDialog.value = true;
  editPersonId.value = id;
};

const addPerson = () => {
  editPersonName.value = "";
  isEditPersonDialog.value = true;
  editPersonId.value = null;
};

const addUser = (id, timestamp = null) => {
  people.value[id] = Person.user2person(store.userLedger.friends[id]);
  if (timestamp) {
    people.value[id].timestamp = timestamp;
  }
};

const finalize = (reset) => {
  timer.value = setTimeout(() => {
    reset?.(); // Optional chaining to call reset if defined
  }, 0);
};

const removePerson = ({ reset }, id) => {
  if (id === store.user.id) {
    if (store.currentSheet) {
      $q.notify({
        message:
          "You cannot remove yourself from the sheet! Remove the sheet instead.",
        color: "negative",
      });
    } else {
      $q.notify({
        message: "You cannot remove yourself from the sheet!",
        color: "negative",
      });
    }

    finalize(reset);
    return;
  }
  if (store.isPersonFullyRemovable(id)) {
    delete people.value[id];
    $q.notify({
      message: "Person removed.",
    });
  } else {
    people.value[id].active = false;
    $q.notify({
      message: "Person marked as inactive.",
    });
    if (props.seeInactive) {
      finalize(reset);
    }
  }
};

const activatePerson = ({ reset }, id) => {
  people.value[id].active = true;
  finalize(reset);
};

watch(
  editPersonName,
  (newValue) => {
    if (newValue) {
      if (editPersonId.value === null) {
        const newPerson = Person.make(null, newValue);
        people.value[newPerson.id] = newPerson;
      } else if (editPersonId.value === store.user.id) {
        store.setUsername(newValue);
        people.value[editPersonId.value].name = newValue;
      } else if (store.isUserOrFriend(editPersonId.value)) {
        store.setFriendName(newValue, editPersonId.value);
        people.value[editPersonId.value].name = newValue;
      } else {
        people.value[editPersonId.value].name = newValue;
      }
    }
  },
  { immediate: true }
);
</script>
