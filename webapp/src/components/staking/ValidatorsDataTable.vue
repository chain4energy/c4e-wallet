<template>
  <span>
    <StakingPopup v-if="!isUndelegationsTable() && popupOpened" :validator="currentValidator" @success="transactionSuccess" @close="checkBTN" :redelegation-direction="getRedelegationDirection()"/>
    <DataTableWrapper :data-key="'operator_address'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" @row-click="onRowClick" :paginator="false">
      <template v-slot:empty>{{ $t("STAKING_VIEW.NO_VALIDATORS") }}</template>
      <template #header>
        <div>
          <span v-if="isValidatorsTable()" class="p-input-icon-left search-bar">
            <i class="pi pi-search" />
            <InputText style="width: 100%" type="text" v-model="filters['global'].value" placeholder="Search" />
            <i class="pi pi-times-circle" style="transform: translateX(-30px)" @click="filters['global'].value = ''"/>
          </span>
        </div>
      </template>
      <template v-slot:columns>
        <Column v-if="isValidatorsTable()" field="rank" :header="$t(`STAKING_VIEW.TABLE.RANK`)" :sortable="true">
          <template #body="{data}">
            <div class="rank">
              <div style="display: flex; flex-direction: column">
                <div :class="data.delegatedAmount > 0n ? '' : 'opacity-0'" style="display: flex; margin: 1px 0"><div class="badge-staking staked">{{$t(`STAKING_VIEW.INDICATOR.STAKE`)}}</div></div>
                <div :class="data.undelegatingAmount > 0n ? '' : 'opacity-0'" style="display: flex; margin: 1px 0"><div class="badge-staking unstaked">{{$t(`STAKING_VIEW.INDICATOR.UNSTAKING`)}}</div></div>
              </div>
              <span>{{data.rank}}</span>
            </div>
          </template>
        </Column>
        <Column field="description.moniker" :header="$t(`STAKING_VIEW.TABLE.NAME`)" :sortable="true">
          <template #body="{data}">
            <ValidatorLogo :validator="data"></ValidatorLogo>
            <span>{{ data.description.moniker }}</span>
          </template>
        </Column>
        <Column v-if="isValidatorsTable() || isDelegationsTable()" field="status" :header="$t(`STAKING_VIEW.TABLE.STATUS`)" :sortable="true">
          <template #body="{data}">
            <ValidatorStatusBadge :validator="data"/>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="commission.rate" header="Commission" :sortable="true" sortField="commission.rate">
          <template #body="{data}">
              <PercentsView :amount="data.commission.rate" :precision="2"></PercentsView>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="votingPower" :header="$t(`STAKING_VIEW.TABLE.VOTING_POWER`)" :sortable="true" sortField="tokens">
          <template #body="{data}">
            <div v-if="data.votingPower">
            <div v-if="data.votingPower < 0.05" class="commision">
              <div class="level-1" :style="'flex-basis:' + (data.votingPower * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="data.votingPower" :precision="2"></PercentsView>
            </div>
            <div v-if="data.votingPower >= 0.05 && data.votingPower < .10" class="commision">
              <div class="level-2" :style="'flex-basis:' + (data.votingPower * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="data.votingPower" :precision="2"></PercentsView>
            </div>
            <div v-if="data.votingPower >= .10 && data.votingPower < .25" class="commision">
              <div class="level-3" :style="'flex-basis:' + (data.votingPower * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="data.votingPower" :precision="2"></PercentsView>
            </div>
            <div v-if="data.votingPower >= .25" class="commision">
              <div class="level-4" :style="'flex-basis:' + (data.votingPower * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="data.votingPower" :precision="2"></PercentsView>
            </div>
            </div>
            <span v-else>updating</span>
          </template>
        </Column>
        <Column v-if="isDelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.STAKE`)" :sortable="true" sortField="delegatedAmount">
          <template #body="{data}">
            <CoinAmount :amount="new BigIntWrapper(data.delegatedAmount)" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isDelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.REWARDS`)" :sortable="true" sortField="rewardsAmountSort">
          <template #body="{data}">
            <CoinAmount :amount="data.rewardsAmount" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING`)" :sortable="true" sortField="entry.amount">
          <template #body="{data}">
            <CoinAmount :amount="data.entry.amount" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING_COMPLETION`)" :sortable="true" sortField="entry.completionTime">
          <template #body="{data}">

            <span><DateCommon :date="data.entry.getCompletionTimeDate()" /></span>
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

        <Column v-if="isLoggedIn && isValidatorsTable()">
          <template #body="{data}">
            <span style="cursor: pointer" @click="onRowExpand(data)" v-if="isValidatorRowExpandable(data)">
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress !== expandedRow[0]?.operatorAddress" name="ChevronRight" />
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress === expandedRow[0]?.operatorAddress" name="ChevronDown" />
            </span>
          </template>
        </Column>

      </template>
      <template  v-if="isValidatorsTable()" v-slot:expanded-columns="{expandedData}">
        <div class="flex-container-details">
          <div class="item">
            <div>{{ $t(`STAKING_VIEW.TABLE.STAKE`) }}</div>
            <CoinAmount :amount="new BigIntWrapper(expandedData.data.delegatedAmount)" :show-denom="true"/>
          </div>
          <div class="item">
            <div>{{ $t(`STAKING_VIEW.TABLE.UNSTAKING`) }}</div>
            <CoinAmount :amount="new BigIntWrapper(expandedData.data.undelegatingAmount)" :show-denom="true"/>
          </div>
          <div class="item">
            <div>{{ $t(`STAKING_VIEW.TABLE.REWARDS`) }}</div>
            <CoinAmount :amount="expandedData.data.rewardsAmount" :show-denom="true"/>
          </div>
        </div>
        <div v-if="expandedData.data.undelegatingEntries && expandedData.data.undelegatingEntries.length > 0">
          <div style="max-width: 500px;">
            <DataTableWrapper
              :useExternalGlobalFilter="false"
              :eager-loading-config="createValidatorUndelegationEntriesEagerLoadingConfig(expandedData.data.undelegatingEntries)"
              :paginator="false">
              <template #header>
                <h5 style="font-weight: bolder; margin-top: 20px; margin-bottom: -20px;">{{ $t("STAKING_VIEW.USER_UNDELEGATIONS") }}</h5>
              </template>
              <template v-slot:columns>
                <Column field="amount" header="Amount" style="width: 200px" :sortable="false">
                  <template #body="{data}">
                    <CoinAmount :amount="data.amount" :show-denom="true"/>
                  </template>
                </Column>
                <Column field="completionTime" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING_COMPLETION`)" :sortable="false">
                  <template #body="{data}">
                    <DateCommon :date="data.completionTime" />
                  </template>
                </Column>
              </template>
            </DataTableWrapper>
          </div>
        </div>
      </template>
    </DataTableWrapper>
  </span>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {Validator } from "@/models/store/validator";
