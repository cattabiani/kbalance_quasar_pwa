<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%">
      <q-card-actions>
        <q-btn
          label="Firebase Settings"
          color="secondary"
          class="full-width q-mt-md"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
    {{ !!store.fbApp }}
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { initFirebase } from "src/firebase/firebase";

// const store = useStore();
const $q = useQuasar();
const router = useRouter();

// Handle form submit (login or register)
const handleSubmit = async () => {
  try {
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
  }
};
</script>
