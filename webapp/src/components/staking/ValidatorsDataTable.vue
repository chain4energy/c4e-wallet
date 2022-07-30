<template>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
  <DataTableWrapper :data-key="'operator_address'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" @row-click="onRowClick">
    <template v-slot:empty>{{ $t("STAKING_VIEW.NO_VALIDATORS") }}</template>
    <template #header>
      <div style="display: flex; justify-content: space-between">
        <h5 class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
                <i class="pi pi-times-circle" @click="filters['global'].value = ''"/>
             </span>
      </div>
    </template>
    <template v-slot:columns>
      <Column field="rank" :header="$t(`STAKING_VIEW.TABLE_HEADERS.RANK`)" :sortable="true"></Column>
      <Column field="description.moniker" :header="$t(`STAKING_VIEW.TABLE_HEADERS.NAME`)" :sortable="true"></Column>
      <Column field="status" :header="$t(`STAKING_VIEW.TABLE_HEADERS.STATUS`)" :sortable="true">
        <template #body="{data}">
          <span>{{ data.viewStatus }}</span>
        </template>
      </Column>
      <Column field="commission.rate" header="Commission" :sortable="true" sortField="commission.rate">
        <template #body="{data}">
          <span>{{ data.commission.rateViewPercentage }}%</span> <!-- TODO create function converting to pecentage -->
        </template>
      </Column>
      <Column field="votingPower" :header="$t(`STAKING_VIEW.TABLE_HEADERS.VOTING_POWER`)" :sortable="true" sortField="tokens">
        <template #body="{data}">
          <span v-if="data.votingPower">{{ data.votingPowerViewPercentage }}%</span> 
          <span v-else>updating</span>
        </template>
      </Column>
      <Column :header="$t(`STAKING_VIEW.TABLE_HEADERS.STAKE`)" :sortable="true" v-if="isLoggedIn" sortField="delegatedAmount">
        <template #body="{data}">
          <span>{{ data.delegatedViewAmount }}</span>
          <!-- <span v-else>updating</span> -->
        </template>
      </Column>
      <Column field="operator_address">
        <template #body="{data}">
          <Button @click="checkBTN(data)">{{ $t(`STAKING_VIEW.TABLE_BUTTONS.MANAGE_BTN`) }}</Button>
        </template>
      </Column>

      <Column v-if="isLoggedIn">
        <template #body="{data}">
          <Button @click="onRowExpand(data)" v-if="isValidatorRowExpandable(data)" headerStyle="width: 4rem" :label=" data.operatorAddress == expandedRow[0]?.operatorAddress ? 'Close' : 'Open'"></Button>
        </template>
      </Column>

    </template>
    <template v-slot:expanded-columns="{expandedData}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>{{ $t(`STAKING_VIEW.TABLE_EXPANDED.UNSTAKING`) }}</p>
          <p>{{ expandedData.data.undelegatingViewAmount }}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>{{ $t(`STAKING_VIEW.TABLE_EXPANDED.REWARDS`) }}</p>
          <p>{{ expandedData.data.rewardsViewAmount }}</p> <!-- TODONUMBER -->
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
import StackingPopup from "@/components/staking/StackingPopup.vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";

const popupOpened = ref(false);
const currentValidator = ref({})

const props = defineProps<{
  validators: Array<Validator>
}>();

// const props = defineProps({
//   validators: {
//     type: Array<Validator>,
//     required: true
//   }
// });
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref(Array<Validator>());

async function trsansactionSuccess(arg: string) {
  //close popup
  popupOpened.value = !popupOpened.value;

  // useUserStore().reconectAcc()
}

function checkBTN(item: Validator){
  currentValidator.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

// function toFixedAm(amount: number, decimal: number) {
//   return amount.toFixed(decimal);
// }



function createEagerLoadingConfig(): EagerLoadingConfig<Validator>{
  const config = new EagerLoadingConfig<Validator>(props.validators as Validator[]);
  config.setFilters(filters.value);
  return config;
}

function onRowExpand(data: Validator) {
  expandedRow.value = (expandedRow.value[0] === data) ? [] : [data]
}

function onRowClick(event: any) {
  if (isValidatorRowExpandable(event.data)) {
    onRowExpand(event.data);
  }
}

function isValidatorRowExpandable(data: Validator):boolean {
  return data.delegatedAmount !== 0n;
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
