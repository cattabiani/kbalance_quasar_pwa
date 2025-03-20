<template>
  <q-btn-dropdown
    v-if="filteredPeople.length"
    :color="props.fixedLabel ? 'primary' : void 0"
    :icon="
      Boolean(props.fixedLabel)
        ? props.fixedLabel === 'Upgrade'
          ? 'arrow_circle_up'
          : 'person'
        : void 0
    "
    ref="addUserRef"
  >
    <template #label>
      <span v-if="fixedLabel">{{ props.fixedLabel }}</span>
      <person-item
        v-else
        :id="props.modelValue"
        :people="props.people"
        :max-length="13"
      />
    </template>

    <q-list>
      <q-item
        v-for="(id, index) in filteredPeople"
        :key="id"
        @click="handleClick(id)"
        clickable
        :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
      >
        <q-item-section>
          <person-item :id="id" :people="props.people" :max-length="13" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import Person from 'src/models/person';
import PersonItem from 'src/components/PersonItem.vue';
import { computed, ref } from 'vue';

const addUserRef = ref(null);

const props = defineProps({
  people: {
    type: Object,
    required: true,
  },
  sortedPeople: {
    type: Array,
    default: null,
  },
  ignoredPeople: {
    type: Object,
    default: null,
  },
  fixedLabel: {
    type: String,
    default: null,
  },
  modelValue: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['itemClick', 'update:modelValue']);

const handleClick = (id) => {
  emit('update:modelValue', id);
  emit('itemClick', id);
  addUserRef.value.hide();
};

const filteredPeople = computed(() => {
  let peopleList = Object.values(props.people).filter(
    (value) => !(value.id in (props?.ignoredPeople ?? {})),
  ); // Exclude ignored people

  if (props.sortedPeople) {
    // Sort based on sortedPeople order
    const orderMap = new Map(
      props.sortedPeople.map((id, index) => [id, index]),
    );
    peopleList.sort(
      (a, b) =>
        (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity),
    );
  } else {
    // Default sorting
    peopleList.sort((a, b) => Person.compare(a, b));
  }

  return peopleList.map((value) => value.id); // Extract only the IDs
});
</script>
