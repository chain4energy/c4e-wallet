<template>
  <div>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
  <DataTable
    :value="validators"
    dataKey="operator_address"
    selectionMode="multiple"
    :rowHover="true"
    :paginator="true" :rows="10"
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
        <h5 class="m-0">Validators</h5>
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </span>
      </div>
    </template>
    <template #empty>
      No validators found.
    </template>
    <template #loading>
      Loading customers data. Please wait.
    </template>
    <Column
      field="rank"
      header="Rank"
      :sortable="true"
    ></Column>
    <Column
      field="description.moniker"
      header="Name"
      :sortable="true"
    ></Column>
    <Column
      field="status"
      header="Status"
      :sortable="true"
    >
      <template #body="{data}">
        <span>{{toViewStatus(data.status)}}</span>
      </template>
    </Column>
    <Column
      field="votingPower"
      header="voting Power"
      :sortable="true"
    >
      <template #body="{data}">
        <span v-if="data.getVotingPower()">{{toFixedAm(data.getVotingPower(), 4)}}%</span>
        <span v-else>updating</span>
      </template>
    </Column>
    <Column
      field="stacked.amount"
      header="Your stake"
      :sortable="true"
      v-if="isLoggedIn "
    >
      <template #body="{data}">
        <span >{{toFixedAm(userStore.getDelegations.getAmountByValidator(data.operatorAddress), 4)}}</span>
        <!-- <span v-else>updating</span> -->
      </template>
    </Column>
    <Column field="operator_address">
      <template #body="{data}">
        <button class="btn__main" @click="checkBTN(data)">Manage</button>
      </template>
    </Column>
    <Column v-if="isLoggedIn">
      <template  #body="{data}">
        <button
          @click="onRowExpande(data)"
          v-if="userStore.getDelegations.getAmountByValidator(data.operatorAddress)!=='0'"   headerStyle="width: 4rem">open</button>
      </template>
    </Column>
    <template v-if="isLoggedIn" #expansion="{data}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>Your stacked</p>
          <p>{{toFixedAm(userStore.getDelegations.getAmountByValidator(data.operatorAddress), 4)}}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>Reward</p>
          <p>{{toFixedAm(userStore.getRewardList.getAmountByValidator(data.operatorAddress), 4)}}</p>
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
import { ValidatorsList } from "@/models/validators";
import { useTokensStore } from "@/store/tokens.store";


const props = defineProps({
  validators: {
    type: Object as PropType<Validator[]> || {},
  },
  expanded: {
    type: Boolean,
    required: true,
  }
});
const validatorsStore = useValidatorsStore();
const userStore = useUserStore()
const validators= computed(() => props.validators);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const popupOpened = ref(false);
const currentValidator = ref({})
// const rewardsFetched = computed(() => validatorsStore.getRewardsFetchetStatus);
// const stackingFetched = computed(() => validatorsStore.getStackingFetchResult);

function toFixedAm(amount: string, decimal: number) {
return parseFloat(amount).toFixed(decimal);
}

useTokensStore().fetchStakingPool()
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
  expandedRow.value = (expandedRow.value[0] === data) ? [{}] : [data]
}
function checkBTN(item: Validator){
  currentValidator.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

async function trsansactionSuccess(arg: string) {
  checkBTN();
  await useUserStore().logOut()
  await useUserStore().fetchAccountData()


  // useValidatorsStore().fetchValidators()
  //
}
const showPopupVal = ref(false);
const address = ref('');
function showPopup(valaddress : string) {
  showPopupVal.value = !showPopupVal.value;
  address.value = valaddress;
  useUserStore().fetchAccountData()
}

function toViewStatus (status: ValidatorStatus): string {
  switch (status) {
    case ValidatorStatus.Bonded:
      return 'Active';
    default:
      return 'Inactive';
  }
}
</script>

<style scoped lang="scss">
.btn__main{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px 13px;
  box-sizing: border-box;

  background: #FFFFFF;
  /* Primary/Secondary-Blue */

  border: 1px solid #27697F;
  border-radius: 24px;


  &:hover {
    background-color: #27697F;
    color: white;
  }

  &:active {
    transform: translateY(2px);
  }
}
</style>
