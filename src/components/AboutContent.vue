<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="width: 90%">
      <q-card-section class="column flex justify-center items-center q-pa-md">
        <!-- App Logo -->
        <q-img
          src="icons/icon-192x192.png"
          alt="KBalance Logo"
          style="max-width: 150px; height: auto"
          class="q-mb-md"
        />

        <!-- App Title -->
        <div class="text-h4 text-weight-bold text-primary q-mb-sm text-center">
          KBalance
        </div>

        <!-- App Description -->
        <div class="text-subtitle1 text-center q-mb-lg">
          The best way to manage shared expenses!
        </div>

        <!-- License Link -->
        <p>
          <strong>License:</strong>
          <a
            href="https://github.com/cattabiani/kbalance_quasar_pwa/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
          >
            MIT
          </a>
        </p>

        <!-- Repository Link -->
        <p>
          <strong>Repository:</strong>
          <a
            href="https://github.com/cattabiani/kbalance_quasar_pwa"
            target="_blank"
            rel="noopener"
          >
            View on GitHub
          </a>
        </p>

        <!-- Star Link -->
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

        <!-- Author Information -->
        <p><strong>Author:</strong> Alessandro Cattabiani</p>
      </q-card-section>

      <!-- Close Button -->
      <q-card-actions align="center">
        <q-btn icon="close" color="red" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

// Props for the dialog state
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

// Emit event to notify parent of changes
const emit = defineEmits(['update:modelValue']);

// Computed property to handle two-way binding
const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

// Function to close the dialog
function closeDialog() {
  modelValue.value = false;
}

// Quasar instance for notifications
const $q = useQuasar();

// Check internet connection
function checkConnection() {
  if (!navigator.onLine) {
    $q.notify({
      message: 'No internet connection. Some features may not work.',
      color: 'negative',
      icon: 'wifi_off',
    });
  }
}

// Perform the check when the component is mounted
onMounted(() => {
  checkConnection();
});
</script>

<style scoped>
/* Centering the content inside q-card-section */
.q-card-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.q-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

a {
  color: #1976d2; /* Link color */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
