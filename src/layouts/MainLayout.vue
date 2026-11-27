<template>
  <q-layout view="lHr lpr lFr">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Version gate (#42): this build is too old for the data. -->
    <q-dialog :model-value="store.isOutdated" persistent>
      <q-card style="max-width: 400px">
        <q-card-section class="text-h6">Update needed</q-card-section>
        <q-card-section>
          Your data was updated to a newer format than this version of kBalance
          understands. Reload to get the new version; your data is safe. If this
          keeps appearing, make sure you are online and reopen the app.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Reload"
            :loading="reloading"
            @click="reloadToUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'src/stores/store';

const store = useStore();
const reloading = ref(false);

// Fetches the new service worker (it activates right away: skipWaiting)
// and reloads, so the new build is served.
async function reloadToUpdate() {
  reloading.value = true;
  try {
    // Listen before update(): the new worker may take over during it.
    const controllerChanged = new Promise((resolve) => {
      navigator.serviceWorker?.addEventListener('controllerchange', resolve, {
        once: true,
      });
      setTimeout(resolve, 10000); // don't hang: reload anyway
    });
    const registration = await navigator.serviceWorker?.getRegistration();
    await registration?.update();
    if (registration?.installing || registration?.waiting) {
      await controllerChanged;
    }
  } catch (e) {
    console.error('Service worker update failed', e);
  }
  window.location.reload();
}
</script>
