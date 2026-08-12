<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title style="font-size: 28px"> Index </q-toolbar-title>

      <q-btn
        icon="settings"
        flat
        class="q-ml-md bg-white text-primary"
        push
        label="Settings"
      >
        <q-menu>
          <q-list>
            <q-item clickable v-ripple @click="shareFirebaseSettings">
              <q-item-section avatar class="text-primary">
                <q-icon name="qr_code" />
              </q-item-section>
              <q-item-section class="text-primary">
                Share Settings
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-grey-2"
              @click="goToConversionRatesSettings"
            >
              <q-item-section avatar class="text-primary">
                <q-icon name="qcurrency_exchange" />
              </q-item-section>
              <q-item-section class="text-primary">
                Conversion Rates
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="showAbout = true">
              <q-item-section avatar class="text-primary">
                <q-icon name="info" />
              </q-item-section>
              <q-item-section class="text-primary">About</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              class="bg-grey-2"
              @click="showArchived = !showArchived"
            >
              <q-item-section
                avatar
                :class="showArchived ? 'text-primary' : 'text-grey-6'"
              >
                <q-icon name="archive" />
              </q-item-section>
              <q-item-section
                :class="showArchived ? 'text-primary' : 'text-grey-6'"
              >
                Show Archived Sheets
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="showArchived"
                  dense
                  color="primary"
                  aria-label="Show archived sheets"
                  @click.stop
                />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="logout">
              <q-item-section avatar class="text-primary">
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section class="text-primary">Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
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
      <q-tab-panel name="Sheets" class="q-pt-sm q-pl-none q-pr-none">
        <q-card flat bordered class="q-mb-sm">
          <q-card-section class="row justify-center">
            <q-btn
              icon="note_add"
              label="Add Sheet"
              color="primary"
              aria-label="Add a new balance sheet"
              @click="goToNewSheetWizard"
            />
          </q-card-section>

          <template v-for="(id, index) in store.userLedgerSheets" :key="index">
            <q-separator v-if="index > 0" />
            <q-slide-item
              @left="(event) => removeSheet(event, id, index)"
              @right="(event) => toggleArchiveSheet(event, id)"
              @click="editSheet(id)"
              left-color="red"
              right-color="grey-7"
            >
              <template v-slot:left>
                <q-icon name="delete" />
              </template>
              <template v-slot:right>
                <q-icon
                  :name="
                    store.userLedger.sheets[id].archived
                      ? 'unarchive'
                      : 'archive'
                  "
                />
              </template>
              <q-item
                clickable
                :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
              >
                <q-item-section>
                  <div
                    class="row items-center no-wrap"
                    :class="{
                      'text-grey-6': store.userLedger.sheets[id].archived,
                    }"
                  >
                    <q-icon
                      name="archive"
                      size="xs"
                      class="q-mr-xs"
                      :class="{
                        invisible: !store.userLedger.sheets[id].archived,
                      }"
                    />
                    <q-item-label>
                      {{ store.userLedger.sheets[id].name }}
                    </q-item-label>
                  </div>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </template>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="Friends" class="q-pt-sm q-pl-none q-pr-none">
        <q-card flat bordered class="q-mb-sm">
          <q-card-section class="row justify-center">
            <q-btn
              icon="person"
              label="Add Friend"
              color="primary"
              aria-label="Add a new friend"
              @click="startReceiving"
            />
          </q-card-section>

          <template
            v-for="(id, index) in store.userLedgerFriends"
            :key="index"
          >
            <q-separator v-if="index > 0" />
            <q-slide-item
              @left="(event) => removeFriend(event, id, index)"
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
                  <person-item :id="id" :people="store.userLedger.friends" />
                </q-item-section>
              </q-item>
            </q-slide-item>
          </template>
        </q-card>
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

// Optimistic local mirror of userLedger.showArchivedSheets: the toggle
// should respond instantly on click rather than waiting on the Firestore
// round-trip, which would otherwise leave it looking unresponsive.
const showArchived = ref(!!store.userLedger.showArchivedSheets);

watch(
  () => store.userLedger?.showArchivedSheets,
  (value) => {
    showArchived.value = !!value;
  },
);

watch(showArchived, async (value) => {
  try {
    await store.setShowArchivedSheets(value);
  } catch (error) {
    showArchived.value = !value;
    $q.notify({ message: error.message || error, color: 'negative' });
  }
});

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

const startReceiving = () => {
  isReceiving.value = true;
  receiveString.value = null;
};

const removeSheet = async ({ reset }, id, index) => {
  try {
    nUsers.value = await store.nUsers(id);

    const message =
      nUsers.value <= 1
        ? `The sheet ${store.userLedger.sheets[id].name} will be completely deleted. Do you want to proceed?`
        : `The sheet ${store.userLedger.sheets[id].name} will be deleted only for you since there are still some users involved. Do you want to proceed?`;

    $q.notify({
      message,
      timeout: 0,
      actions: [
        {
          label: 'Cancel',
          color: 'white',
          handler: () => reset(),
        },
        {
          label: 'Confirm',
          color: 'red',
          handler: async () => {
            await store.removeSheet(id, nUsers.value);
            if (index < store.userLedgerSheets.length) {
              reset();
            }
            $q.notify({ message: 'Sheet removed successfully!' });
          },
        },
      ],
    });
  } catch (error) {
    reset();
    $q.notify({ message: error.message || error, color: 'negative' });
  }
};

const editSheet = async (id) => {
  await store.subscribeCurrentSheet(id);
  router.push({ name: 'SheetPage' });
};

const toggleArchiveSheet = async ({ reset }, id) => {
  const archived = !store.userLedger.sheets[id].archived;
  await store.setSheetArchived(id, archived);
  $q.notify({
    message: archived ? 'Sheet archived' : 'Sheet unarchived',
  });
  reset();
};

const editFriendName = (id) => {
  newFriendName.value = store.userLedger.friends[id].name;
  editFriendNameId.value = id;
  isEditFriendName.value = true;
};

const removeFriend = async ({ reset }, id, index) => {
  try {
    const message = `Are you sure you want to remove ${store.getName(id)}?`;

    $q.notify({
      message,
      timeout: 0,
      actions: [
        { label: 'Cancel', color: 'white', handler: () => reset() },
        {
          label: 'Confirm',
          color: 'red',
          handler: async () => {
            await store.removeFriend(id);
            if (index < store.userLedgerFriends.length) {
              reset();
            }
            $q.notify({ message: 'Friend removed successfully!' });
          },
        },
      ],
    });
  } catch (error) {
    reset();
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

const goToConversionRatesSettings = () => {
  router.push({ name: 'ConversionRatesSettingsPage' });
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
  () => store.userLedger,
  async (newValue) => {
    if (newValue === null) {
      await logout();
    }
  },
  { immediate: true },
);
</script>
