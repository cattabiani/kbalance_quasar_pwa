<template>
  <q-dialog v-model="isVisible" persistent>
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
          icon="close"
          label="Close"
          color="red"
          class="q-mt-md"
          @click="modelRef = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QrcodeStream } from "vue-qrcode-reader";
import { ref, watch, computed } from "vue";

// Props for the value to encode in the QR code
const props = defineProps({
  modelValue: [String, Boolean, Object], // The value to encode
});

// Emit event to notify parent of changes
const emit = defineEmits(["update:modelValue"]);

// Computed property for visibility
const modelRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const isVisible = computed(
  () => typeof modelRef.value === "boolean" && modelRef.value === true
);

const onScanDetect = (detectionData) => {
  if (detectionData && detectionData.length > 0) {
    const detectedQR = detectionData[0];
    if (detectedQR.rawValue) {
      modelRef.value = detectedQR.rawValue;
    }
  }
};

const onScanInit = (promise) => {
  promise.catch((error) => {
    modelRef.value = true;
    $q.notify({
      message: error.message || error,
    });
  });
};
</script>
