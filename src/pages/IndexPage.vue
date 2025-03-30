<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title style="font-size: 28px"> Index </q-toolbar-title>

      <q-btn-dropdown
        icon="settings"
        flat
        label="Settings"
        class="q-ml-md bg-white text-primary"
      >
        <q-list>
          <q-item clickable v-ripple @click="shareFirebaseSettings">
            <q-item-section avatar class="text-primary">
              <q-icon name="qr_code" />
            </q-item-section>
            <q-item-section class="text-primary">
              <div class="text-center">Share<br />Settings</div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="showAbout = true">
            <q-item-section avatar class="text-primary">
              <q-icon name="info" />
            </q-item-section>
            <q-item-section class="text-primary">About</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar class="text-primary">
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section class="text-primary">Logout</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>

  <q-page>
    <q-banner
      v-if="!store.user.emailVerified"
      dense
      class="bg-orange-2 text-orange-10 q-mb-md row justify-between"
    >
      <q-toolbar>
        <q-icon name="warning" class="q-mr-sm" />
        <span class="text-body1 q-mr-auto">Email not verified!</span>
        <q-btn
          flat
          color="orange-10"
          label="Send Email"
          icon="email"
          @click="sendVerificationEmail"
          class="bg-white"
        />
      </q-toolbar>
    </q-banner>

    <q-card>
      <q-card-section class="q-pt-xs q-pb-xs text-grey-7">
        {{ store.user.email }}
      </q-card-section>

      <q-card-section class="row q-gutter-sm q-pt-none">
        <q-input
          ref="usernameRef"
          outlined
          v-model="username"
          class="col"
          @blur="setUsername"
          @focus="usernameRef.select()"
          label="Username"
        />
        <q-btn
          icon="qr_code"
          label="Share User"
          color="primary"
          class="col-auto"
          @click="shareUsername"
        />
      </q-card-section>
    </q-card>
    <q-tabs
      v-model="activeTab"
      inline-label
      class="text-primary shadow-2"
      align="center"
      stretch
    >
      <q-tab
        name="Sheets"
        label="Sheets"
        icon="description"
        class="full-width"
      />
      <q-tab name="Friends" label="Friends" icon="group" class="full-width" />
    </q-tabs>
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="Sheets">
        <q-list bordered class="q-mb-md">
          <q-slide-item
            v-for="(id, index) in store.userLedgerSheets"
            :key="index"
            @left="(event) => removeSheet(event, id)"
            @click="editSheet(id)"
            left-color="red"
          >
            <template v-slot:left>
              <q-icon name="delete" />
            </template>
            <q-item
              clickable
              :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
            >
              <q-item-section>
                <q-item-label>{{
                  store.userLedger.sheets[id].name
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>

        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-btn
            icon="note_add"
            label="Add Sheet"
            color="primary"
            aria-label="Add a new balance sheet"
            @click="goToNewSheetWizard"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="Friends">
        <q-list bordered class="q-mb-md">
          <q-slide-item
            v-for="(id, index) in store.userLedgerFriends"
            :key="index"
            @left="(event) => removeFriend(event, id)"
            @click="editFriendName(id)"
            left-color="red"
          >
            <template v-slot:left>
              <q-icon name="delete" />
            </template>
            <q-item
              clickable
              :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
            >
              <q-item-section>
                <person-item :id="id" :people="store.friends" />
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-btn
            icon="person"
            label="Add Friend"
            color="primary"
            aria-label="Add a new friend"
            @click="isReceiving = true"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>

  <share-string v-model="shareString" />
  <about-content v-model="showAbout" />
  <receive-string v-model="receiveString" v-model:isVisible="isReceiving" />
  <receive-string
    :hideScan="true"
    v-model="newFriendName"
    v-model:isVisible="isEditFriendName"
  />
</template>

<script setup>
defineOptions({
  name: 'IndexPage',
});

import ShareString from 'src/components/ShareString.vue';
import ReceiveString from 'src/components/ReceiveString.vue';
import AboutContent from 'src/components/AboutContent.vue';
import PersonItem from 'src/components/PersonItem.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store';
import { ref, watch, computed } from 'vue';

const store = useStore();
const router = useRouter();
const $q = useQuasar();
const showAbout = ref(false);
const activeTab = ref('Sheets');
const receiveString = ref('');
const isReceiving = ref(false);
const username = ref('');
const usernameRef = ref(null);
const shareString = ref('');
const editFriendNameId = ref(null);
const isEditFriendName = ref(false);
const newFriendName = ref(null);
const nUsers = ref(null);

const sendVerificationEmail = async () => {
  try {
    await store.sendVerificationEmail();
    $q.notify({
      message: 'Email sent!',
    });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
  }
};

const removeSheet = async ({ reset }, id) => {
  try {
    nUsers.value = await store.nUsers(id);

    const message =
      nUsers.value <= 1
        ? 'This sheet will be completely deleted. Do you want to proceed?'
        : 'This sheet will be deleted only for you since there are still some users involved. Do you want to proceed?';

    $q.notify({
      message,
      timeout: 0,
      actions: [
        {
          label: 'Cancel',
          color: 'white',
          handler: async () => {
            finalize(reset);
          },
        },
        {
          label: 'Confirm',
          color: 'red',
          handler: async () => {
            await store.removeSheet(id, nUsers.value);
            $q.notify({ message: 'Sheet removed successfully!' });
          },
        },
      ],
    });
  } catch (error) {
    $q.notify({ message: error.message || error, color: 'negative' });
  }
};

const finalize = (reset) => {
  setTimeout(() => reset?.(), 0);
};

const editSheet = async (id) => {
  await store.subscribeCurrentSheet(id);
  router.push({ name: 'SheetPage' });
};

const editFriendName = (id) => {
  newFriendName.value = store.userLedger.friends[id].name;
  editFriendNameId.value = id;
  isEditFriendName.value = true;
};

const removeFriend = async ({ reset }, id) => {
  try {
    const message = `Are you sure you want to remove ${store.getName(id)}?`;

    $q.notify({
      message,
      timeout: 0,
      actions: [
        { label: 'Cancel', color: 'white', handler: () => finalize(reset) },
        {
          label: 'Confirm',
          color: 'red',
          handler: async () => {
            await store.removeFriend(id);
            $q.notify({ message: 'Friend removed successfully!' });
          },
        },
      ],
    });
  } catch (error) {
    $q.notify({ message: error.message || error, color: 'negative' });
  }
};

const shareFirebaseSettings = () => {
  shareString.value = JSON.stringify(store.config);
};

const shareUsername = () => {
  shareString.value = JSON.stringify(store.user);
};

const goToNewSheetWizard = () => {
  router.push({ name: 'NewSheetWizardPage' });
};

const setUsername = async () => {
  try {
    await store.setUsername(username.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
  }
};

watch(
  () => store.user.name, // Watch the `isReady` flag in the store
  (newValue) => {
    username.value = newValue;
  },
  { immediate: true }, // Run immediately to set the username if already ready
);

watch(
  receiveString,
  async (newValue) => {
    if (newValue) {
      try {
        await store.addFriend(JSON.parse(newValue));

        $q.notify({ message: 'Friend added successfully!' });
      } catch (error) {
        $q.notify({
          message: error.message || error,
          color: 'negative',
        });
      }
    }
  },
  { immediate: true },
);

watch(
  newFriendName,
  (newValue) => {
    if (newValue !== null) {
      try {
        store.setFriendName(newValue, editFriendNameId.value);
      } catch (error) {
        $q.notify({
          message: error.message || error,
          color: 'negative',
        });
      }
    }
  },
  { immediate: true },
);

const logout = async () => {
  try {
    await store.logout();
    router.push({ name: 'LoginPage' });
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};

watch(
  store.userLedger,
  async (newValue) => {
    if (newValue === null) {
      await logout();
    }
  },
  { immediate: true },
);
</script>
