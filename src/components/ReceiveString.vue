<template>
  <q-dialog v-model="isVisible" persistent @show="focusInput">
    <q-card>
      <q-card-section v-if="isScanning && !hideScan">
        <qrcode-stream
          @detect="onScanDetect"
          @init="onScanInit"
          class="scanner"
        />
      </q-card-section>
      <q-card-section align="center" v-if="!hideScan">
        <q-btn
          :icon="isScanning ? 'close' : 'qr_code'"
          :label="isScanning ? 'Stop' : 'Scan'"
          :color="isScanning ? 'red' : 'primary'"
          class="q-mt-md"
          @click="isScanning = !isScanning"
        />
      </q-card-section>
      <q-card-section>
        <q-input outlined v-model="modelRef" ref="inputRef" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          icon="close"
          label="Cancel"
          color="red"
          class="q-mt-md"
          @click="closeDialog"
        />
        <q-btn
          icon="done"
          label="Accept"
          color="primary"
          class="q-mt-md"
          @click="saveAndCloseDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QrcodeStream } from 'vue-qrcode-reader';
import { ref, computed, nextTick, hydrateOnIdle } from 'vue';

// Props for the value to encode in the QR code
const props = defineProps({
  modelValue: [String], // The value to encode
  isVisible: [Boolean],
  hideScan: {
    // New prop to hide scan functionality
    type: Boolean,
    default: false,
  },
});

const modelRef = ref(null);
const isScanning = ref(false);
const inputRef = ref(null);

// Emit event to notify parent of changes
const emit = defineEmits(['update:modelValue', 'update:isVisible']);

const isVisible = computed({
  get: () => props.isVisible,
  set: (value) => {
    emit('update:isVisible', value);
  },
});

const saveAndCloseDialog = () => {
  emit('update:modelValue', modelRef.value);
  closeDialog();
};

const closeDialog = () => {
  modelRef.value = null;
  isVisible.value = false;
};

const focusInput = () => {
  modelRef.value = props.modelValue;
  nextTick(() => {
    inputRef.value?.select();
    inputRef.value?.focus();
  });
};

// Handle QR code detection
const onScanDetect = (detectionData) => {
  if (detectionData && detectionData.length > 0) {
    const detectedQR = detectionData[0];
    if (detectedQR.rawValue) {
      modelRef.value = detectedQR.rawValue;
      isScanning.value = false;
    }
  }
};

// Handle scan initialization errors
const onScanInit = (promise) => {
  promise.catch((error) => {
    modelRef.value = '';
    isScanning.value = false;
    $q.notify({
      message: error.message || error,
    });
  });
};
</script>
