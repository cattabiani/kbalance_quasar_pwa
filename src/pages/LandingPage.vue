<template>
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-space />
        <q-btn flat icon="file_download" label="Install" @click="installApp" class="q-ml-md bg-secondary text-white" />
      </q-toolbar>
    </q-header>
  
    <q-page class="flex flex-center column q-pa-md">
      <!-- App Logo -->
      <q-img src="icons/icon-192x192.png" 
             alt="KBalance Logo" 
             style="max-width: 150px; height: auto;" 
             class="q-mb-md" />
  
      <!-- App Title -->
      <div class="text-h4 text-weight-bold text-primary q-mb-sm">KBalance</div>
      <div class="text-subtitle1 text-center q-mb-lg">The best way to manage shared expenses!</div>
  

  
      <!-- Install Button -->
      <q-btn label="Install Now" icon="file_download" color="secondary" size="lg" @click="installApp" class="q-mb-md" />
  
      <!-- Secondary Option -->
      <q-btn label="Use without Installing" flat color="grey" @click="goToSettings" />
    </q-page>
  </template>
    
  <script setup>
  defineOptions({
    name: 'LandingPage',
  });
  
  import Utils from 'src/utils/utils';
  import QRCode from 'qrcode';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const $q = useQuasar();
  const router = useRouter();
  const deferredPrompt = ref(null);
  const slide = ref(1); // Controls carousel slides
  
  const installPromptHandler = (event) => {
    event.preventDefault();
    deferredPrompt.value = event;
  };
  
  onMounted(() => {
    window.addEventListener('beforeinstallprompt', installPromptHandler);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', installPromptHandler);
  });
  
  const installApp = () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      $q.notify({ message: "Installation complete!" });
    } else if (Utils.isIos()) {
      $q.notify({
        message: "On iOS, use 'Share' → 'Add to Home Screen' to install.",
        color: "warning",
      });
    } else {
      $q.notify({
        message: "No install prompt available!",
        color: "negative",
      });
    }
  };
  
  const goToSettings = () => {
    router.replace({ name: 'SettingsPage' });
  };
  </script>
  