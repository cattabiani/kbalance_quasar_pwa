<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        icon="arrow_back"
        @click="router.replace({ name: 'IndexPage' })"
        aria-label="Go Back"
        class="bg-white text-primary"
      />
      <q-toolbar-title>Admin</q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page padding>
    <div class="admin-column q-gutter-y-md">
      <q-banner v-if="error" class="bg-negative text-white" rounded>
        {{ error }}
        <template v-if="!isAdmin" #action>
          <q-btn flat label="Retry" @click="refresh" />
        </template>
      </q-banner>
      <div v-if="!isAdmin && !error" class="flex flex-center q-pa-xl">
        <q-spinner size="lg" />
      </div>

      <template v-if="isAdmin">
        <q-card>
          <q-card-section>
            <div class="text-h6">Database maintenance</div>
            <p class="q-mb-none">
              Back up, migrate and restore the Firestore data of project
              <strong>{{ projectId }}</strong
              >. Everything here reads straight from the server and needs a
              connection. The usual routine: <strong>1.</strong> download a
              backup, <strong>2.</strong> run the migration dry run,
              <strong>3.</strong> apply it. <strong>Restore</strong> is the undo
              button if something went wrong.
            </p>
          </q-card-section>
        </q-card>

        <!-- Status -->
        <q-card>
          <q-card-section>
            <div class="text-h6">Status</div>
            <p>
              How many documents are on each data format version. Anything below
              the current version still works (the app upgrades it when
              reading), but only a migration rewrites it.
            </p>
            <q-markup-table v-if="status" flat bordered dense>
              <thead>
                <tr>
                  <th class="text-left">Collection</th>
                  <th class="text-left">Documents per version</th>
                  <th class="text-left">Current</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, name) in status" :key="name">
                  <td>{{ name }}</td>
                  <td v-if="s.versions">
                    <span
                      v-for="(n, v) in s.versions"
                      :key="v"
                      class="q-mr-md"
                      :class="{ 'text-negative': Number(v) < s.current }"
                    >
                      v{{ v }}: {{ n }}
                    </span>
                  </td>
                  <td v-else>{{ s.count }} (not versioned)</td>
                  <td>{{ s.versions ? `v${s.current}` : '' }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
          <q-card-actions>
            <q-btn
              flat
              icon="refresh"
              label="Refresh"
              :loading="busy === 'status'"
              :disable="!!busy"
              @click="refresh"
            />
          </q-card-actions>
        </q-card>

        <!-- Backup -->
        <q-card>
          <q-card-section>
            <div class="text-h6">1. Backup</div>
            <p class="q-mb-none">
              Downloads every document as one JSON file. Keep it somewhere safe:
              it contains all users' data. Always do this right before a
              migration; the migration stays locked until you have.
            </p>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="primary"
              icon="download"
              label="Download backup"
              :loading="busy === 'backup'"
              :disable="!!busy"
              @click="backup"
            />
            <span v-if="backupDone" class="q-ml-md text-positive">
              <q-icon name="check" /> Backup downloaded
            </span>
          </q-card-actions>
        </q-card>

        <!-- Migrate -->
        <q-card>
          <q-card-section>
            <div class="text-h6">2. Migrate</div>
            <p>
              Upgrades stored documents to the current version. The dry run only
              lists what would change, including data the upgrade has to repair;
              nothing is written until you apply it. Everything is ticked;
              untick to migrate only some documents (e.g. one sheet to try it
              out).
            </p>
            <template v-if="plan">
              <p v-if="!plan.length" class="text-positive q-mb-none">
                <q-icon name="check" /> Everything is current. Nothing to do.
              </p>
              <template v-else>
                <div class="q-mb-sm">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    label="Select all"
                    @click="selectAllToMigrate"
                  />
                  <q-btn
                    flat
                    dense
                    size="sm"
                    label="Select none"
                    @click="migrateSelected = []"
                  />
                </div>
                <q-list bordered separator dense class="scroll-list">
                  <q-item v-for="p in plan" :key="p.path" tag="label">
                    <q-item-section side>
                      <q-checkbox
                        v-model="migrateSelected"
                        :val="p.path"
                        :disable="!!p.error"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ p.name || p.path }}</q-item-label>
                      <q-item-label caption>{{ p.path }}</q-item-label>
                      <q-item-label
                        v-if="p.error"
                        caption
                        class="text-negative"
                      >
                        cannot upgrade ({{ p.error }}); it will be skipped
                      </q-item-label>
                      <q-item-label
                        v-for="(r, i) in p.repairs"
                        :key="i"
                        caption
                        class="text-warning"
                      >
                        repair: {{ r }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge
                        :color="p.error ? 'negative' : 'primary'"
                        :label="
                          p.error ? `v${p.from}` : `v${p.from} → v${p.to}`
                        "
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </template>
          </q-card-section>
          <q-card-actions>
            <q-btn
              flat
              icon="visibility"
              label="Dry run"
              :loading="busy === 'plan'"
              :disable="!!busy"
              @click="dryRun"
            />
            <q-btn
              color="primary"
              icon="upgrade"
              :label="`Apply (${migrateSelected.length})`"
              :loading="busy === 'migrate'"
              :disable="!!busy || !backupDone || !migrateSelected.length"
              @click="migrate"
            />
            <span v-if="!backupDone" class="q-ml-md text-grey">
              Download a backup first.
            </span>
          </q-card-actions>
        </q-card>

        <!-- Restore -->
        <q-card>
          <q-card-section>
            <div class="text-h6">3. Restore</div>
            <p>
              Puts documents back exactly as they are in a backup file. Pick a
              file, then tick what to restore: everything, or only the broken
              sheets (other sheets keep the edits made since the backup). Before
              writing, the current version of the ticked documents is
              downloaded, so a restore can be undone with the same tool, except
              that documents it re-creates (marked "deleted") stay. Documents
              created after the backup are never deleted.
            </p>
            <q-file
              v-model="restoreFile"
              label="Backup file"
              accept=".json,application/json"
              outlined
              dense
              clearable
              :disable="!!busy"
              @update:model-value="loadRestoreFile"
            >
              <template #prepend><q-icon name="attach_file" /></template>
            </q-file>
            <p v-if="restoreBackup" class="q-mt-sm q-mb-sm">
              Backup of <strong>{{ restoreBackup.projectId }}</strong> from
              {{ new Date(restoreBackup.createdAt).toLocaleString() }}.
              <span
                v-if="restoreBackup.projectId !== projectId"
                class="text-negative"
              >
                This is a different project than the current one!
              </span>
            </p>
            <template v-if="restoreRows">
              <div class="q-mb-sm">
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Select changed and deleted"
                  @click="selectDiffering"
                />
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Select none"
                  @click="selected = []"
                />
              </div>
              <q-list bordered separator dense class="scroll-list">
                <q-item v-for="row in restoreRows" :key="row.path" tag="label">
                  <q-item-section side>
                    <q-checkbox v-model="selected" :val="row.path" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ row.name || row.path }}</q-item-label>
                    <q-item-label caption>{{ row.path }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge
                      :color="statusColor[row.status]"
                      :label="row.status"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="negative"
              icon="restore"
              :label="`Restore ${selected.length} document(s)`"
              :loading="busy === 'restore'"
              :disable="!!busy || !selected.length"
              @click="restore"
            />
          </q-card-actions>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({ name: 'AdminPage' });

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { exportFile, useQuasar } from 'quasar';
import _ from 'lodash';
import { useStore } from 'src/stores/store';
import {
  backupFileName,
  compareRestore,
  makeBackup,
  parseBackup,
  planMigration,
  versionStatus,
} from 'src/models/backup';
import { fetchAll, fetchDocs, migrateDocs, writeDocs } from 'src/admin/adminDb';

const $q = useQuasar();
const router = useRouter();
const store = useStore();

const projectId = computed(() => store.config.projectId);

const busy = ref(null); // name of the running action, or null
const error = ref('');
const status = ref(null);
// Nothing is shown until the first read succeeds; non-admins (whom the rules
// deny) get the regular not-found page, without hints.
const isAdmin = computed(() => status.value !== null);
const backupDone = ref(false);
const plan = ref(null);
const migrateSelected = ref([]);
const selectAllToMigrate = () => {
  migrateSelected.value = plan.value.filter((p) => !p.error).map((p) => p.path);
};

const restoreFile = ref(null);
const restoreBackup = ref(null);
const restoreRows = ref(null);
const selected = ref([]);
const statusColor = { same: 'grey', changed: 'warning', deleted: 'negative' };

// Runs an action with a busy indicator; turns errors into the banner.
async function run(name, fn) {
  busy.value = name;
  error.value = '';
  try {
    await fn();
  } catch (e) {
    if (e.code === 'permission-denied' && !isAdmin.value) {
      router.replace('/not-found');
    } else {
      error.value = e.message;
    }
  } finally {
    busy.value = null;
  }
}

// Downloads `docs` as a backup file; returns its name. Throws if the browser
// refused the download, so nothing is written without its backup.
function downloadBackup(prefix, docs) {
  const now = new Date();
  const name = backupFileName(prefix, projectId.value, now);
  const content = JSON.stringify(
    makeBackup(docs, projectId.value, now),
    null,
    1,
  );
  const result = exportFile(name, content, 'application/json');
  if (result !== true) throw new Error(`Download failed: ${result.message}`);
  return name;
}

// Reads everything and refreshes the status from it.
async function fetchAllWithStatus() {
  const docs = await fetchAll();
  status.value = versionStatus(docs);
  return docs;
}

const refresh = () => run('status', fetchAllWithStatus);

const backup = () =>
  run('backup', async () => {
    downloadBackup('kbalance-backup', await fetchAllWithStatus());
    backupDone.value = true;
  });

const dryRun = () =>
  run('plan', async () => {
    plan.value = planMigration(await fetchAllWithStatus());
    selectAllToMigrate();
  });

const migrate = () => {
  const n = migrateSelected.value.length;
  if (!window.confirm(`Rewrite ${n} document(s) to the current version?`)) {
    return;
  }
  return run('migrate', async () => {
    const { rewritten, failed } = await migrateDocs(migrateSelected.value);
    $q.notify({ message: `Migrated ${rewritten} document(s).` });
    plan.value = null;
    migrateSelected.value = [];
    await fetchAllWithStatus();
    if (failed.length) {
      const list = failed.map((f) => `${f.path} (${f.error})`).join(', ');
      throw new Error(`Not migrated: ${list}`);
    }
  });
};

// Re-reads everything and updates both the restore list and the status.
const compareWithLive = async () => {
  const live = await fetchAllWithStatus();
  restoreRows.value = compareRestore(restoreBackup.value.docs, live);
};

const loadRestoreFile = (file) => {
  restoreBackup.value = null;
  restoreRows.value = null;
  selected.value = [];
  if (!file) return;
  return run('restore', async () => {
    restoreBackup.value = parseBackup(await file.text());
    await compareWithLive();
  });
};

const selectDiffering = () => {
  selected.value = restoreRows.value
    .filter((row) => row.status !== 'same')
    .map((row) => row.path);
};

const restore = () => {
  const paths = [...selected.value];
  const otherProject = restoreBackup.value.projectId !== projectId.value;
  const question =
    `Overwrite ${paths.length} document(s) with the backup version?` +
    (otherProject ? '\n\nThe backup is from a DIFFERENT project!' : '');
  if (!window.confirm(question)) return;

  return run('restore', async () => {
    // undo file first: if it can't be made, nothing is written
    const undoFile = downloadBackup(
      'kbalance-before-restore',
      await fetchDocs(paths),
    );
    if (!window.confirm(`Was ${undoFile} saved? OK writes the restore.`)) {
      return;
    }

    await writeDocs(_.pick(restoreBackup.value.docs, paths));
    $q.notify({ message: `Restored ${paths.length} document(s).` });
    selected.value = [];
    await compareWithLive();
  });
};

onMounted(refresh);
</script>

<style scoped>
.admin-column {
  max-width: 720px;
  margin: 0 auto;
}
.scroll-list {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
