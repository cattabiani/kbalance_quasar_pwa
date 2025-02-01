<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-mb-md" style="width: 80%">
      <q-card-section class="text-center" style="font-size: 28px">
        Settings
      </q-card-section>

      <q-card-section v-if="!Config.isCompatible(store.config)">
        Welcome to kBalance! First, you need to set up your Firebase account. You can either <strong>import</strong> a friend's settings (and rely on their Firebase account) or create your own. For more info on this second method, check the 
        <a href="https://github.com/cattabiani/kbalance_quasar_pwa/blob/main/README.md" target="_blank" class="text-primary">kBalance README</a>.
      </q-card-section>

      <q-card-actions>
        <q-btn
          v-if="Config.isCompatible(store.config)"
          icon="qr_code"
          color="secondary"
          label="Share"
          class="full-width q-mb-md"
          @click="startSharing"
        />
        <q-btn
          icon="qr_code_scanner"
          label="Import"
          color="secondary"
          class="full-width q-mb-md"
          @click="isReceiving = true"
        />
        <q-btn
          v-if="Config.isCompatible(store.config)"
          icon="send"
          label="Go to Log In"
          color="primary"
          class="full-width"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-page>

  <share-string v-model="shareString" />

  <receive-string v-model="receiveString" v-model:isVisible="isReceiving" />
</template>

<script setup>
defineOptions({
  name: "SettingsPage",
});

import { useRouter } from "vue-router";

import { useStore } from "src/stores/store";
import { ref, watch, onBeforeUnmount } from "vue";

import ShareString from "src/components/ShareString.vue";
import ReceiveString from "src/components/ReceiveString.vue";
import Config from "src/models/config";
import { useQuasar } from "quasar";
const $q = useQuasar();

const store = useStore();

const router = useRouter();
const shareString = ref("");
const receiveString = ref("");
const isReceiving = ref(false);

const startSharing = () => {
  if (Config.isCompatible(store.config)) {
    shareString.value = JSON.stringify(store.config);
  } else {
    $q.notify({
      message: "The current config is corrupted or empty!",
      color: "negative",
    });
  }
};

watch(
  receiveString,
  (newValue) => {
    if (newValue) {
      try {
        store.setConfig(JSON.parse(newValue));

        $q.notify({ message: "Config set successfully!" });
      } catch (error) {
        $q.notify({
          message: error.message || error,
          color: "negative",
        });
      }
    }
  },
  { immediate: true }
);

const submit = async () => {
  try {
    await store.init();
    router.push({ name: "IndexPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
  }
};

const installPromptHandler = (event) => {
  event.preventDefault(); // Prevent the default prompt from appearing

  notification = $q.notify({
    actions: [
      {
        label: "Install",
        color: "white",
        handler: () => {
          if (event) {
            event.prompt(); // Show the install prompt
            notification.close(); // Dismiss the notification
          }
        },
      },
      {
        label: "Dismiss",
        color: "white",
        handler: () => {
          notification.close(); // Dismiss the notification
        },
      },
    ],
    timeout: 0, // Prevent it from auto-closing
  });
};

window.addEventListener("beforeinstallprompt", installPromptHandler);

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", installPromptHandler);
});
</script>
