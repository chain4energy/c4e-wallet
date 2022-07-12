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
      v-if="useUserStore().isLoggedIn && useValidatorsStore().getStackingFetchResult"
      header=""
    >
      <template #body="data">
        <p v-if="data.stacked.amount!=='0'">stacked</p>
        <p v-else>updating</p>
      </template>

    </Column>
<!--    <Column-->
<!--      field="stacked"-->
<!--      v-if="useUserStore().isLoggedIn && useValidatorsStore().getStackingFetchResult"-->
<!--    >-->
<!--      <template v-if="useUserStore().isLoggedIn && useValidatorsStore().getStackingFetchResult"-->
<!--                #body="data">-->
<!--        <p v-if="data.stacked.amount !=='0'">stacked</p>-->
<!--      </template>-->
<!--    </Column>-->
    <Column
      field="id"
      header="Rank"
      :sortable="true"
    >
<!--      <template v-if="useUserStore().isLoggedIn && useValidatorsStore().getStackingFetchResult" #body="{data}">-->
<!--        <p :class="data?.stacked.amount!=='0' ? 'rank': '' ">{{data.id}}</p>-->
<!--      </template>-->
    </Column>
    <Column
      field="description.moniker"
      header="name"
      :sortable="true"
    ></Column>
    <Column
      field="status"
      header="Status"
      :sortable="true"
    ></Column>
    <Column
      field="votingPower"
      header="voting Power"
      :sortable="true"
    >
      <template #body="{data}">
        <span v-if="data.votingPower">{{toFixedAm(data.votingPower, 4)}}%</span>
        <span v-else-if="!data.votingPower">updating</span>
      </template>
    </Column>
    <Column
      field="stacked.amount"
      header="Your stake"
      :sortable="true"
      v-if="isLoggedIn && rewardsFetched && stackingFetched"
    >
      <template #body="{data}">
        <span v-if="useValidatorsStore().getStackingFetchResult">{{toFixedAm(data.stacked.amount, 4)}}</span>
        <span v-else>updating</span>
      </template>
    </Column>
    <Column field="operator_address">
      <template #body="{data}">
        <button class="btn__main" @click="checkBTN(data)">Manage</button>
      </template>
    </Column>
    <Column v-if="rewardsFetched && stackingFetched">
      <template  #body="{data}">
        <button
          @click="onRowExpande(data)"
          v-if="data.stacked.amount!=='0'"   headerStyle="width: 4rem">open</button>
      </template>
    </Column>
    <template v-if="rewardsFetched && stackingFetched" #expansion="{data}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>Your stacked</p>
          <p>{{toFixedAm(data.stacked.amount, 4)}}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>Reward</p>
          <p>{{toFixedAm(data.rewards.amount, 4)}}</p>
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
import { Validator } from "@/models/validator";
import { ValidatorsList } from "@/models/validators";


const props = defineProps({
  validators: {
    type: Object as PropType<ValidatorsList> || {},
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
const rewardsFetched = computed(() => validatorsStore.getRewardsFetchetStatus);
const stackingFetched = computed(() => validatorsStore.getStackingFetchResult);

function toFixedAm(amount: string, decimal: number) {
return parseFloat(amount).toFixed(decimal);
}
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
.rank{
  &:after{
    position: absolute;
    margin-left: -70px;
    content: 'stacked';
    z-index: 20;
    background-color: #42b983;
  }
}
</style>
