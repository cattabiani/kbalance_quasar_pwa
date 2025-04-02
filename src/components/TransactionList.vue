<template>
  <q-list>
    <q-slide-item
      v-for="(id, index) in transactionList"
      :key="id"
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
          <q-item-label>
            {{ Transaction.name(transactions[id]) }}
          </q-item-label>
          <q-item-label caption>
            {{ store.getName(store.personId2Idx(transactions[id].payer)) }}
            paid
            {{
              Utils.displayCurrency(
                transactions[id].currency,
                transactions[id].amount,
              )
            }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label
            caption
            v-if="Transaction.position(transactions[id], selectedPersonIdx) > 0"
            style="color: green"
          >
            {{ store.getName(selectedPerson) }} lent
          </q-item-label>
          <q-item-label
            caption
            v-if="Transaction.position(transactions[id], selectedPersonIdx) < 0"
            style="color: red"
          >
            {{ store.getName(selectedPerson) }} borrowed
          </q-item-label>
          <q-item-label
            v-if="
              Transaction.position(transactions[id], selectedPersonIdx) === 0
            "
          >
            {{
              selectedPersonIdx !== transactions[id].payer
                ? 'Not Involved'
                : 'Personal'
            }}
          </q-item-label>
          <q-item-label
            v-else
            :style="{
              color:
                Transaction.position(transactions[id], selectedPersonIdx) >= 0
                  ? 'green'
                  : 'red',
            }"
          >
            {{
              Utils.displayCurrency(
                transactions[id].currency,
                Math.abs(
                  Transaction.position(transactions[id], selectedPersonIdx),
                ),
              )
            }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-slide-item>
  </q-list>
</template>

<script setup>
import Utils from 'src/utils/utils';
import Transaction from 'src/models/transaction';
import { useStore } from 'src/stores/store';
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
});

const selectedPersonIdx = computed(() =>
  store.personId2Idx(props.selectedPerson),
);

const transactionList = computed(() => {
  return Transaction.getTransactionList(props.transactions);
});

const emit = defineEmits(['edit', 'remove']);

const editTransaction = (id) => {
  emit('edit', id);
};

const removeTransaction = ({ reset }, id) => {
  emit('remove', () => reset(), id); // Emit id and call finalize after removal
};
</script>
