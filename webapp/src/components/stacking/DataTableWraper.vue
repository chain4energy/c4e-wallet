<template>
  <div>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
  <DataTable
    :value="validators"
    dataKey="rank"
    selectionMode="multiple"
    :rowHover="true"
    :paginator="true"
    :rows="10"
    :showGridlines="false"
    v-model:expandedRows="expandedRow"
    v-model:filters="filters"
    filterDisplay="menu"
    responsiveLayout="scroll"
    :globalFilterFields="[
      'description.moniker',
       'commission.commission_rates.rate',
       'votingPower',
       'status',
       'rewards'
      ]"
  >
    <template #header>
      <div style="display: flex; justify-content: space-between">
        <h5 class="m-0">{{ $t("STACKING_VIEW.VALIDATORS") }}</h5>
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </span>
      </div>
    </template>
    <template #empty>
      {{ $t("STACKING_VIEW.NO_VALIDATORS") }}
    </template>
    <template #loading>
      {{ $t("STACKING_VIEW.NO_VALIDATORS") }}
    </template>
    <Column
      field="rank"
      :header="$t(`STACKING_VIEW.TABLE_HEADERS.RANK`)"
      :sortable="true"
    ></Column>
    <Column
      field="description.moniker"
      :header="$t(`STACKING_VIEW.TABLE_HEADERS.NAME`)"
      :sortable="true"
    ></Column>
    <Column
      field="status"
      :header="$t(`STACKING_VIEW.TABLE_HEADERS.STATUS`)"
      :sortable="true"
    >
      <template #body="{data}">
        <span>{{toViewStatus(data.status)}}</span>
      </template>
    </Column>
    <Column
      sortField="tokens"
      :header="$t(`STACKING_VIEW.TABLE_HEADERS.VOTING_POWER`)"
      :sortable="true"
    >
      <template #body="{data}">
        <span v-if="data.votingPower">{{toFixedAm(data.votingPower, 4)}}%</span>
        <span v-else>updating</span>
      </template>
    </Column>
    <Column
      sortField="delegatedAmount"
      :header="$t(`STACKING_VIEW.TABLE_HEADERS.YOUR_STAKE`)"
      :sortable="true"
      v-if="isLoggedIn "
    >
      <template #body="{data}">
        <span >{{toFixedAm(data.delegatedAmount, 4)}}</span>
        <!-- <span v-else>updating</span> -->
      </template>
    </Column>
    <Column field="operator_address">
      <template #body="{data}">
        <Button @click="checkBTN(data)">{{ $t(`STACKING_VIEW.TABLE_BUTTONS.MANAGE_BTN`) }}</Button>
      </template>
    </Column>
    <Column v-if="isLoggedIn">
      <template  #body="{data}">
        <Button
          @click="onRowExpande(data)"
          v-if="data.delegatedAmount!=='0'"   headerStyle="width: 4rem">open</Button>
      </template>
    </Column>
    <template v-if="isLoggedIn" #expansion="{data}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>{{ $t(`STACKING_VIEW.TABLE_EXPANDED.STAKED`) }}</p>
          <p>{{toFixedAm(data.delegatedAmount, 4)}}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>{{ $t(`STACKING_VIEW.TABLE_EXPANDED.REWARDS`) }}</p>
          <p>{{toFixedAm(data.rewardsAmount, 4)}}</p>
        </div>
      </div>
    </template>
  </DataTable>
  </div>
</template>
<script setup lang="ts">
import { useValidatorsStore } from "@/store/validators.store";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import StackingPopup from '@/components/stacking/StackingPopup.vue';
import { computed, PropType, ref } from "vue";
import { useUserStore } from "@/store/user.store";
import { Validator, ValidatorStatus } from "@/models/store/validator";
import { useTokensStore } from "@/store/tokens.store";
import { useI18n } from "vue-i18n";


const props = defineProps({
  validators: {
    type: Object as PropType<Validator[]> || {},
  },
  expanded: {
    type: Boolean,
    required: true,
  }
});
const userStore = useUserStore();
const validators= computed(() => props.validators);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const popupOpened = ref(false);
const currentValidator = ref({});

function toFixedAm(amount: string, decimal: number) {
return parseFloat(amount).toFixed(decimal);
}

useTokensStore().fetchStakingPool();
const expandedRow = ref([{}]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'description.moniker': {
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  'commission.commission_rates.rate': {
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  votingPower: {
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  status: {
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  rewards: {
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
});
function onRowExpande(data: Validator) {
  expandedRow.value = (expandedRow.value[0] === data) ? [{}] : [data];
}
function checkBTN(item: Validator){
  currentValidator.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

async function trsansactionSuccess() {
  popupOpened.value = !popupOpened.value;
  useUserStore().reconectAcc();

}
const address = ref('');
const { t } = useI18n()
function toViewStatus (status: ValidatorStatus): string {
  switch (status) {
    case ValidatorStatus.Bonded:
      return t('STACKING_VIEW.VALIDATOR_STATUS.ACTIVE') ;
    default:
      return t('STACKING_VIEW.VALIDATOR_STATUS.INACTIVE');
  }
}
</script>

<style scoped lang="scss">

</style>
