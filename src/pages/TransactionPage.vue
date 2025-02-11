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
      <q-space />
      <q-btn
        flat
        :icon="seeInactive ? 'visibility_off' : 'visibility'"
        :label="seeInactive ? 'Hide' : 'Show'"
        @click="seeInactive = !seeInactive"
        class="q-ml-md bg-white text-primary"
        aria-label="Toggle active state"
      />
      <q-btn
        flat
        icon="done"
        label="Confirm"
        @click="saveAndGoBack"
        class="q-ml-md bg-white text-primary"
        aria-label="Save"
      />
    </q-toolbar>
  </q-header>
  <q-page>
    <q-card>
      <q-card-section>
        <q-input
          ref="nameInput"
          v-model="tr.name"
          label="Transaction Name"
          outlined
          @focus="nameInput.select()"
        />
      </q-card-section>

      <q-card-section class="row" style="align-items: center">
        <q-select
          class="q-mr-md"
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
          :style="{ maxWidth: '130px' }"
        />
        <CurrencyInput
          v-model="tr.amount"
          :currency="'XXX'"
          style="flex: 1"
          label="Amount"
          @update:model-value="split(true)"
        />
      </q-card-section>

      <q-card-section class="column items-center" v-if="tr.debts.length === 2">
        <q-btn-dropdown class="full-width">
          <template v-slot:label>
            <div class="q-gutter-none">
              <div class="text-center">
                {{ split2topLine(state2, tr.payer) }}
              </div>
              <div
                class="text-center text-caption"
                :class="tr.payer === youIdx ? 'text-green' : 'text-red'"
                v-if="state2 !== -1 && tr.amount !== 0"
              >
                {{ split2bottomLine(state2, tr.payer) }}
              </div>
            </div>
          </template>

          <q-list>
            <q-item
              clickable
              v-close-popup
              class="bg-white"
              @click="splitFor2(0)"
            >
              <q-item-section>
                <div class="q-gutter-none">
                  <div class="text-center">
                    {{ split2topLine(1, youIdx) }}
                  </div>
                  <div
                    class="text-center text-caption text-green"
                    v-if="tr.amount"
                  >
                    {{ split2bottomLine(1, youIdx) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-grey-3"
              @click="splitFor2(1)"
            >
              <q-item-section>
                <div class="q-gutter-none">
                  <div class="text-center">
                    {{ split2topLine(0, youIdx) }}
                  </div>
                  <div
                    class="text-center text-caption text-green"
                    v-if="tr.amount"
                  >
                    {{ split2bottomLine(0, youIdx) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-white"
              @click="splitFor2(2)"
            >
              <q-item-section>
                <div class="q-gutter-none">
                  <div class="text-center">
                    {{ split2topLine(1, otherIdx) }}
                  </div>
                  <div
                    class="text-center text-caption text-red"
                    v-if="tr.amount"
                  >
                    {{ split2bottomLine(1, otherIdx) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-grey-3"
              @click="splitFor2(3)"
            >
              <q-item-section>
                <div class="q-gutter-none">
                  <div class="text-center">
                    {{ split2topLine(0, otherIdx) }}
                  </div>
                  <div
                    class="text-center text-caption text-red"
                    v-if="tr.amount"
                  >
                    {{ split2bottomLine(0, otherIdx) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-card-section>
        <div class="row text-bold">
          <div class="col-auto q-mr-md q-ml-sm">Payer</div>
          <div class="col">Person</div>
          <div class="col-auto q-mr-md">Debtor</div>
          <div class="col-auto q-mr-lg">Amount</div>
        </div>
      </q-card-section>
    </q-card>

    <q-list class="q-my-md q-mr-md q-ml-md">
      <q-item
        v-for="(id, index) in store.currentSheetPeople"
        :key="index"
        :class="index % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
        v-show="
          store.currentSheet.people[id].active ||
          seeInactive ||
          tr.payer === index ||
          tr.debts[index].owedAmount !== 0 ||
          tr.debts[index].isDebtor
        "
      >
        <div class="q-mr-sx" style="display: flex">
          <q-radio
            v-model="tr.payer"
            :val="index"
            @update:model-value="split(false)"
          />
        </div>
        <q-item-section>
          <person-item :id="id" :max-length="13" />
        </q-item-section>
        <q-checkbox
          v-model="tr.debts[index].isDebtor"
          class="q-mr-sx"
          @update:model-value="split(true)"
        />
        <CurrencyInput
          v-model="tr.debts[index].owedAmount"
          :currency="'XXX'"
          :style="{ maxWidth: '100px' }"
          @blur="customEditing(index)"
        />
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store.js';
import { useQuasar } from 'quasar';
import PersonItem from 'src/components/PersonItem.vue';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import currencyCodes from 'currency-codes';
import Transaction from 'src/models/transaction';
import Utils from 'src/utils/utils';
import { ref, computed } from 'vue';

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const tr = ref(store.getEditableTransaction());
const seeInactive = ref(false);
const currencySelect = ref(null);
const nameInput = ref(null);
const isCustomEditing = ref(false);

const currencies = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

const currencyOptions = ref(currencies);

const otherId = store.currentSheetPeople.find((item) => item !== store.user.id);
const otherIdx = store.currentSheetPeople.findIndex(
  (item) => item !== store.user.id,
);
const youIdx = store.currentSheetPeople.findIndex(
  (item) => item === store.user.id,
);

const state2 = computed(() => {
  return Transaction.state(tr.value);
});

const split2topLine = (state, payer) => {
  switch (state) {
    case 0:
      return (
        (payer === youIdx ? 'You are' : `${store.getName(otherId)} is`) +
        ' owed the full amount'
      );
    case 1:
      return (
        (payer === youIdx ? 'You' : store.getName(otherId)) +
        ' paid, split equally'
      );
    default:
      return 'Custom';
  }
};

const split2bottomLine = (state, payer) => {
  const amount =
    state === 0
      ? tr.value.amount
      : (tr.value.amount + (tr.value.amount % 2)) / 2;
  if (payer === youIdx) {
    return `${store.getName(otherId)} owes you ${Utils.displayCurrency(
      tr.value.currency,
      amount,
    )}`;
  }

  return `You owe ${store.getName(otherId)} ${Utils.displayCurrency(
    tr.value.currency,
    amount,
  )}`;
};

const splitFor2 = (idx) => {
  switch (idx) {
    case 0:
      tr.value.payer = youIdx;
      tr.value.debts[0].isDebtor = true;
      tr.value.debts[1].isDebtor = true;
      break;
    case 1:
      tr.value.payer = youIdx;
      tr.value.debts[youIdx].isDebtor = false;
      tr.value.debts[otherIdx].isDebtor = true;
      break;
    case 2:
      tr.value.payer = otherIdx;
      tr.value.debts[0].isDebtor = true;
      tr.value.debts[1].isDebtor = true;
      break;
    case 3:
      tr.value.payer = otherIdx;
      tr.value.debts[youIdx].isDebtor = true;
      tr.value.debts[otherIdx].isDebtor = false;
      break;
    default:
      return;
  }
  split(true);
};

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      currencyOptions.value = currencies;
    });
    return;
  }

  tr.value.currency = '';
  const needle = val.toLowerCase();
  update(() => {
    const filtered = currencies.filter((v) =>
      v.value.toLowerCase().includes(needle),
    );
    currencyOptions.value = filtered;

    if (currencyOptions.value.length === 1) {
      tr.value.currency = currencyOptions.value[0].value;
      if (currencySelect.value) {
        currencySelect.value.updateInputValue(''); // Clear input
        setTimeout(() => {
          currencySelect.value.hidePopup(); // Close the dropdown
        }, 0);
      }
    }
  });
};

const customEditing = (index) => {
  if (!isCustomEditing.value) {
    isCustomEditing.value = true;
    Transaction.clearOwedAmounts(tr.value, index);
  }
  if (Transaction.fillLastOwedAmount(tr.value)) {
    $q.notify('The amount has been increased to match the sum of the shares.');
  }
};

const split = (override) => {
  if (override || !isCustomEditing.value) {
    isCustomEditing.value = false;
    Transaction.split(tr.value);
  }
};

const goBack = () => {
  store.transactionId = null;
  router.go(-1);
};

const saveAndGoBack = async () => {
  try {
    Transaction.check(tr.value);
    await store.addTransaction(tr.value);
    store.transactionId = null;
    goBack();
  } catch (error) {
    $q.notify({
      message: error.message || error,
      color: 'negative',
    });
    return;
  }
};
</script>
