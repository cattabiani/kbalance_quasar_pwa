<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md q-mb-md" style="width: 98%">
      <q-card-section class="text-center" style="font-size: 28px">
        Firebase Settings
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section>
          <q-input
            v-model="store.fbConfig.apiKey"
            label="Api Key"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="store.fbConfig.authDomain"
            label="Auth Domain"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="store.fbConfig.projectId"
            label="Project Id"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="store.fbConfig.storageBucket"
            label="Storage Bucket"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="store.fbConfig.messagingSenderId"
            label="Message Sender Id"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="store.fbConfig.appId"
            label="App Id"
            required
            outlined
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            icon="send"
            label="Submit"
            color="primary"
            type="submit"
            class="full-width"
          />
        </q-card-actions>
      </q-form>
    </q-card>
    <q-card class="q-pa-md" style="width: 98%">
      <q-card-actions>
        <q-btn
          icon="qr_code"
          color="secondary"
          label="Share via QR Code / String"
          class="full-width q-mb-md"
          @click="qrCodeUrl = JSON.stringify(store.fbConfig)"
        />
        <q-btn
          icon="qr_code_scanner"
          label="Import via QR code"
          color="secondary"
          class="full-width q-mb-md"
          @click="qrCodeContent = true"
        />
        <q-btn
          icon="text_fields"
          label="Import via String"
          color="secondary"
          class="full-width q-mb-md"
          @click="importViaString"
        />
        <q-input
          ref="stringRef"
          class="full-width q-mb-md"
          outlined
          label="String Import"
          v-model="stringImport"
          @focus="stringRef.select()"
        />
      </q-card-actions>
    </q-card>
  </q-page>

  <ShareQRCodeDialog v-model="qrCodeUrl" />

  <ReadQRCodeDialog v-model="qrCodeContent" />
</template>

<script setup>
import { useRouter } from "vue-router";

import { useStore } from "src/stores/store";
import { ref, watch } from "vue";

import ShareQRCodeDialog from "src/components/ShareQRCodeDialog.vue";
import ReadQRCodeDialog from "src/components/ReadQRCodeDialog.vue";
import { useQuasar } from "quasar";
const $q = useQuasar();

const store = useStore();

const router = useRouter();
const stringImport = ref(null);
const stringRef = ref(null);
const qrCodeUrl = ref("");
const qrCodeContent = ref("");

const importViaString = () => {
  if (!stringImport.value) {
    $q.notify("String import is empty!");
    return;
  }

  try {
    store.setNewConfig(JSON.parse(stringImport.value));
    stringImport.value = null;
    $q.notify("String import successful!");
  } catch (error) {
    $q.notify(error.message || error);
  }
};

watch(
  qrCodeContent,
  (newValue) => {
    if (typeof newValue === "string" && newValue.trim()) {
      try {
        store.setFbConfig(JSON.parse(newValue));
      } catch (error) {
        $q.notify({
          message: error.message || error,
        });
        qrCodeContent.value = null;
      }
    }
  },
  { immediate: true }
);

const submit = async () => {
  try {
    store.initFb();
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
  }
};
</script>
