<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card class="q-my-md" style="width: 100%; height: auto">
      <q-card-section class="text-center" style="font-size: 28px">
        Share
      </q-card-section>
      <q-card-section>
        <img
          v-if="qrCodeUrl"
          :src="qrCodeUrl"
          alt="QR Code"
          style="width: 100%; height: auto"
        />
      </q-card-section>
      <q-card-section class="flex flex-center">
        {{ modelRef }}
      </q-card-section>

      <q-card-actions
        style="display: flex; justify-content: center; align-items: center"
      >
        <q-btn
          color="primary"
          icon="content_copy"
          @click="copyToClipboard(modelRef)"
          label="Copy"
        />
        <q-btn
          icon="close"
          label="Close"
          color="red"
          @click="modelRef = null"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import QRCode from "qrcode";
import { useQuasar } from "quasar";
const $q = useQuasar();

// Props for the value to encode in the QR code
const props = defineProps({
  modelValue: String, // The value to encode
});

// Emit event to notify parent of changes
const emit = defineEmits(["update:modelValue"]);

// Reactive property for the QR code URL
const qrCodeUrl = ref(null);

// Computed property for visibility
const modelRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// Computed property for visibility
const isVisible = computed(() => !!modelRef.value);

// Watch for changes in modelValue to generate the QR code
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      try {
        qrCodeUrl.value = await QRCode.toDataURL(newValue);
      } catch (error) {
        $q.notify({
          message: error.message || error,
        });
        qrCodeUrl.value = null;
      }
    } else {
      qrCodeUrl.value = null;
    }
  },
  { immediate: true }
);

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      $q.notify("Copied to clipboard!");
    })
    .catch(() => {
      $q.notify("Failed to copy!");
    });
};
</script>
