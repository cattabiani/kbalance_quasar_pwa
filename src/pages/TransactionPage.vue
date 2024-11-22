<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        icon="arrow_back"
        @click="goBack"
        aria-label="Go Back"
        class="bg-white text-primary"
      />
      <q-toolbar-title style="font-size: 28px"> Transaction </q-toolbar-title>
      <!-- <q-btn v-if="!isEditable"
        flat
        icon="edit"
        @click="editForm"matrix
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new transaction"
      /> -->
    </q-toolbar>
  </q-header>
  <q-page>
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section>
        <q-input
          ref="nameInput"
          v-model="editableTransaction.name"
          label="Description"
          autogrow
          outlined
          :disable="!isEditable"
          @focus="nameInput.select()"
        />
      </q-card-section>
      <q-card-section
        class="row"
        style="justify-content: space-between; align-items: center"
      >
        <CurrencySelector
          v-model="editableTransaction.currency"
          :disable="!isEditable"
        />
        <CurrencyInput
          class="q-ml-md"
          v-model="editableTransaction.amount"
          :currency="'XXX'"
          :disable="!isEditable"
          @change="Transaction.split(editableTransaction)"
          style="flex: 1"
        />
        <q-card-section class="column" style="margin-left: auto">
          <q-card-label>
            <q-icon name="event" size="lg" class="text-grey-7" />
          </q-card-label>
          <q-card-label>
            {{ Utils.getYear(editableTransaction.date) }}
          </q-card-label>
        </q-card-section>
        <q-card-section class="column" style="text-align: center">
          <q-card-label>
            {{ Utils.getMonth(editableTransaction.date) }}
          </q-card-label>
          <q-card-label>
            {{ Utils.getDay(editableTransaction.date) }}
          </q-card-label>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-list class="q-my-md q-mr-md q-ml-md">
      <q-item
        v-for="(item, id) in filteredPeople"
        :key="id"
        :class="id % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
      >
        <q-item-section>
          <div
            class="q-gutter-sm"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <q-radio v-model="editableTransaction.payer" :val="id" />
              <q-item-label>{{ item.name }}</q-item-label>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <q-checkbox
                left-label
                v-model="editableTransaction.isDebtor[id]"
                class="q-mr-md"
                @update:model-value="Transaction.split(editableTransaction)"
              />

              <CurrencyInput
                class="q-mr-md"
                v-model="editableTransaction.owed[id]"
                :currency="'XXX'"
                :disable="true"
                style="flex: 1; max-width: 20%"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div
      class="q-mt-md q-mx-auto"
      style="max-width: 300px; display: flex; justify-content: space-between"
    >
      <q-btn icon="close" color="red" @click="goBack" label="Cancel" />
      <q-btn icon="check" color="primary" @click="saveAndGoBack" label="Save" />
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "TransactionPage",
});

import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import CurrencyInput from "../components/CurrencyInput.vue";
import CurrencySelector from "../components/CurrencySelector.vue";
import Transaction from "../models/transaction";
import Utils from "../utils/utils";

const store = useStore();
const router = useRouter();

const isEditable = ref(true);
const editableTransaction = ref(store.getEditableTransaction());
// todo sync store.currency

const nameInput = ref(null);

const editForm = () => {
  isEditable.value = true;
};

const filteredPeople = computed(() => {
  return store.currentSheet.people.filter((person) => person.active);
});

const saveAndGoBack = () => {
  store.addTransaction(editableTransaction.value);
  goBack();
};

const goBack = () => {
  store.lastEditedCurrency = editableTransaction.value.currency;
  router.go(-1);
};

watch(
  () => editableTransaction.value.currency,
  (value) => {
    store.lastEditedCurrency = value;
  }
);

onMounted(() => {
  if (nameInput.value) {
    nameInput.value.focus();
  }
});
</script>
