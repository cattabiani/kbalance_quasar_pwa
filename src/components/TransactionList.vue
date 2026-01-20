<template>
  <div>
    <q-infinite-scroll @load="loadMore" :offset="300" :disable="isFinished">
      <template v-for="(id, index) in visibleTransactions" :key="id">
        <q-item
          v-if="getDividerLabel(index)"
          dense
          dark
          class="bg-secondary text-bold text-white justify-center"
        >
          {{ getDividerLabel(index) }}
        </q-item>
        <q-slide-item
          clickable
          :class="index % 2 === 0 ? 'bg-grey-3' : 'bg-white'"
          @click="editTransaction(id)"
          @left="(event) => removeTransaction(event, id)"
          left-color="red"
          read-only
        >
          <template v-slot:left v-if="!disableRemove">
            <q-icon name="delete" />
          </template>
          <q-item>
            <q-card flat bordered class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm">
              <q-card-section
                class="column q-pa-none flex justify-center items-center"
              >
                <div>{{ Utils.getMonth(transactions[id].timestamp) }}</div>
                <div>{{ Utils.getDay(transactions[id].timestamp) }}</div>
              </q-card-section>
            </q-card>

            <q-item-section>
              <q-item-label
                :class="{ 'text-grey': store.pendingTransactionIds.has(id) }"
              >
                {{ transactions[id].name || 'New Transaction' }}
              </q-item-label>
              <q-item-label caption>
                {{ payerLabel(transactions[id]) }}
                <CurrencyDisplay
                  :currency="transactions[id].currency"
                  :amount="Transaction.credit(transactions[id])"
                  :reference-currency="store.referenceCurrency"
                  :converted-amount="
                    store.convertCurrency(
                      Transaction.credit(transactions[id]),
                      transactions[id].currency,
                      store.referenceCurrency,
                    )
                  "
                  inline-conversion
                />
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label
                caption
                v-if="
                  Transaction.position(transactions[id], selectedPersonIdx) > 0
                "
                style="color: green"
              >
                {{ store.getName(selectedPerson) }} lent
              </q-item-label>
              <q-item-label
                caption
                v-if="
                  Transaction.position(transactions[id], selectedPersonIdx) < 0
                "
                style="color: red"
              >
                {{ store.getName(selectedPerson) }} borrowed
              </q-item-label>
              <q-item-label
                v-if="
                  Transaction.position(transactions[id], selectedPersonIdx) ===
                  0
                "
              >
                {{
                  selectedPersonIdx !== Transaction.payerIdx(transactions[id])
                    ? 'Not Involved'
                    : 'Personal'
                }}
              </q-item-label>
              <q-item-label v-else>
                <CurrencyDisplay
                  :currency="transactions[id].currency"
                  :amount="
                    Math.abs(
                      Transaction.position(transactions[id], selectedPersonIdx),
                    )
                  "
                  :color="
                    Transaction.position(transactions[id], selectedPersonIdx) >=
                    0
                      ? 'green'
                      : 'red'
                  "
                  :reference-currency="store.referenceCurrency"
                  :converted-amount="
                    store.convertCurrency(
                      Math.abs(
                        Transaction.position(
                          transactions[id],
                          selectedPersonIdx,
                        ),
                      ),
                      transactions[id].currency,
                      store.referenceCurrency,
                    )
                  "
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import Utils from 'src/utils/utils';
import Transaction from 'src/models/transaction';
import { useStore } from 'src/stores/store';
import CurrencyDisplay from 'src/components/CurrencyDisplay.vue';
import { ref, watch, computed } from 'vue';

const store = useStore();
const props = defineProps({
  transactions: {
    type: Object,
    required: true,
  },
  selectedPerson: {
    type: String,
    required: true,
  },
  disableRemove: {
    type: Boolean,
    default: false,
  },
  searchString: {
    type: String,
    default: null,
  },
});

const visibleTransactions = ref([]);
const itemsPerPage = 20;
const currentIndex = ref(0);
const startIndex = ref(0);

const transactionList = computed(() => {
  const search = (props.searchString || '').toLowerCase();
  const isNum = !isNaN(parseFloat(search));

  const list = Transaction.getTransactionList(props.transactions);

  return list.filter((id) => {
    const tr = props.transactions[id];
    if (isNum) return Transaction.searchString(tr).includes(search);

    return tr.name.toLowerCase().includes(search);
  });
});

const getDividerLabel = (visibleIndex) => {
  const index = startIndex.value + visibleIndex;
  if (index < 0 || index >= transactionList.value.length) return '';

  const idCurr = transactionList.value[index];
  const tCurr = props.transactions[idCurr].timestamp;

  let tPrev;
  if (index === 0) {
    tPrev = Date.now();
  } else {
    const idPrev = transactionList.value[index - 1];
    tPrev = props.transactions[idPrev].timestamp;
  }

  const monthPrev = Utils.getMonth(tPrev);
  const monthCurr = Utils.getMonth(tCurr);

  if (monthPrev === monthCurr) return '';

  const yearCurr = Utils.getYear(tCurr);
  return Utils.getMonth(tCurr, false) + ' ' + yearCurr;
};

const selectedPersonIdx = computed(() =>
  store.personId2Idx(props.selectedPerson),
);

const emit = defineEmits(['edit', 'remove']);

const editTransaction = (id) => {
  emit('edit', id);
};

const removeTransaction = ({ reset }, id) => {
  emit('remove', () => reset(), id); // Emit id and call finalize after removal
};

const loadMore = (index, done) => {
  const nextSlice = transactionList.value.slice(
    currentIndex.value,
    currentIndex.value + itemsPerPage,
  );

  // Update startIndex if this is the first load
  if (visibleTransactions.value.length === 0) {
    startIndex.value = currentIndex.value;
  }

  visibleTransactions.value.push(...nextSlice);
  currentIndex.value += itemsPerPage;
  done();
};

const isFinished = computed(
  () => currentIndex.value >= transactionList.value.length,
);

watch(transactionList, () => {
  visibleTransactions.value = [];
  currentIndex.value = 0;
  loadMore(0, () => {});
});

const payerLabel = (tr) => {
  const payers = Transaction.payerIdxs(tr);

  if (payers.length === 0) return '';
  if (payers.length === 1) {
    return `${store.getName(store.personIdx2Id(payers[0]))} paid`;
  }

  const first = store.getName(store.personIdx2Id(payers[0]));
  return `${first} + ${payers.length - 1} paid`;
};
</script>
