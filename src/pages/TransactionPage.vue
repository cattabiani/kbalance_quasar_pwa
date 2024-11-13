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
        @click="editForm"
        class="q-ml-md bg-white text-primary"
        aria-label="Add a new transaction"
      /> -->
    </q-toolbar>
  </q-header>
  <q-page>
    <q-card align="center" bordered class="q-my-md">
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
        <div class="q-my-md q-gutter-sm row justify-center">
          <div class="col-auto">
            <CurrencyInput
              v-model="editableTransaction.amount"
              :currency="'XXX'"
              :disable="!isEditable"
              @blur="editableTransaction.split()"
            />
          </div>
          <div class="col-auto">
            <CurrencySelector
              v-model="editableTransaction.currency"
              :disable="!isEditable"
            />
          </div>
        </div>
      </q-card-section>
      <q-list bordered class="q-my-md">
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
                  @update:model-value="editableTransaction.split()"
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
      <q-card-actions align="center" v-if="isEditable">
        <q-btn icon="close" color="red" @click="goBack" />
        <q-btn icon="check" color="primary" @click="saveAndGoBack" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "TransactionPage",
});

import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import CurrencyInput from "../components/CurrencyInput.vue";
import CurrencySelector from "../components/CurrencySelector.vue";

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
  store.saveInCurrentTransaction(editableTransaction.value);
  goBack();
};

const goBack = () => {
  store.lastEditedCurrency = editableTransaction.value.currency;
  store.transactionID = -1;
  router.go(-1);
};

watch(
  () => editableTransaction.value.currency,
  (value) => {
    store.lastEditedCurrency = value;
  }
);

</script>
