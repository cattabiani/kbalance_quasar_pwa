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

      <q-card-actions>
        <q-btn
          v-if="isDev"
          label="Use .env Configuration (dev)"
          color="red"
          class="full-width q-mt-md"
          @click="setDotenvConfig"
        />
        <q-btn
          v-if="isDev"
          label="Test"
          color="red"
          class="full-width q-mt-md"
          @click="test"
        />
      </q-card-actions>
    </q-card>
    aa {{ store.fbLedger?.test || "no ledger" }} {{ ccuid }}
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";
import { ref } from "vue";

const store = useStore();
const $q = useQuasar();
const router = useRouter();
let ccuid = null;
const config = ref({
  apiKey: store.fbConfig?.apiKey,
  authDomain: store.fbConfig?.authDomain,
  projectId: store.fbConfig?.projectId,
  storageBucket: store.fbConfig?.storageBucket,
  messagingSenderId: store.fbConfig?.messagingSenderId,
  appId: store.fbConfig?.appId,
});

const isDev = ref(
  !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    !!import.meta.env.VITE_FIREBASE_APP_ID
);

const setDotenvConfig = () => {
  config.value.apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  config.value.authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  config.value.projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  config.value.storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  config.value.messagingSenderId =
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  config.value.appId = import.meta.env.VITE_FIREBASE_APP_ID;
};

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

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteField,
  increment,
} from "firebase/firestore";
import { initializeApp, deleteApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  writeBatch,
} from "firebase/firestore";

const fbApp = ref(null);
const fbAuth = ref(null);
const fbDb = null;
const fbLedger = ref(null);
let unsubscribeToFbLedger = null;

const test = async () => {
  if (true) {
    await store.initFb(config);
    await store.login("a@gmail.com", "123456");
    const ledgerRef = store.getLedgerRef();
    setDoc(ledgerRef, { test: increment(1) }, { merge: true });
    console.log(store.getCurrentUserId());
    ccuid = store.getCurrentUserId();

    return;
  }

  // store.init(config.value);

  unsubscribeToFbLedger?.();
  unsubscribeToFbLedger = null;
  fbLedger.value = null;

  fbDb = null;
  if (fbAuth.value) {
    await fbAuth.value.signOut();
    fbAuth.value = null;
  }
  if (fbApp.value) {
    console.log("remove old", getApps().length);
    await deleteApp(fbApp.value);
    fbApp.value = null;
  }

  console.log("init", getApps().length);
  fbApp.value = initializeApp(config.value);
  fbAuth.value = getAuth(fbApp.value);
  // fbDb = initializeFirestore(fbApp.value, {});
  fbDb = initializeFirestore(fbApp.value, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  // await store.initFb(config.value);
  // await  store.useFb();
  console.log("n apps", getApps().length);
  console.log(!!fbApp.value, !!fbAuth.value, !!fbDb);

  console.log("login");
  await signInWithEmailAndPassword(fbAuth.value, "a@gmail.com", "123456");
  const ledgerRef = doc(fbDb, "ledger", "ledger");

  console.log("onSnapshot");
  await new Promise((resolve) => {
    unsubscribeToFbLedger = onSnapshot(ledgerRef, (doc) => {
      console.log("onSnapshot triggered");
      const triggerResolve = fbLedger.value === null;
      fbLedger.value = doc.data();

      if (triggerResolve) {
        resolve();
      }
    });
  });
  console.log("/onSnapshot");
  setDoc(ledgerRef, { test: increment(1) }, { merge: true });

  console.log("/login");
};
</script>
