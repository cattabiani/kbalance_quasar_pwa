<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="width: 90%">
      <q-card-section>
        <div>
          <h5>About kBalance</h5>
          <p>
            A simple balance-tracking app to manage your finances with other
            users.
          </p>
          <h6>Usage Tips:</h6>
          <ul>
            <li>
              <strong>Add</strong> a sheet: press
              <q-icon name="add" size="md" class="q-mr-sm" />
            </li>
            <li><strong>Delete</strong> a sheet: swipe right</li>
          </ul>
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
      </q-card-section>
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
/* Optional styles */
</style>
