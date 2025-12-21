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
        v-if="
          store.currentSheetPeople
            .map((id) => !store.currentSheet.people[id].active)
            .filter((v) => v).length
        "
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
        class="q-ml-md bg-secondary text-white"
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
          label="Title"
          outlined
          @focus="nameInput.select()"
        />
      </q-card-section>

      <q-card-section class="row" style="align-items: center">
        <CurrencyDropdown
          v-model="tr.currency"
          :usedCurrencies="store.currencies"
          class="q-mr-md text-subtitle1 full-height"
        />

        <CurrencyInput
          v-model="credit"
          :currency="tr.currency"
          style="flex: 1"
          label="Amount"
        />
      </q-card-section>
    </q-card>

    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="column items-center" v-if="tr.debts.length === 2">
        <q-btn-dropdown class="full-width">
          <template v-slot:label>
            <TwoPeopleSplitRow
              :split="state2 === 1"
              :payer="payerIdx"
              :you-idx="youIdx"
              :other-name="store.getName(otherId)"
              :currency="tr.currency"
              :amount="credit"
              :reference-currency="store.referenceCurrency"
            />
          </template>

          <q-list>
            <q-item
              clickable
              v-close-popup
              class="bg-white"
              @click="splitFor2(0)"
            >
              <q-item-section>
                <TwoPeopleSplitRow
                  split
                  :payer="youIdx"
                  :you-idx="youIdx"
                  :other-name="store.getName(otherId)"
                  :currency="tr.currency"
                  :amount="credit"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-grey-3"
              @click="splitFor2(1)"
            >
              <q-item-section>
                <TwoPeopleSplitRow
                  :payer="youIdx"
                  :you-idx="youIdx"
                  :other-name="store.getName(otherId)"
                  :currency="tr.currency"
                  :amount="credit"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-white"
              @click="splitFor2(2)"
            >
              <q-item-section>
                <TwoPeopleSplitRow
                  split
                  :payer="otherIdx"
                  :you-idx="youIdx"
                  :other-name="store.getName(otherId)"
                  :currency="tr.currency"
                  :amount="credit"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              class="bg-grey-3"
              @click="splitFor2(3)"
            >
              <q-item-section>
                <TwoPeopleSplitRow
                  :payer="otherIdx"
                  :you-idx="youIdx"
                  :other-name="store.getName(otherId)"
                  :currency="tr.currency"
                  :amount="credit"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-card-section
        class="row justify-center items-center no-wrap"
        v-if="debtors.length > 2"
      >
        <people-dropdown
          class="col-auto q-mr-sm"
          v-model="payer"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
          fixed-label="Payer"
          dense
        />
        <q-btn
          class="col-auto q-mr-sm"
          icon="swap_horiz"
          @click="swapPayerDebtor"
        />
        <people-dropdown
          class="col-auto"
          v-model="debtor"
          :people="store.currentSheet.people"
          :sorted-people="store.currentSheetPeople"
          fixed-label="Debtor"
          dense
        />
      </q-card-section>

      <q-card-section class="row justify-center items-center">
        <q-btn
          flat
          icon="done"
          label="Cancel"
          @click="saveAndGoBack"
          class="q-mr-md bg-red text-white"
          aria-label="Save"
        />
        <q-btn
          flat
          icon="done"
          label="Confirm"
          @click="saveAndGoBack"
          class="bg-secondary text-white"
          aria-label="Save"
        />
      </q-card-section>
    </q-card>
    <q-card-section>
      <div class="row text-bold items-center no-wrap">
        <div
          class="row items-center q-ml-sm q-mr-md"
          :style="`flex: 0 0 ${customCredits ? 18 : 5}%`"
        >
          <q-btn
            dense
            @click="customCredits = !customCredits"
            label="Payer"
            class="text-bold"
            aria-label="Toggle payer mode"
          />
        </div>
        <div style="flex: 1 0 30%; text-align: left">Person</div>
        <div style="flex: 0 0 10%; text-align: center">Owes</div>
        <div style="flex: 0 0 32%; text-align: right">Amount</div>
      </div>
    </q-card-section>

    <q-list class="q-my-md q-mr-md q-ml-md">
      <q-item
        v-for="(id, index) in store.currentSheetPeople"
        :key="index"
        :class="index % 2 === 0 ? 'bg-grey-1' : 'bg-white'"
        v-show="
          store.currentSheet.people[id].active ||
          seeInactive ||
          payerIdx === index ||
          tr.debts[index] !== 0 ||
          debtors[index]
        "
        class="row no-wrap items-center"
      >
        <q-item-section
          side
          :style="`flex: 0 0 ${customCredits ? 25 : 5}%; text-align: left`"
          class="q-pa-none"
        >
          <q-radio
            v-if="!customCredits"
            v-model="payerIdx"
            :val="index"
            dense
          />
          <CurrencyInput
            v-else
            :model-value="tr.credits[index]"
            :currency="tr.currency"
            dense
            @update:model-value="
              (val) => {
                edited.clear();
                Transaction.setCustomCredit(tr, val, index, debtors);
              }
            "
          />
        </q-item-section>
        <q-item-section
          :style="`
    flex: 1 0 ${customCredits ? 25 : 50}%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  `"
        >
          <person-item :id="id" />
        </q-item-section>
        <q-item-section
          side
          style="flex: 0 0 5%; text-align: center; margin-right: 6px"
        >
          <q-checkbox v-model="debtors[index]" dense />
        </q-item-section>
        <q-item-section side style="flex: 0 0 35%">
          <CurrencyInput
            :model-value="tr.debts[index]"
            :currency="tr.currency"
            dense
            :readonly="!debtors[index]"
            @update:model-value="
              (val) =>
                Transaction.setCustomDebt(
                  tr,
                  val,
                  index,
                  debtors,
                  edited,
                  youIdx,
                )
            "
            :bg-color="edited.has(index) ? 'green-1' : ''"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/store.js';
import { useQuasar } from 'quasar';
import PeopleDropdown from 'src/components/PeopleDropdown.vue';
import PersonItem from 'src/components/PersonItem.vue';
import CurrencyInput from 'src/components/CurrencyInput.vue';
import CurrencyDropdown from 'src/components/CurrencyDropdown.vue';
import TwoPeopleSplitRow from 'src/components/TwoPeopleSplitRow.vue';
import Transaction from 'src/models/transaction';
import { ref, computed, onMounted, watch } from 'vue';

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const tr = ref(store.getEditableTransaction());
const seeInactive = ref(false);
const nameInput = ref(null);
const edited = new Set();

const debtors = ref(Transaction.debtors(tr.value));

onMounted(() => {
  nameInput.value?.focus();
});

const youIdx = store.currentSheetPeople.findIndex(
  (item) => item === store.user.id,
);

const credit = computed({
  get: () => Transaction.credit(tr.value),
  set: (newValue) => {
    if (newValue === Transaction.credit(tr.value)) return;
    customCredits.value = false;
    edited.clear();
    Transaction.setCredit(
      tr.value,
      newValue,
      payerIdx.value >= 0 ? payerIdx.value : youIdx,
      debtors.value,
    );
  },
});

const payerIdx = computed({
  get: () => Transaction.payerIdx(tr.value, youIdx),
  set: (newValue) => {
    if (newValue === Transaction.payerIdx(tr.value, youIdx)) return;
    Transaction.setCredit(
      tr.value,
      credit.value,
      newValue,
      debtors.value,
      edited,
    );
  },
});

const customCredits = ref(payerIdx.value < 0);

const payer = computed({
  get: () => store.personIdx2Id(payerIdx.value) || '',
  set: (newValue) => {
    if (newValue === store.personIdx2Id(payerIdx.value)) return;
    edited.clear();
    payerIdx.value = store.personId2Idx(newValue);
  },
});

watch(
  debtors,
  (newDebtors) => {
    edited.clear();
    Transaction.split(tr.value, newDebtors);
  },
  { deep: true },
);

const debtorIdx = computed({
  get: () => {
    const idx = debtors.value.findIndex((d) => d);
    return debtors.value.filter((d) => d).length === 1 ? idx : -1;
  },
  set: (newIdx) => {
    if (newIdx < 0 || newIdx >= debtors.value.length) return;

    // compute oldIdx directly
    let oldIdx = debtors.value.findIndex((d) => d);
    if (debtors.value.filter((d) => d).length !== 1) oldIdx = -1;

    if (newIdx === oldIdx) return; // guard

    debtors.value = debtors.value.map((_, i) => i === newIdx);
  },
});

const debtor = computed({
  get: () => store.personIdx2Id(debtorIdx.value) || '',
  set: (newValue) => {
    if (newValue === store.personIdx2Id(debtorIdx.value)) return;
    debtorIdx.value = store.personId2Idx(newValue);
  },
});

const swapPayerDebtor = () => {
  if (debtorIdx.value === -1) return;
  if (payerIdx.value === -1) return;
  if (payerIdx.value === debtorIdx.value) return;

  [payerIdx.value, debtorIdx.value] = [debtorIdx.value, payerIdx.value];
};

const otherId = store.currentSheetPeople.find((item) => item !== store.user.id);
const otherIdx = store.currentSheetPeople.findIndex(
  (item) => item !== store.user.id,
);

const state2 = computed(() => {
  return Transaction.state(tr.value);
});

const splitFor2 = (idx) => {
  forceSetCredit = true;
  switch (idx) {
    case 0:
      debtors.value = [true, true];
      payerIdx.value = youIdx;
      break;
    case 1:
      debtors.value = youIdx === 0 ? [false, true] : [true, false];
      payerIdx.value = youIdx;
      break;
    case 2:
      debtors.value = [true, true];
      payerIdx.value = otherIdx;
      break;
    case 3:
      debtors.value = youIdx === 1 ? [false, true] : [true, false];
      payerIdx.value = otherIdx;
      break;
    default:
      return;
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

// const payer = computed({
//   get: () => store.personIdx2Id(payerIdx.value) || '',
//   set: (newValue) => {
//     if (newValue === store.personId2Idx(newValue)) return;
//     payerIdx.value = store.personId2Idx(newValue);
//   },
// });

// const debtorIdx = computed({
//   get: () => Transaction.debtorIdx(tr.value, youIdx),
//   set: (newValue) => {
//      if (!forceSetCredit && newValue === Transaction.debtorIdx(tr.value, youIdx)) return;
//     Transaction.setCredit(tr.value, credit.value, newValue, debtors.value);
//     forceSetCredit = false;
//   },
// });

// const payer = computed({
//   get: () => store.personIdx2Id(payerIdx.value) || '',
//   set: (newValue) => {
//     if (newValue === store.personId2Idx(newValue)) return;
//     payerIdx.value = store.personId2Idx(newValue);
//   },
// });

// const debtor = computed({
//   get: () => {
//     const debtorIndexes = tr.value.debts
//       .map((debt, idx) => (debt.isDebtor ? idx : -1))
//       .filter((idx) => idx !== -1);

//     return debtorIndexes.length === 1
//       ? store.personIdx2Id(debtorIndexes[0])
//       : null;
//   },
//   set: (newValue) => {
//     const newIdx = store.personId2Idx(newValue);

//     tr.value.debts.forEach((debt, idx) => {
//       debt.isDebtor = idx === newIdx;
//     });
//     autoSplit();
//   },
// });

// const customSplit = (index) => {
//   edited.value.add(index);
//   split();
// };

// const autoSplit = () => {
//   edited.value.clear();
//   split();
// };

// const split = () => {
//   const ans = Transaction.split(tr.value, edited.value);
//   if (ans === 1) {
//     $q.notify('The amount has been increased to match the sum of the shares.');
//   }

//   if (ans === 2) {
//     $q.notify('The amount has been decreased to match the sum of the shares.');
//   }
// };
</script>
