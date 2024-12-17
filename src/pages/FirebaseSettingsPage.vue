<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 98%">
      <q-card-section class="text-center" style="font-size: 28px">
        Firebase Settings
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section>
          <q-input
            v-model="config.apiKey"
            label="Api Key"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="config.authDomain"
            label="Auth Domain"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="config.projectId"
            label="Project Id"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="config.storageBucket"
            label="Storage Bucket"
            required
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="config.messagingSenderId"
            label="Message Sender Id"
            required
            outlined
            class="q-mb-md"
          />
          <q-input v-model="config.appId" label="App Id" required outlined />
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

      <!-- <q-card-actions>
        <q-btn
          v-if="Utils.isDev()"
          label="Use .env Configuration (dev)"
          color="red"
          class="full-width q-mt-md"
          @click="setDotenvConfig"
        />
      </q-card-actions> -->
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";
import { ref } from "vue";
import Utils from "src/utils/utils";

const store = useStore();
const $q = useQuasar();
const router = useRouter();
const config = ref({
  apiKey: store.fbConfig?.apiKey,
  authDomain: store.fbConfig?.authDomain,
  projectId: store.fbConfig?.projectId,
  storageBucket: store.fbConfig?.storageBucket,
  messagingSenderId: store.fbConfig?.messagingSenderId,
  appId: store.fbConfig?.appId,
});

const submit = async () => {
  try {
    store.initFb(config.value);
    router.push({ name: "LoginPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
  }
};
</script>
