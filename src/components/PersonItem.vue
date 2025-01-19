<template>
  <div class="q-gutter-md" style="display: flex; align-items: center">
    <q-icon
      :name="isActive(props.id) ? 'person' : 'person_off'"
      :color="store.isUserOrFriend(props.id) ? 'primary' : 'grey'"
      :aria-label="store.isUserOrFriend(props.id) ? 'Real user' : 'Fake user'"
    />
    <div style="display: flex; flex-direction: column; align-items: flex-start">
      <q-item-label>{{
        Utils.truncate(store.getName(props.id, props?.people), props.maxLength)
      }}</q-item-label>
      <q-item-label v-if="store.isCaption(props.id, props?.people)" caption>{{
        Utils.truncate(store.getEmail(props.id, props?.people), props.maxLength)
      }}</q-item-label>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "src/stores/store";
import Utils from "src/utils/utils";
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
  // if (store.currentSheet?.people?.[id]?.active === false) {
  //   return false;
  // }

  return true;
};
</script>
