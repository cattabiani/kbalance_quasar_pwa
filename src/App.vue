<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useStore } from "src/stores/store"; // Import your Pinia store

// Access the store
const store = useStore();

// Handle initialization in onMounted lifecycle hook
onMounted(async () => {
  await store.init(); // Call the init method in the store to initialize anything
});

// Handle cleanup in onBeforeUnmount lifecycle hook
onBeforeUnmount(async () => {
  await store.cleanup(); // Call the cleanup method in the store to clean up when the app is destroyed
});
</script>
