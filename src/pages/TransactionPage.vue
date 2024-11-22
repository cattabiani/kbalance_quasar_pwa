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
      <q-card-section class="row justify-center" style="align-items: center">
        <q-card-section class="row justify-center q-gutter-sm" style="flex: 1">
          <CurrencySelector
            v-model="editableTransaction.currency"
            :disable="!isEditable"
          />
          <CurrencyInput
            v-model="editableTransaction.amount"
            :currency="'XXX'"
            :disable="!isEditable"
            @blur="Transaction.split(editableTransaction)"
          />
        </q-card-section>
        <q-card-section class="q-gutter-sm" style="margin-left: auto">
          <q-card-section
            class="row q-gutter-sm"
            style="display: flex; align-items: center"
          >
            <q-card-section class="q-mt-none q-mb-none">
              <q-icon name="event" size="lg" class="text-grey-7" />
              <div>{{ formattedDate.split("-")[2] }}</div>
            </q-card-section>
            <q-card-section
              class="q-mt-none q-mb-none"
              style="text-align: center"
            >
              <div>{{ formattedDate.split("-")[1] }}</div>
              <div>{{ formattedDate.split("-")[0] }}</div>
            </q-card-section>
          </q-card-section>
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

const formattedDate = computed(() => {
  if (!editableTransaction.value.date) return "";
  const date = new Date(editableTransaction.value.date);

  const day = date.getDate().toString().padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // Example format: 01-Nov-2024
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
