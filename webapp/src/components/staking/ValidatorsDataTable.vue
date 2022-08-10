<template>
  <span>
    <StakingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
    <DataTableWrapper :data-key="'operator_address'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" @row-click="onRowClick" :paginator="false">
      <template v-slot:empty>{{ $t("STAKING_VIEW.NO_VALIDATORS") }}</template>
      <template #header>
        <div style="display: flex; justify-content: space-between">
          <h5 v-if="isValidatorsTable()" class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h5>
                <span v-if="isValidatorsTable()" class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
                  <i class="pi pi-times-circle" @click="filters['global'].value = ''"/>
              </span>
          <h5 v-if="isDelegationsTable()" class="m-0">{{ $t("STAKING_VIEW.USER_DELEGATIONS") }}</h5>
          <h5 v-if="isUndelegationsTable()" class="m-0">{{ $t("STAKING_VIEW.USER_UNDELEGATIONS") }}</h5>
        </div>


      </template>
      <template v-slot:columns>
        <Column v-if="isValidatorsTable()" field="rank" :header="$t(`STAKING_VIEW.TABLE.RANK`)" :sortable="true"></Column>
        <Column field="description.moniker" :header="$t(`STAKING_VIEW.TABLE.NAME`)" :sortable="true">
          <template #body="{data}">
            <ValidatorLogo :validator="data"></ValidatorLogo>
            <!-- <img v-if="data.description.pictureUrl" class="validator-image" :src="data.description.pictureUrl" width="50" height="50"/> -->
            <span>{{ data.description.moniker }}</span>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="status" :header="$t(`STAKING_VIEW.TABLE.STATUS`)" :sortable="true">
          <template #body="{data}">
            <span>{{ data.viewStatus }}</span>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="commission.rate" header="Commission" :sortable="true" sortField="commission.rate">
          <template #body="{data}">
            <span>{{ data.commission.rateViewPercentage }}%</span>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="votingPower" :header="$t(`STAKING_VIEW.TABLE.VOTING_POWER`)" :sortable="true" sortField="tokens">
          <template #body="{data}">
            <span v-if="data.votingPower">{{ data.votingPowerViewPercentage }}%</span> 
            <span v-else>updating</span>
          </template>
        </Column>
        <Column v-if="isDelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.STAKE`)" :sortable="true" sortField="delegatedAmount">
          <template #body="{data}">
            <span>{{ data.getDelegatedViewAmount() }}</span>
          </template>
        </Column>
        <Column v-if="isDelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.REWARDS`)" :sortable="true" sortField="rewardsAmountSort">
          <template #body="{data}">
            <span>{{ data.rewardsViewAmount }}</span>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING`)" :sortable="true" sortField="entry.amount">
          <template #body="{data}">
            <span>{{ data.entry.getViewAmount() }}</span>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING_COMPLETION`)" :sortable="true" sortField="entry.completionTime">
          <template #body="{data}">
            <span>{{ data.entry.completionTime }}</span>
          </template>
        </Column>
        <Column v-if="!isUndelegationsTable()" field="operator_address">
          <template #body="{data}">
            <Button class="outlined" @click="checkBTN(data)">
              <StakeManagementIcon icon="manage"/>
              {{ $t(`STAKING_VIEW.TABLE_BUTTONS.MANAGE_BTN`) }}
            </Button>
          </template>
        </Column>

        <Column v-if="isLoggedIn && !isUndelegationsTable()">
          <template #body="{data}">
            <span style="cursor: pointer" @click="onRowExpand(data)" v-if="isValidatorRowExpandable(data)">
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress != expandedRow[0]?.operatorAddress" name="ChevronRight" />
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress == expandedRow[0]?.operatorAddress" name="ChevronDown" />
            </span>
          </template>
        </Column>

      </template>
      <template  v-if="!isUndelegationsTable()" v-slot:expanded-columns="{expandedData}">
        <div style="display: flex; flex-direction: row;">
          <div style="display: flex; flex-direction: column; margin-right: 20px">
            <p>{{ $t(`STAKING_VIEW.TABLE.UNSTAKING`) }}</p>
            <p>{{ expandedData.data.undelegatingViewAmount }}</p>
          </div>
          <div style="display: flex; flex-direction: column">
            <p>{{ $t(`STAKING_VIEW.TABLE.REWARDS`) }}</p>
            <p>{{ expandedData.data.rewardsViewAmount }}</p> <!-- TODONUMBER -->
          </div>
        </div>
      </template>
  <!--    <template v-slot:paginatorstart></template>-->
    </DataTableWrapper>
  </span>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {Validator, ValidatorStatus} from "@/models/store/validator";
import {useUserStore} from "@/store/user.store";
import StakingPopup from "@/components/staking/StakingPopup.vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";
import ValidatorLogo from "../commons/ValidatorLogo.vue";
import StakeManagementIcon from "../commons/StakeManagementIcon.vue";
import { getUnstakings, ValidatorsDataTableType, ValidatorUnstaking } from "./ValidatorsDataTable";




// export type ValidatorsDataTableType = ValidatorsDataTableTypeEnum.VALIDATORS | ValidatorsDataTableTypeEnum.DELEGATIONS | ValidatorsDataTableTypeEnum.VALIDATORS;


const popupOpened = ref(false);
const currentValidator = ref({})

const props = defineProps<{
  type: ValidatorsDataTableType,
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

function isValidatorsTable() {
  return props.type === ValidatorsDataTableType.VALIDATORS;
}

function isDelegationsTable() {
  return props.type === ValidatorsDataTableType.DELEGATIONS;
}

function isUndelegationsTable() {
  return props.type === ValidatorsDataTableType.UNDELEGATIONS;
}


function createEagerLoadingConfig(): EagerLoadingConfig<Validator | ValidatorUnstaking>{
  const validatorsList = isUndelegationsTable() ? getUnstakings(props.validators) : props.validators;
  const config = new EagerLoadingConfig<Validator | ValidatorUnstaking>(validatorsList);
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
  return !isUndelegationsTable() && data.delegatedAmount !== 0n;
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
