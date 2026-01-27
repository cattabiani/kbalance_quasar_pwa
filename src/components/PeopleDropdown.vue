<template>
  <q-btn-dropdown
    v-if="filteredOptions.length"
    ref="addUserRef"
    :color="props.fixedLabel ? 'primary' : void 0"
    :icon="
      props.fixedLabel
        ? props.fixedLabel === 'Upgrade'
          ? 'arrow_circle_up'
          : 'person'
        : void 0
    "
  >
    <!-- Button label -->
    <template #label>
      <span
        v-if="props.fixedLabel"
        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
      >
        {{ props.fixedLabel }}
      </span>

      <person-item
        v-else-if="isPerson(props.modelValue)"
        :id="props.modelValue"
        :people="props.people"
        :max-length="13"
        style="
          flex: 1 1 auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
      />

      <span v-else>
        {{ allLabel }}
      </span>
    </template>

    <!-- Dropdown list -->
    <q-list>
      <q-item
        v-for="(opt, index) in filteredOptions"
        :key="opt.id"
        clickable
        @click="handleClick(opt.id)"
        :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
      >
        <q-item-section>
          <person-item
            v-if="opt.isPerson"
            :id="opt.id"
            :people="props.people"
            :max-length="13"
          />
          <span v-else>{{ opt.label }}</span>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import { computed, ref } from 'vue';
import Person from 'src/models/person';
import PersonItem from 'src/components/PersonItem.vue';

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

  /* "All" support */
  allLabel: {
    type: String,
    default: null, // e.g. "All"
  },
  allValue: {
    type: String,
    default: '__ALL__',
  },
});

const emit = defineEmits(['update:modelValue', 'itemClick']);

const isPerson = (id) =>
  id != null && id !== props.allValue && id in props.people;

const handleClick = (id) => {
  emit('update:modelValue', id);
  emit('itemClick', id);
  addUserRef.value?.hide();
};

const filteredOptions = computed(() => {
  const options = [];

  // Optional "All"
  if (props.allLabel) {
    options.push({
      id: props.allValue,
      label: props.allLabel,
      isPerson: false,
    });
  }

  let peopleList = Object.values(props.people).filter(
    (p) => !(p.id in (props?.ignoredPeople ?? {})),
  );

  if (props.sortedPeople) {
    const orderMap = new Map(
      props.sortedPeople.map((id, index) => [id, index]),
    );
    peopleList.sort(
      (a, b) =>
        (orderMap.get(a.id) ?? Infinity) - (orderMap.get(b.id) ?? Infinity),
    );
  } else {
    peopleList.sort((a, b) => Person.compare(a, b));
  }

  options.push(
    ...peopleList.map((p) => ({
      id: p.id,
      isPerson: true,
    })),
  );

  return options;
});

const allLabel = computed(() => props.allLabel ?? '');
</script>
