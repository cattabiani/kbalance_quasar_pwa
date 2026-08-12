<template>
  <div class="row items-center no-wrap" style="min-width: 0">
    <q-icon
      :name="isActive(props.id) ? 'person' : 'person_off'"
      :color="store.isUserOrFriend(props.id) ? 'primary' : 'grey'"
      :aria-label="store.isUserOrFriend(props.id) ? 'Real user' : 'Fake user'"
      class="col-auto q-ml-sm q-mr-sm"
    />
    <div class="col column items-start" style="min-width: 0">
      <q-item-label class="ellipsis full-width">{{
        store.getName(props.id, props?.people)
      }}</q-item-label>
      <q-item-label
        v-if="store.isCaption(props.id, props?.people)"
        caption
        class="ellipsis full-width"
        >{{ store.getEmail(props.id, props?.people) }}</q-item-label
      >
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'src/stores/store';
const store = useStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  people: {
    type: Object,
    default: null,
  },
  maxLength: {
    type: Number,
    default: null,
  },
});

const isActive = (id) => {
  if (props.people?.[id]?.active === false) {
    return false;
  }

  return true;
};
</script>
