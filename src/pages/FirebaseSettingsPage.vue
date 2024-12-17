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

  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";
// import { db, auth } from "src/firebase/firebase";

const store = useStore();
const $q = useQuasar();
const router = useRouter();

// const debug = async () => {


//   console.log(store.isFbActive);
//   // await store.initFb();
//   // await store.useFb();
// };

const handleSubmit = async () => {
  try {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    store.init(config);
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
  }
};
</script>
