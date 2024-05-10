<template>
  <span>
    <BoostPopup :visible="popupOpened" :boost="currentBoost" @close="popupOpened = false;"/>
    <DataTableWrapper :data-key="'pool_description'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" @row-click="onRowClick" :paginator="false">
<!--      <template v-slot:empty>{{ $t("STAKING_VIEW.NO_VALIDATORS") }}</template>-->
      <template v-slot:empty>BOOST</template>
<!--      <template #header>-->
<!--        <div>-->
<!--          <span v-if="isValidatorsTable()" class="p-input-icon-left search-bar">-->
<!--            <i class="pi pi-search" />-->
<!--            <InputText style="width: 100%" type="text" v-model="filters['global'].value" placeholder="Search" />-->
<!--            <i class="pi pi-times-circle" style="transform: translateX(-30px)" @click="filters['global'].value = ''"/>-->
<!--          </span>-->
<!--        </div>-->
<!--      </template>-->
      <template v-slot:columns>
<!--        <Column field="description.moniker" :header="$t(`STAKING_VIEW.TABLE.NAME`)" :sortable="true">-->
        <Column header="Name" :sortable="false">
          <template #body="slotProps: {data: Boost}">
            <span class="p-column-title">Name</span>
<!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
            <span>{{ slotProps.data.pool_description }}</span>
          </template>
        </Column>
        <Column header="Lock period" :sortable="false">
          <template #body="slotProps: {data: Boost}">
            <span class="p-column-title">Lock period</span>
            <!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
            <span>{{ slotProps.data.lock_period }} days</span>
          </template>
        </Column>
        <Column header="Reward (APY)" :sortable="false">
          <template #body="slotProps: {data: Boost}">
            <span class="p-column-title">Reward (APY)</span>
            <!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
            <span>{{ slotProps.data.apy }}%</span>
          </template>
        </Column>
<!--        <Column header="Boost" :sortable="false">-->
<!--          <template #body="{data}">-->
<!--            <span class="p-column-title">Boost</span>-->
<!--            &lt;!&ndash;            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>&ndash;&gt;-->
<!--            <span>{{ data.apy }}</span>-->
<!--          </template>-->
<!--        </Column>-->

        <Column header="Pool size" :sortable="false">
          <template #body="slotProps: {data: Boost}">
            <span class="p-column-title">Reward (APY)</span>
            <!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
<!--            <span>{{ data.base_tokens }}</span>-->
            <CoinAmount :amount="slotProps.data.base_tokens" :show-denom="true"/>
          </template>
        </Column>
