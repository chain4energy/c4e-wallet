<template>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
  <DataTableWrapper :data-key="'operator_address'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" >
    <template v-slot:empty>{{ $t("STACKING_VIEW.NO_VALIDATORS") }}</template>
    <template #header>
      <div style="display: flex; justify-content: space-between">
        <h5 class="m-0">{{ $t("STACKING_VIEW.VALIDATORS") }}</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
                <i class="pi pi-times-circle" @click="filters['global'].value = ''"/>
             </span>
      </div>
    </template>
    <template v-slot:columns>
      <Column field="rank" :header="$t(`STACKING_VIEW.TABLE_HEADERS.RANK`)" :sortable="true"></Column>
      <Column field="description.moniker" :header="$t(`STACKING_VIEW.TABLE_HEADERS.NAME`)" :sortable="true"></Column>
      <Column field="status" :header="$t(`STACKING_VIEW.TABLE_HEADERS.STATUS`)" :sortable="true">
        <template #body="{data}">
          <span>{{ toViewStatus(data.status) }}</span>
        </template>
      </Column>
      <Column field="votingPower" :header="$t(`STACKING_VIEW.TABLE_HEADERS.VOTING_POWER`)" :sortable="true" sortField="tokens">
        <template #body="{data}">
          <span v-if="data.votingPower">{{ toFixedAm(data.votingPower, 4) }}%</span>
          <span v-else>updating</span>
        </template>
      </Column>
      <Column field="stacked.amount"  :header="$t(`STACKING_VIEW.TABLE_HEADERS.YOUR_STAKE`)" :sortable="true" v-if="isLoggedIn" sortField="delegatedAmount">
        <template #body="{data}">
          <span>{{ toFixedAm(data.delegatedAmount, 4) }}</span>
          <!-- <span v-else>updating</span> -->
        </template>
      </Column>
      <Column field="operator_address">
        <template #body="{data}">
          <Button class="btn__main" @click="checkBTN(data)">{{ $t(`STACKING_VIEW.TABLE_BUTTONS.MANAGE_BTN`) }}</Button>
        </template>
      </Column>

      <Column v-if="isLoggedIn">
        <template #body="{data}">
          <Button @click="onRowExpand(data)" v-if="data.delegatedAmount!=='0'" headerStyle="width: 4rem" :label=" data.operatorAddress == expandedRow[0]?.operatorAddress ? 'Close' : 'Open'"></Button>
        </template>
      </Column>

    </template>
    <template v-slot:expanded-columns="{expandedData}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>Your stacked</p>
          <p>{{toFixedAm(expandedData.data.delegatedAmount, 4)}}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>Reward</p>
          <p>{{toFixedAm(expandedData.data.rewardsAmount, 4)}}</p>
        </div>
      </div>
    </template>
<!--    <template v-slot:paginatorstart></template>-->
  </DataTableWrapper>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {Validator, ValidatorStatus} from "@/models/store/validator";
import {useUserStore} from "@/store/user.store";
import StackingPopup from "@/components/stacking/StackingPopup.vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";

const popupOpened = ref(false);
const currentValidator = ref({});

const props = defineProps({
  validators: {
    type: Array,
    required: true
  }
});
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref(Array<Validator>());

async function trsansactionSuccess() {
  //close popup
  popupOpened.value = !popupOpened.value;

  useUserStore().reconnectAcc();
}

function checkBTN(item: Validator){
  currentValidator.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

function toFixedAm(amount: string, decimal: number) {
  return parseFloat(amount).toFixed(decimal);
}

function toViewStatus(status: ValidatorStatus): string {
  switch (status) {
    case ValidatorStatus.Bonded:
      return 'Active';
    default:
      return 'Inactive';
  }
}

function createEagerLoadingConfig(): EagerLoadingConfig<Validator>{
  const config = new EagerLoadingConfig<Validator>(props.validators as Validator[]);
  config.setFilters(filters.value);
  return config;
}

function onRowExpand(data: Validator) {
  expandedRow.value = (expandedRow.value[0] === data) ? [] : [data];
}

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

</script>

<style scoped>

</style>
