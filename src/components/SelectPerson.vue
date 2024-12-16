<template>
  <q-select
    bordered
    class="q-my-md q-mr-md q-ml-md"
    v-model="localValue"
    :options="peopleOptions"
    label="Selected Person"
    outlined
    option-value="value"
    emit-value
    option-slot
    map-options
    :style="{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }"
  >
    <template #prepend>
      <q-icon
        name="person"
        :color="peopleOptions[localValue]?.isUser ? 'primary' : 'grey'"
        :aria-label="
          peopleOptions[localValue]?.isUser ? 'Real user' : 'Fake user'
        "
      />
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon
            name="person"
            :color="scope.opt.isUser ? 'primary' : 'grey'"
            :aria-label="scope.opt.isUser ? 'Real user' : 'Fake user'"
          />
        </q-item-section>
        <q-item-section> {{ scope.opt.label }} </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { useStore } from "src/stores/store";
const store = useStore();

// Define props to receive external variables
const props = defineProps({
  modelValue: {
    type: [Number, null], // Adjust the type to allow null
    default: null,
  },
  peopleOptions: {
    type: Array,
    required: true, // Ensure peopleOptions is passed as a prop
  },
});

// Define emits to send updated values to the parent
const emit = defineEmits(["update:modelValue"]);

// Create a local variable to bind to v-model
const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