import {useUserStore} from "@/store/user.store";
import StakingPopup from "@/components/staking/StakingPopup.vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";
import ValidatorLogo from "../commons/ValidatorLogo.vue";
import StakeManagementIcon from "../commons/StakeManagementIcon.vue";
import { getUnstakings, ValidatorsDataTableType, ValidatorUnstaking } from "@/components/staking/ValidatorsDataTable.ts";
import { RedelegationDirection } from "@/components/staking/StakingRedelegate.ts";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView";
import DateCommon from "@/components/commons/DateCommon.vue";
import ValidatorStatusBadge from "./ValidatorStatusBadge.vue";
import { UnbondingDelegationEntry } from "@/models/store/staking";
import {BigIntWrapper} from "@/models/store/common";

function getRedelegationDirection() {
  if (isValidatorsTable()) {
    return RedelegationDirection.FROM;
  }
  return RedelegationDirection.TO;

}

const popupOpened = ref(false);
const currentValidator = ref({});

const props = defineProps<{
  type: ValidatorsDataTableType,
  validators: Array<Validator>
}>();

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref(Array<Validator>());

async function transactionSuccess(arg: string) {
  popupOpened.value = !popupOpened.value;
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

function createValidatorUndelegationEntriesEagerLoadingConfig(entries: UnbondingDelegationEntry[]): EagerLoadingConfig<UnbondingDelegationEntry>{
  const config = new EagerLoadingConfig<UnbondingDelegationEntry>(entries);
  return config;
}


function createEagerLoadingConfig(): EagerLoadingConfig<Validator | ValidatorUnstaking>{
  const validatorsList = isUndelegationsTable() ? getUnstakings(props.validators) : props.validators;
  const config = new EagerLoadingConfig<Validator | ValidatorUnstaking>(validatorsList);
  config.setFilters(filters.value);
  return config
}

function onRowExpand(data: Validator) {
  expandedRow.value = (expandedRow.value[0] === data) ? [] : [data];
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

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.flex-container-details {
  display: flex;
  flex-direction: row;

  .item {
    display: flex;
    flex-direction: column;

    div {
      padding: 10px 10px 0 10px;
      margin: 0 10px;
      font-size: 1em;
      color: gray;
    }
  }
}

.validator-image {
  height: 2.5rem;
  min-height: 2.5rem;
  width: 2.5rem;
  min-width: 2.5rem;
}

.rank {
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
}
.badge-staking {
  height: 20px;
  transform: translateX(-100%);
  margin-right: -20px;
  padding: 2px 5px;
  font-size: 10px;
  box-sizing: border-box;

  &::after {
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid white;
    margin-left: -21.7px;
    content: '';
    float: right;
    position: absolute;
    right: -9.2px;
    transform: translateY(-2px);
  }
}

.staked {
  background: $primary-green-color;
  color: white;

  &::after {
    border-left: 10px solid $primary-green-color;
  }
}

.unstaked {
  background: grey;
  color: white;

  &::after {
    border-left: 10px solid grey;
  }
}


  .opacity-0 {
    opacity: 0;
  }

  .commision {
    width: 100%;
    box-sizing: border-box;
    height: 28px;
    border: 1px solid grey;
    border-radius: 15px;
    display: flex;
    overflow: hidden;
    position: relative;

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }
  }

  .level-border {
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    color: white;
    font-weight: bold;
  }

  .level-1 {
      background: $consumption-red;
      color: white;
    }

    .level-2 {
      background: $accents-light-warning;
      color: black;

    }

    .level-3 {
      background: $main-lighter-color;
      color: white;
    }

    .level-4 {
      background: $secondary-color;
      color: white;
    }

  .search-bar {
    width: 40%;
    float: right;
    transform: translateY(-200%);
    z-index: 1;
    margin-bottom: -200%;
  }

  .p-datatable .p-datatable-header {
    margin-bottom: -50px;
  }

  .p-datatable-wrapper {
    margin-top: -40px !important;
    transform: translateY(-40px) !important;
  }

  @media screen and (max-width: 950px) {
    .search-bar {
      width: 100%;
      transform: none;
      z-index: 5;
      margin-bottom: 20px;
    }

    .p-datatable .p-datatable-header {
      margin-bottom: 0;
    }

    .p-datatable-wrapper {
      margin-top: 0 !important;
      transform: none !important;
    }
  }
</style>
