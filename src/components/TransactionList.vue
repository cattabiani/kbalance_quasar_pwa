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
        <div :ref="(el) => setItemRef(id, el)" :data-tr-id="id">
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
                    Transaction.position(transactions[id], selectedPersonIdx) >
                    0
                  "
                  style="color: green"
                >
                  {{ store.getName(selectedPerson) }} lent
                </q-item-label>
                <q-item-label
                  caption
                  v-if="
                    Transaction.position(transactions[id], selectedPersonIdx) <
                    0
                  "
                  style="color: red"
                >
                  {{ store.getName(selectedPerson) }} borrowed
                </q-item-label>
                <q-item-label
                  v-if="
                    Transaction.position(
                      transactions[id],
                      selectedPersonIdx,
                    ) === 0
                  "
                >
                  {{
                    selectedPersonIdx !==
                    Transaction.payerIdx(transactions[id])
                      ? 'Not Involved'
                      : 'Personal'
                  }}
                </q-item-label>
                <q-item-label v-else>
                  <CurrencyDisplay
                    :currency="transactions[id].currency"
                    :amount="
                      Math.abs(
                        Transaction.position(
                          transactions[id],
                          selectedPersonIdx,
                        ),
                      )
                    "
                    :color="
                      Transaction.position(
                        transactions[id],
                        selectedPersonIdx,
                      ) >= 0
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
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import Utils from 'src/utils/utils';
import Transaction from 'src/models/transaction';
import { useStore } from 'src/stores/store';
import CurrencyDisplay from 'src/components/CurrencyDisplay.vue';
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';

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
  disableEdit: {
    type: Boolean,
    default: false,
  },
  searchString: {
    type: String,
    default: null,
  },
  // Height (px) of the sticky header sitting above this list -- the
  // "topmost visible" transaction must clear this, not just y=0.
  topOffset: {
    type: Number,
    default: 0,
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

  const yearPrev = Utils.getYear(tPrev);
  const monthPrev = Utils.getMonth(tPrev);
  const yearCurr = Utils.getYear(tCurr);
  const monthCurr = Utils.getMonth(tCurr);

  if (yearPrev === yearCurr && monthPrev === monthCurr) return '';

  return Utils.getMonth(tCurr, false) + ' ' + yearCurr;
};

const selectedPersonIdx = computed(() =>
  store.personId2Idx(props.selectedPerson),
);

const emit = defineEmits(['edit', 'remove', 'cutoff']);

const editTransaction = (id) => {
  if (props.disableEdit) return;
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

// Tracks which transaction is topmost in the viewport, so the parent can
// treat it as the "as of" cutoff for historical balances: the first
// transaction (in newest-first order) that's still more than half visible
// below the sticky header. Testing the row's midpoint (rather than its top
// or bottom edge) avoids flipping on the very first covered pixel (too
// twitchy) while still switching promptly rather than waiting for the row
// to be entirely gone (feels laggy).
const itemRefs = new Map();
const setItemRef = (id, el) => {
  if (el) itemRefs.set(id, el);
  else itemRefs.delete(id);
};

const topmostVisibleId = ref(null);

const recomputeTopmostVisibleId = () => {
  for (const id of visibleTransactions.value) {
    const el = itemRefs.get(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const midpoint = (rect.top + rect.bottom) / 2;
      if (midpoint >= props.topOffset) {
        topmostVisibleId.value = id;
        return;
      }
    }
  }
  topmostVisibleId.value =
    visibleTransactions.value[visibleTransactions.value.length - 1] ?? null;
};

let scrollScheduled = false;
const onScroll = () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => {
    scrollScheduled = false;
    recomputeTopmostVisibleId();
  });
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

watch(
  topmostVisibleId,
  (id) => {
    emit('cutoff', {
      id,
      timestamp: id ? (props.transactions[id]?.timestamp ?? null) : null,
    });
  },
  { immediate: true },
);

// Deliberately NOT watching topOffset: the sticky header's height depends
// on the summary, which depends on the cutoff, which depends on this
// computation -- reacting to every resize closes that loop and makes the
// cutoff jitter as the header grows/shrinks mid-scroll. Only actual scroll
// events (and newly-loaded items) should trigger a recompute; a stale
// topOffset briefly during a resize is a minor, harmless lag.
watch(
  () => visibleTransactions.value.length,
  async () => {
    await nextTick();
    recomputeTopmostVisibleId();
  },
  { flush: 'post' },
);

const payerLabel = (tr) => {
  const payers = Transaction.payerIdxs(tr, store.currentSheetPeople.length);

  if (payers.length === 0) return '';
  if (payers.length === 1) {
    return `${store.getName(store.personIdx2Id(payers[0]))} paid`;
  }

  const first = store.getName(store.personIdx2Id(payers[0]));
  return `${first} + ${payers.length - 1} paid`;
};
</script>
