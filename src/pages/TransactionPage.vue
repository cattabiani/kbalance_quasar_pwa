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
          label="Transaction Name"
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
          v-model="tr.amount"
          :currency="tr.currency"
          style="flex: 1"
          label="Amount"
          @update:model-value="autoSplit()"
        />
      </q-card-section>
    </q-card>
    <q-card class="q-my-md q-mr-md q-ml-md">
      <q-card-section class="column items-center" v-if="tr.debts.length === 2">
        <q-btn-dropdown class="full-width">
          <template v-slot:label>
            <TwoPeopleSplitRow
              :split="state2 === 1"
              :payer="tr.payer"
              :you-idx="youIdx"
              :other-name="store.getName(otherId)"
              :currency="tr.currency"
              :amount="tr.amount"
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
                  :amount="tr.amount"
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
                  :amount="tr.amount"
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
                  :amount="tr.amount"
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
                  :amount="tr.amount"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-card-section
        class="row justify-center items-center no-wrap"
        v-if="tr.debts.length > 2"
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
    <!-- <q-card class="q-my-md q-mr-md q-ml-md q-mb-md"> -->
    <q-card-section>
      <div class="row text-bold items-center no-wrap">
        <!-- radio header -->
        <div style="flex: 0 0 5%; text-align: left" class="q-ml-sm q-mr-md">
          Payer
        </div>

        <!-- name header -->
        <div style="flex: 1 0 30%; text-align: left">Person</div>

        <!-- checkbox header -->
        <div style="flex: 0 0 10%; text-align: center">Owes</div>

        <!-- value header -->
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
          tr.payer === index ||
          tr.debts[index].owedAmount !== 0 ||
          tr.debts[index].isDebtor
        "
        class="row no-wrap items-center"
      >
        <!-- radio left -->
        <q-item-section side style="flex: 0 0 5%; text-align: left">
          <q-radio
            v-model="tr.payer"
            :val="index"
            @update:model-value="autoSplit()"
            dense
          />
        </q-item-section>

        <!-- name flexible -->
        <q-item-section
          style="
            flex: 1 0 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
          "
        >
          <person-item :id="id" />
        </q-item-section>

        <!-- checkbox right -->
        <q-item-section
          side
          style="flex: 0 0 5%; text-align: center; margin-right: 6px"
        >
          <q-checkbox
            v-model="tr.debts[index].isDebtor"
            @update:model-value="autoSplit()"
            dense
          />
        </q-item-section>

        <!-- value right -->
        <q-item-section side style="flex: 0 0 35%">
          <CurrencyInput
            v-model="tr.debts[index].owedAmount"
            :currency="tr.currency"
            dense
            style="width: auto; min-width: 4ch; border-color: green"
            @update:model-value="customSplit(index)"
            :readonly="!tr.debts[index].isDebtor"
            :bg-color="edited.has(index) ? 'green-1' : ''"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <!-- </q-card> -->
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
import { ref, computed, onMounted } from 'vue';

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const tr = ref(store.getEditableTransaction());
const seeInactive = ref(false);
const nameInput = ref(null);
const edited = ref(new Set());

onMounted(() => {
  nameInput.value?.focus();
});

const payer = computed({
  get: () => store.personIdx2Id(tr.value.payer) || '',
  set: (newValue) => {
    tr.value.payer = store.personId2Idx(newValue);
  },
});

const debtor = computed({
  get: () => {
    const debtorIndexes = tr.value.debts
      .map((debt, idx) => (debt.isDebtor ? idx : -1))
      .filter((idx) => idx !== -1);

    return debtorIndexes.length === 1
      ? store.personIdx2Id(debtorIndexes[0])
      : null;
  },
  set: (newValue) => {
    const newIdx = store.personId2Idx(newValue);

    tr.value.debts.forEach((debt, idx) => {
      debt.isDebtor = idx === newIdx;
    });
    autoSplit();
  },
});

const swapPayerDebtor = () => {
  if (debtor.value !== null) {
    if (payer.value === debtor.value) return;
    const payerIdx = store.personId2Idx(payer.value);
    const debtorIdx = store.personId2Idx(debtor.value);

    tr.value.payer = debtorIdx;
    tr.value.debts.forEach((debt, idx) => {
      debt.isDebtor = idx === payerIdx;
    });
    autoSplit();
  }
};

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
  autoSplit();
};

const customSplit = (index) => {
  edited.value.add(index);
  split();
};

const autoSplit = () => {
  edited.value.clear();
  split();
};

const split = () => {
  const ans = Transaction.split(tr.value, edited.value);
  if (ans === 1) {
    $q.notify('The amount has been increased to match the sum of the shares.');
  }

  if (ans === 2) {
    $q.notify('The amount has been decreased to match the sum of the shares.');
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
