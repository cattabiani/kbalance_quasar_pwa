<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 98%">
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
            label="Submit"
            color="primary"
            type="submit"
            class="full-width"
          />
        </q-card-actions>
      </q-form>
      <q-card-actions>
        <q-btn
          label="Import/Export via String"
          color="secondary"
          class="full-width q-mb-md"
          @click="isImportByStringVisible = !isImportByStringVisible"
        />
        <q-btn
        v-if="!isScanning"
          label="Import via QR code"
          color="secondary"
          class="full-width"
          @click="isScanning=true"
        />
      </q-card-actions>
    </q-card>
    <q-card
      v-if="qrCodeUrl"
      class="q-my-md"
      :style="{ width: '100%', height: 'auto' }"
    >
      <q-card-section class="text-center" style="font-size: 28px">
        Share with the QR Code
      </q-card-section>
      <q-card-section>
        <img
          :src="qrCodeUrl"
          alt="QR Code"
          :style="{ width: '100%', height: 'auto' }"
        />
      </q-card-section>
    </q-card>
  </q-page>

  <q-dialog
    v-model="isImportByStringVisible"
    persistent
    @before-show="onStringDialogOpen"
  >
    <q-card>
      <q-card-section>
        <q-input
          ref="inputRef"
          v-model="stringDialog"
          type="textarea"
          label="Config by String"
          :autoresize="true"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn icon="close" color="red" @click="closeStringDialog" />
        <q-btn icon="check" color="primary" @click="setAndCloseStringDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="isScanning"
    persistent
  >
    <q-card>
      <q-card-section>
        <qrcode-stream
        @detect="onScanDetect"
        @init="onScanInit"
        class="scanner"
      />

      </q-card-section>
      <q-card-actions align="center">
        <q-btn
        label="Stop Scanning"
        class="q-mt-md"
        @click="isScanning = false"
      />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";
import { ref, nextTick, watch } from "vue";
import FbConfig from "src/models/fbConfig";
import QRCode from "qrcode";
import { QrcodeStream } from 'vue-qrcode-reader';

const store = useStore();
const $q = useQuasar();
const router = useRouter();
const isImportByStringVisible = ref(false);
const inputRef = ref(null);
const stringDialog = ref("");
const isScanning = ref(false);
const qrCodeUrl = ref("");



const onScanDetect = (detectionData) => {
  if (detectionData && detectionData.length > 0) {
    const detectedQR = detectionData[0]; 
    if (detectedQR.rawValue) {
      store.setNewConfig(JSON.parse(detectedQR.rawValue));
      isScanning.value = false;
    } 
  }
}

const onScanInit = (promise) => {
  promise.catch((error) => {
    isScanning.value = false;
    $q.notify({
          message: error.message || error,
        });
  });
}


// Compute the options based on the store
const generateQRCode = () => {
  if (!FbConfig.isEmpty(store.fbConfig)) {
    const newCode = JSON.stringify(store.fbConfig);

    QRCode.toDataURL(newCode, (error, url) => {
      if (error) {
        $q.notify({
          message: error.message || error,
        });
        console.log("error", error);
      } else {
        qrCodeUrl.value = url; // Update the reactive qrCodeUrl reference
      }
    });
  }
};

watch(
  () => store.fbConfig,
  () => {
    generateQRCode(); // Call generateQRCode when store.fbConfig changes
  },
  { immediate: true } // Optionally, run it immediately on mount if fbConfig is not empty
);

const onStringDialogOpen = () => {
  if (!FbConfig.isEmpty(store.fbConfig)) {
    stringDialog.value = JSON.stringify(store.fbConfig);
  }

  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};



const setAndCloseStringDialog = () => {
  store.setNewConfig(JSON.parse(stringDialog.value));

  closeStringDialog();
};

const closeStringDialog = () => {
  isImportByStringVisible.value = false;
};

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
