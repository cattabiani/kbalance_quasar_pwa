<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-space />
      <q-btn
        flat
        icon="file_download"
        label="Install"
        @click="installApp"
        class="q-ml-md bg-secondary text-white"
      />
    </q-toolbar>
  </q-header>

  <q-page class="flex flex-center column q-pa-md">
    <!-- App Logo -->
    <q-img
      src="icons/icon-192x192.png"
      alt="KBalance Logo"
      style="max-width: 150px; height: auto"
      class="q-mb-md"
    />

    <!-- App Title -->
    <div class="text-h4 text-weight-bold text-primary q-mb-sm">KBalance</div>
    <div class="text-subtitle1 text-center q-mb-lg">
      The best way to manage shared expenses!
    </div>

    <div class="q-pa-md">
      <!-- Carousel with Images and Captions -->
      <q-carousel
        v-model="slide"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        height="700px"
        class="bg-white text-primary shadow-1 rounded-borders"
      >
        <!-- Carousel Slides with Images and Descriptions -->
        <q-carousel-slide
          name="transaction"
          class="column"
          style="height: 100%; justify-content: space-between"
        >
          <q-img
            src="screenshots/transaction.jpeg"
            alt="Transaction"
            fit="contain"
            style="flex: 1; width: 100%"
          />
          <div class="carousel-caption text-h6 text-center">
            Easily split expenses with friends
          </div>
        </q-carousel-slide>

        <q-carousel-slide
          name="sheet"
          class="column"
          style="height: 100%; justify-content: space-between"
        >
          <q-img
            src="screenshots/sheet.jpeg"
            alt="Sheet"
            fit="contain"
            style="flex: 1; width: 100%"
          />
          <div class="carousel-caption text-h6 text-center">
            Manage and organize your sheets effortlessly
          </div>
        </q-carousel-slide>

        <q-carousel-slide
          name="conversion"
          class="column"
          style="height: 100%; justify-content: space-between"
        >
          <q-img
            src="screenshots/convert.jpeg"
            alt="Conversion"
            fit="contain"
            style="flex: 1; width: 100%"
          />
          <div class="carousel-caption text-h6 text-center">
            Easily convert currencies with updated rates
          </div>
        </q-carousel-slide>

        <q-carousel-slide
          name="newPageWizard"
          class="column"
          style="height: 100%; justify-content: space-between"
        >
          <q-img
            src="screenshots/newPageWizard.jpeg"
            alt="New Page Wizard"
            fit="contain"
            style="flex: 1; width: 100%"
          />
          <div class="carousel-caption text-h6 text-center">
            Create new sheets with ease using the wizard
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div>
      <!-- Install Button -->
      <q-btn
        label="Install Now"
        icon="file_download"
        color="secondary"
        size="lg"
        @click="installApp"
        class="q-mb-md"
      />
    </div>
    <div>
      <!-- Secondary Option -->
      <q-btn
        label="Use without Installing"
        flat
        color="grey"
        @click="goToSettings"
      />
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'LandingPage',
});

import Utils from 'src/utils/utils';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const $q = useQuasar();
const router = useRouter();
const deferredPrompt = ref(null);
const slide = ref('transaction'); // Controls carousel slides

const screenshots = ref([
  {
    src: '/screenshots/transaction.jpeg',
    caption: 'Easily split expenses with friends',
  },
  { src: '/screenshots/index.jpeg', caption: 'Keep track of who paid what' },
]);

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
  } else if (Utils.isIos()) {
    $q.notify({
      message: "On iOS, use 'Share' → 'Add to Home Screen' to install.",
      color: 'warning',
    });
  } else {
    $q.notify({
      message: 'No install prompt available!',
      color: 'negative',
    });
  }
};

const goToSettings = () => {
  router.replace({ name: 'SettingsPage' });
};
</script>
