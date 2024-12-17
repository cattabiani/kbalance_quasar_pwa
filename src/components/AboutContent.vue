<template>
  <div>
    <h5>About kBalance</h5>
    <p>
      A simple balance-tracking app to manage your finances with other users.
    </p>
    <h6>Usage Tips:</h6>
    <ul>
      <li>
        <strong>Add</strong> a sheet: press
        <q-icon name="add" size="md" class="q-mr-sm" />.
      </li>
      <li><strong>Delete</strong> a sheet: swipe right</li>
    </ul>
    <p>
      <strong>License:</strong>
      <a
        href="https://github.com/cattabiani/kbalance_quasar_pwa/blob/main/LICENSE"
        target="_blank"
        rel="noopener"
        >MIT</a
      >
    </p>
    <p>
      <strong>Repository:</strong>
      <a
        href="https://github.com/cattabiani/kbalance_quasar_pwa"
        target="_blank"
        rel="noopener"
        >View on GitHub</a
      >
    </p>
    <p>
      <strong>Star:</strong>
      <a
        href="https://github.com/cattabiani/kbalance_quasar_pwa/stargazers"
        target="_blank"
        rel="noopener"
      >
        Give a Star on GitHub!
      </a>
    </p>
    <p><strong>Author:</strong> Alessandro Cattabiani</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

function checkConnection() {
  if (!navigator.onLine) {
    $q.notify({
      message: "No internet connection. Some features may not work.",
      color: "negative",
      icon: "wifi_off",
    });
  }
}

onMounted(() => {
  checkConnection();
});
</script>

<style>
/* Optional styles */
</style>
