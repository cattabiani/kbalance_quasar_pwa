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
      <q-btn
        flat
        icon="bug_report"
        @click="debug"
        class="bg-white text-primary"
        aria-label="debug"
      />
      <q-btn
        flat
        icon="close"
        @click="goBack"
        class="q-ml-md bg-red text-white"
        aria-label="Cancel"
      />
      <q-btn
        flat
        icon="check"
        @click="saveAndGoBack"
        class="q-ml-md bg-green text-white"
        aria-label="Save"
      />
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
        <q-select
          label="Select a Currency"
          filled
          v-model="editableTransaction.currency"
          :options="currencyOptions"
          option-label="label"
          option-value="value"
          option-slot
          emit-value
          use-input
          input-debounce="0"
          @filter="filterFn"
        />
        <CurrencyInput
          class="q-ml-md custom-disabled"
          v-model="editableTransaction.amount"
          :currency="'XXX'"
          :disable="!isEditable"
          @change="Transaction.split(editableTransaction)"
          style="flex: 1"
        />
        <q-card-section
          class="column dense"
          style="margin-left: auto; text-align: center"
        >
          <div class="text-caption">
            <q-icon name="event" size="sm" class="text-grey-7" />
          </div>
          <div class="text-caption">
            {{ Utils.getYear(editableTransaction.date) }}
          </div>
        </q-card-section>
        <q-card-section class="column dense" style="text-align: center">
          <div class="text-caption">
            {{ Utils.getMonth(editableTransaction.date) }}
          </div>
          <div class="text-caption">
            {{ Utils.getDay(editableTransaction.date) }}
          </div>
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
            <div style="display: flex; justify-content: flex-start">
              <q-radio v-model="editableTransaction.payer" :val="id" />
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <q-item-label>{{ item.name }}</q-item-label>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <q-checkbox
                v-model="editableTransaction.isDebtor[id]"
                class="q-mr-md justify-end"
                @update:model-value="Transaction.split(editableTransaction)"
              />
              <q-card flat bordered class="q-pl-sm q-pr-sm">
                <div>
                  {{ Utils.displayCurrency("", editableTransaction.owed[id]) }}
                </div>
              </q-card>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
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
import Transaction from "../models/transaction";
import Utils from "../utils/utils";
import { useQuasar } from "quasar";
import currencyCodes from "currency-codes";

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const isEditable = ref(true);
const editableTransaction = ref(store.getEditableTransaction());
// todo sync store.currency

const nameInput = ref(null);

// Map the currency codes into a format compatible with Quasar's q-select
const currencies = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

const currencyOptions = ref(currencies);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      currencyOptions.value = currencies;
    });
    return;
  }

  editableTransaction.value.currency = "";
  const needle = val.toLowerCase();
  update(() => {
    const filtered = currencies.filter((v) =>
      v.value.toLowerCase().includes(needle)
    );
    currencyOptions.value = filtered;
  });
};

const editForm = () => {
  isEditable.value = true;
};

const filteredPeople = computed(() => {
  return store.currentSheet.people.filter((person) => person.active);
});

const debug = () => {
  console.log(editableTransaction.value.currency);
};

const saveAndGoBack = () => {
  if (
    editableTransaction.value.currency === null ||
    editableTransaction.value.currency.length === 0
  ) {
    $q.notify({
      message: "The currency is missing.",
    });
    return;
  }

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
