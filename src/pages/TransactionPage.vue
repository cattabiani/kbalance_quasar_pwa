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
        @click="debug()"
        class="q-ml-md bg-white text-primary"
        aria-label="Debug"
      />
      <q-btn
        flat
        :icon="showOnlyActive ? 'visibility_off' : 'visibility'"
        @click="showOnlyActive = !showOnlyActive"
        class="q-ml-md bg-white text-primary"
        aria-label="Toggle active state"
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
          v-model="tr.name"
          label="Description"
          autogrow
          outlined
          @focus="nameInput.select()"
        />
      </q-card-section>
      <q-card-section
        class="row"
        style="justify-content: space-between; align-items: center"
      >
        <q-select
          ref="currencySelect"
          label="Select a Currency"
          filled
          v-model="tr.currency"
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
          v-model="tr.amount"
          :currency="'XXX'"
          @change="Transaction.split(tr)"
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
            {{ Utils.getYear(tr.timestamp) }}
          </div>
        </q-card-section>
        <q-card-section class="column dense" style="text-align: center">
          <div class="text-caption">
            {{ Utils.getMonth(tr.timestamp) }}
          </div>
          <div class="text-caption">
            {{ Utils.getDay(tr.timestamp) }}
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-list class="q-my-md q-mr-md q-ml-md">
      <q-item
        v-for="(id, index) in store.currentSheetPeople"
        :key="index"
        :class="index % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
        v-show="
          store.currentSheet.people[id].active ||
          !showOnlyActive ||
          tr.payer === index ||
          tr.debts[index].owedAmount !== 0 ||
          tr.debts[index].isDebtor
        "
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
              <q-radio v-model="tr.payer" :val="index" />
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <q-item-label
                :style="{
                  textDecoration:
                    store.currentSheet.people[id].active === false
                      ? 'line-through'
                      : 'none',
                }"
                >{{ store.username(id) }}</q-item-label
              >
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <q-checkbox
                v-model="tr.debts[index].isDebtor"
                class="q-mr-md justify-end"
                @update:model-value="Transaction.split(tr)"
              />
              <q-card flat bordered class="q-pl-sm q-pr-sm">
                <div>
                  {{ Utils.displayCurrency("", tr.debts[index].owedAmount) }}
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "src/stores/store.js";
import { useQuasar } from "quasar";
import Utils from "src/utils/utils";
import CurrencyInput from "src/components/CurrencyInput.vue";
import currencyCodes from "currency-codes";
import Transaction from "src/models/transaction";

const $q = useQuasar();
const store = useStore();
const router = useRouter();

// editable transaction
const tr = ref(store.getEditableTransaction());
const showOnlyActive = ref(true);
const nameInput = ref(null);
const currencySelect = ref(null);

const debug = () => {
  console.log(tr.value);
};

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

  tr.value.currency = "";
  const needle = val.toLowerCase();
  update(() => {
    const filtered = currencies.filter((v) =>
      v.value.toLowerCase().includes(needle)
    );
    currencyOptions.value = filtered;

    if (currencyOptions.value.length === 1) {
      tr.value.currency = currencyOptions.value[0].value;
      if (currencySelect.value) {
        currencySelect.value.updateInputValue(""); // Clear input
        setTimeout(() => {
          currencySelect.value.hidePopup(); // Close the dropdown
        }, 0);
      }
    }
  });
};

const goBack = () => {
  store.transactionId = null;
  router.go(-1);
};

const saveAndGoBack = async () => {
  try {
    await store.addTransaction(tr.value);
  } catch (error) {
    $q.notify({
      message: error.message || error,
    });
    return;
  }

  goBack();
};
</script>