<!--        <Column v-if="isValidatorsTable()" :header="$t(`STAKING_VIEW.TABLE.VOTING_POWER`)" :sortable="true" sortField="tokens">-->
        <Column header="Pool Usage">
          <template #body="slotProps: {data: Boost}">
            <CoinAmount :amount="slotProps.data.remaining_tokens" :show-tooltip="true" tooltip-only>
              <div v-if="slotProps.data.percentage_pool_usage">
                <div v-if="slotProps.data.percentage_pool_usage < 0.05" class="commision">
                  <div class="level-1" :style="'flex-basis:' + (slotProps.data.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="slotProps.data.percentage_pool_usage" :precision="2"></PercentsView>
                </div>
                <div v-if="slotProps.data.percentage_pool_usage >= 0.05 && slotProps.data.percentage_pool_usage < 0.10" class="commision">
                  <div class="level-2" :style="'flex-basis:' + (slotProps.data.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="slotProps.data.percentage_pool_usage" :precision="2"></PercentsView>
                </div>
                <div v-if="slotProps.data.percentage_pool_usage >= 0.10 && slotProps.data.percentage_pool_usage < 0.25" class="commision">
                  <div class="level-3" :style="'flex-basis:' + (slotProps.data.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="slotProps.data.percentage_pool_usage" :precision="2"></PercentsView>
                </div>
                <div v-if="slotProps.data.percentage_pool_usage >= 0.25" class="commision">
                  <div class="level-4" :style="'flex-basis:' + (slotProps.data.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="slotProps.data.percentage_pool_usage" :precision="2"></PercentsView>
                </div>
              </div>
              <span v-else>updating</span>
            </CoinAmount>
          </template>
        </Column>

        <Column header="Your contribution" :sortable="false">
          <template #body>
            <span class="p-column-title">Your contribution</span>
            <!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
            <span>100 C4E</span>
          </template>
        </Column>

        <Column header="Your reward" :sortable="false">
          <template #body="slotProps: {data: Boost}">
            <span class="p-column-title">Your reward</span>
            <!--            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.NAME`) }}</span>-->
            <span>{{ slotProps.data.apy }} C4E </span>
          </template>
        </Column>

        <!--
        <Column v-if="isLoggedIn && isValidatorsTable()">
          <template #body="{data}">
            <span style="cursor: pointer" @click="onRowExpand(data)" v-if="isValidatorRowExpandable(data)">
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress !== expandedRow[0]?.operatorAddress" name="ChevronRight" />
              <Icon @click="onRowExpand(data)" v-if="data.operatorAddress === expandedRow[0]?.operatorAddress" name="ChevronDown" />
            </span>
          </template>
        </Column>


        <Column v-if="isValidatorsTable() || isDelegationsTable()" field="status" :header="$t(`STAKING_VIEW.TABLE.STATUS`)" :sortable="true">
          <template #body="{data}">
            <span class="p-column-title">{{ $t(`STAKING_VIEW.TABLE.STATUS`) }}</span>
            <ValidatorStatusBadge :validator="data"/>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="commission.rate" header="Commission" :sortable="true" sortField="commission.rate">
          <template #body="{data}">
            <span class="p-column-title">Comission</span>
            <PercentsView :amount="data.commission.rate" :precision="2"></PercentsView>
          </template>
        </Column>
        <Column v-if="isValidatorsTable()" field="votingPower" :header="$t(`STAKING_VIEW.TABLE.VOTING_POWER`)" :sortable="true" sortField="tokens">
          <template #body="{data}">
            <span class="p-column-title">{{$t(`STAKING_VIEW.TABLE.VOTING_POWER`)}}</span>
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
            <span class="p-column-title">{{$t(`STAKING_VIEW.TABLE.STAKE`)}}</span>
            <CoinAmount :amount="new BigIntWrapper(data.delegatedAmount)" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isDelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.REWARDS`)" :sortable="true" sortField="rewardsAmountSort">
          <template #body="{data}">
            <span class="p-column-title">{{$t(`STAKING_VIEW.TABLE.REWARDS`)}}</span>
            <CoinAmount :amount="data.rewardsAmount" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING`)" :sortable="true" sortField="entry.amount">
          <template #body="{data}">
            <span class="p-column-title">{{$t(`STAKING_VIEW.TABLE.UNSTAKING`)}}</span>
            <CoinAmount :amount="data.entry.amount" :show-denom="true"/>
          </template>
        </Column>
        <Column v-if="isUndelegationsTable()" :header="$t(`STAKING_VIEW.TABLE.UNSTAKING_COMPLETION`)" :sortable="true" sortField="entry.completionTime">
          <template #body="{data}">
            <span class="p-column-title">{{$t(`STAKING_VIEW.TABLE.UNSTAKING_COMPLETION`)}}</span>
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
        -->
         <Column>
          <template #body="{data}">
            <Button class="outlined" @click="checkBTN(data)">
              <StakeManagementIcon icon="manage"/>
              {{ $t(`STAKING_VIEW.TABLE_BUTTONS.MANAGE_BTN`) }}
            </Button>
          </template>
        </Column>


        <Column v-if="isLoggedIn">
          <template #body="slotProps: {data: Boost}">
            <span style="cursor: pointer" @click="onRowExpand(slotProps.data)">
            <!--  <Icon @click="onRowExpand(data)" name="ChevronRight" /> -->
              <Icon @click="onRowExpand(slotProps.data)" :name="expandedRow.length && expandedRow[0].pool_description === slotProps.data.pool_description ? 'ChevronUp' : 'ChevronRight'" />
            </span>
          </template>
        </Column>

      </template>
      <template #expanded-columns>
        History.... details....
      </template>
    </DataTableWrapper>
  </span>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView";
import {Coin} from "@/models/store/common";
import {Boost} from "@/models/store/boost";
import BoostPopup from "@/components/boost/BoostPopup.vue";



const popupOpened = ref(false);
const currentBoost = ref({});


const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref(Array<Boost>());

function checkBTN(item: Boost){
  currentBoost.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

function createEagerLoadingConfig(): EagerLoadingConfig<Boost>{
  const config = new EagerLoadingConfig<Boost>([new Boost(
      'Boost Name 1',
      new Coin(BigInt(1000000), 'uc4e'),
      new Coin(BigInt(500000), 'uc4e'),
      new Coin(BigInt(10000), 'uc4e'),
      75,
      360),
    new Boost(
      'Boost Name 2',
      new Coin(BigInt(1000000), 'uc4e'),
      new Coin(BigInt(500000), 'uc4e'),
      new Coin(BigInt(10000), 'uc4e'),
      60,
      270),
    new Boost(
      'Boost Name 3',
      new Coin(BigInt(1000000), 'uc4e'),
      new Coin(BigInt(500000), 'uc4e'),
      new Coin(BigInt(10000), 'uc4e'),
      45,
      180),
  ]);
  return config;
}

function onRowExpand(data: Boost) {
  expandedRow.value = (expandedRow.value.length && expandedRow.value[0].pool_description === data.pool_description) ? [] : [data];
}

function onRowClick(event: any) {
    onRowExpand(event.data);
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
@import '../../styles/tables.scss';


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
    overflow: initial !important;
    margin-top: -40px !important;
    transform: translateY(-40px) !important;
  }

.p-datatable .p-datatable-tbody > tr > td > .p-column-title {
  display: none;
}

  @media screen and (max-width: 950px) {
    .search-bar {
      width: 100%;
      transform: none;
      margin-bottom: 20px;
    }

    .p-datatable .p-datatable-header {
      margin-bottom: 0;
    }

    .p-datatable-wrapper {
      margin-top: 0 !important;
      transform: none !important;
    }

    .p-datatable .p-datatable-tbody > tr > td > .p-column-title {
      display: block;
    }
  }

</style>
