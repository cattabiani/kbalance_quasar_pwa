<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 80%">
      <q-card-section class="text-center" style="font-size: 28px">
        {{ isRegistering ? "Register" : "Login" }}
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section>
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="emailRules"
            required
            outlined
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="passwordRules"
            required
            outlined
          />
          <q-input
            v-if="isRegistering"
            v-model="confirmPassword"
            label="Confirm Password"
            :rules="[(val) => val === password || 'Passwords do not match']"
            type="password"
            requireds
            outlined
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            icon="send"
            :label="isRegistering ? 'Register' : 'Login'"
            color="primary"
            type="submit"
            class="full-width"
          />
        </q-card-actions>
      </q-form>

      <q-card-actions class="justify-center">
        <q-btn
          :label="isRegistering ? 'Go to Login' : 'Go to Register'"
          color="secondary"
          @click="isRegistering = !isRegistering"
          class="full-width q-mt-md"
          icon="account_circle"
        />
        <q-btn
          label="Settings"
          color="secondary"
          @click="goToSettings"
          class="full-width q-mt-md"
          icon="settings"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "LoginPage",
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";

const store = useStore();
const $q = useQuasar();
const router = useRouter();

// Reactive states for form fields and register/login toggle
const isRegistering = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Validation rules
const emailRules = [
  (val) => !!val || "Please enter an email",
  (val) => /.+@.+\..+/.test(val) || "Please enter a valid email",
];

const passwordRules = [
  (val) => !!val || "Please enter a password",
  (val) => val.length >= 6 || "Password should be at least 6 characters",
];

// Handle form submit (login or register)
const submit = async () => {
  try {
    if (isRegistering.value) {
      await store.register(email.value, password.value);
    } else {
      await store.login(email.value, password.value);
    }

    await store.init();
    router.push({ name: "IndexPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });

    if (error.code !== "auth/invalid-credential") {
      await goToSettings();
    }
  }
};

const goToSettings = async () => {
  try {
    await store.clearFirebase();

    router.push({ name: "SettingsPage" });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: "negative",
    });
  }
};
</script>
