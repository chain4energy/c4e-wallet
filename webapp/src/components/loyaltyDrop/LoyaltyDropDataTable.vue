<template>
  <span>
    <LoyaltyDropPopup :visible="popupOpened" :boost="currentBoost" @close="popupOpened = false;"/>
    <DataTableWrapper :data-key="'pool_description'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" @row-click="onRowClick" :paginator="false">
      <template v-slot:empty>{{$t('BOOST.TABLE.NO_DATA')}}</template>

      <template v-slot:columns>
        <Column :header="$t('BOOST.COMMON.NAME')" :sortable="false">
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <span>{{ slotProps.data.poolDescription }}</span>
          </template>
        </Column>
        <Column :header="$t('BOOST.COMMON.LOCKUP_PERIOD')" :sortable="false">
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <span>{{msToDays(slotProps.data.lockupPeriod) }} {{$t('BOOST.COMMON.DAYS')}}</span>
          </template>
        </Column>
        <Column :header="$t('BOOST.COMMON.APR')" :sortable="false">
         <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <span>{{ (slotProps.data.apr * 100).toFixed(2)}}%</span>
          </template>
        </Column>

        <Column :header="$t('BOOST.TABLE.POOL_SIZE')" :sortable="false">
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <CoinAmount :amount="slotProps.data.baseTokens" :show-denom="true" :show-tooltip="true"/>
          </template>
        </Column>
        <Column :header="$t('BOOST.COMMON.POOL_USAGE')">
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <div style="margin-right: 15px;">
              <CoinAmount :amount="calculateRemainingTokens(slotProps.data)" :show-tooltip="true" tooltip-only >
                <div v-if="calculatePercentagePoolUsage(slotProps.data)" >
                  <div v-if="calculatePercentagePoolUsage(slotProps.data) < 0.05" class="commision">
                    <div class="level-1" :style="'flex-basis:' + (calculatePercentagePoolUsage(slotProps.data) * 100).toFixed(2) + '%'"></div>
                    <PercentsView class="level-border" :amount="calculatePercentagePoolUsage(slotProps.data)" :precision="2"></PercentsView>
                  </div>
                  <div v-if="calculatePercentagePoolUsage(slotProps.data) >= 0.05 && calculatePercentagePoolUsage(slotProps.data) < 0.10" class="commision">
                    <div class="level-2" :style="'flex-basis:' + (calculatePercentagePoolUsage(slotProps.data) * 100).toFixed(2) + '%'"></div>
                    <PercentsView class="level-border" :amount="calculatePercentagePoolUsage(slotProps.data)" :precision="2"></PercentsView>
                  </div>
                  <div v-if="calculatePercentagePoolUsage(slotProps.data) >= 0.10 && calculatePercentagePoolUsage(slotProps.data) < 0.25" class="commision">
                    <div class="level-3" :style="'flex-basis:' + (calculatePercentagePoolUsage(slotProps.data) * 100).toFixed(2) + '%'"></div>
                    <PercentsView class="level-border" :amount="calculatePercentagePoolUsage(slotProps.data)" :precision="2"></PercentsView>
                  </div>
                  <div v-if="calculatePercentagePoolUsage(slotProps.data) >= 0.25" class="commision">
                    <div class="level-4" :style="'flex-basis:' + (calculatePercentagePoolUsage(slotProps.data) * 100).toFixed(2) + '%'"></div>
                    <PercentsView class="level-border" :amount="calculatePercentagePoolUsage(slotProps.data)" :precision="2"></PercentsView>
                  </div>
                </div>
                <span v-else>updating</span>
              </CoinAmount>
            </div>
          </template>
        </Column>

        <Column :header="$t('BOOST.TABLE.CONTRIBUTION')" :sortable="false">
<!--          <template #body>-->
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
<!--            <span>{{ userBoosts.find(el => el.boostPoolId === slotProps.data.id) ? userBoosts.find(el => el.boostPoolId === slotProps.data.id).amount.amount : 0}} C4E </span>-->
<!--             <CoinAmount :amount="useLoyaltyDropStore().getUserBoostsByPollId(slotProps.data.id).reduce((acc, item) => acc +parseInt( item.value), 0)" :show-denom="true" :show-tooltip="true"/>-->
             <CoinAmount :amount="calculateContributionPerPool(userBoosts,slotProps.data.id)" :show-denom="true" :show-tooltip="true"/>
          </template>
        </Column>

        <Column :header="$t('BOOST.TABLE.REWARD')" :sortable="false">
          <template #body>
            <span class="p-column-title">{{ $t('BOOST.TABLE.REWARD') }}</span>
          </template>
        </Column>

         <Column>
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <Button class="outlined" @click="checkBTN(slotProps.data)">
              <StakeManagementIcon icon="manage"/>
              {{ $t('BOOST.TABLE.MANAGE') }}
            </Button>
          </template>
        </Column>

        <Column v-if="isLoggedIn">
          <template #body="slotProps: {data: LoyaltyDropPoolConfig}">
            <span style="cursor: pointer" @click="onRowExpand(slotProps.data)" v-if="userBoosts.find(el => el.boostPoolId === slotProps.data.id)">
            <!--  <Icon @click="onRowExpand(data)" name="ChevronRight" /> -->
              <Icon @click="onRowExpand(slotProps.data)" :name="expandedRow.length && expandedRow[0].poolDescription === slotProps.data.poolDescription ? 'ChevronUp' : 'ChevronRight'" />
            </span>
          </template>
        </Column>

      </template>
      <template v-slot:expanded-columns="slotProps: {expandedData: {data: LoyaltyDropPoolConfig}}">
        <div >
            <DataTableWrapper
              :useExternalGlobalFilter="false"
              :eager-loading-config="createUserDropLoadingConfig(slotProps.expandedData.data.id)"
              :paginator="false">
<!--              <template #header>-->
<!--                <h5 style="font-weight: bolder; margin-top: 20px; margin-bottom: -20px;">{{ $t("STAKING_VIEW.USER_UNDELEGATIONS") }}</h5>-->
<!--              </template>-->
              <template v-slot:columns>

                <Column :header="$t('BOOST.TABLE.LOCK_START')" style="width: 200px" :sortable="false">
                  <template #body="slotProps: {data: LoyaltyDropUserBoost}">
                    <span>{{ slotProps.data.lockStart?.toLocaleDateString() }}</span>
                  </template>
                </Column>
                <Column :header="$t('BOOST.TABLE.LOCK_END')" style="width: 200px" :sortable="false">
                  <template #body="slotProps: {data: LoyaltyDropUserBoost}">
                   <span>{{ slotProps.data.lockEnd?.toLocaleDateString() }}</span>
                  </template>
                </Column>
                <Column header="Your contribution" style="width: 200px" :sortable="false">
                  <template #body="slotProps: {data: LoyaltyDropUserBoost}">
                    <CoinAmount :amount=" slotProps.data.amount" :show-denom="true" :show-tooltip="true"/>
                  </template>
                </Column>
                <Column :header="$t('BOOST.TABLE.LOCK_END')" style="width: 200px" :sortable="false">
                  <template #body="slotProps: {data: LoyaltyDropUserBoost}">
                    <span>{{ slotProps.data.lastRewardDate?slotProps.data.lastRewardDate.toLocaleDateString():"-" }}</span>
                  </template>
                </Column>
              </template>
            </DataTableWrapper>
        </div>

<!--        <div v-for="userBoost in userBoosts.filter(el => el.boostPoolId === slotProps.expandedData.data.id)" :key="userBoost.boostPoolId"  class="boostDetails__header">-->
<!--          <div class="boostDetails__header__tile" >-->
<!--            <h3>{{$t('BOOST.TABLE.LOCK_START')}}:</h3>-->
<!--            <h4>{{ userBoost.lockStart?.toLocaleDateString() }}</h4>-->
<!--          </div>-->
<!--          <div class="boostDetails__header__tile" >-->
<!--            <h3>{{$t('BOOST.TABLE.LOCK_END')}}:</h3>-->
<!--            <h4>{{ userBoost.lockEnd?.toLocaleDateString() }}</h4>-->
<!--          </div>-->
<!--                    <div class="boostDetails__header__tile" >-->
<!--             <h3>Your contribution:</h3>-->
<!--                      &lt;!&ndash;            <h4>{{ userBoost.amount    }}</h4>&ndash;&gt;-->
<!--            <h4> <CoinAmount :amount="userBoost.amount" :show-denom="true"/></h4>-->
<!--          </div>-->
<!--          <div class="boostDetails__header__tile" >-->
<!--            <h3>{{$t('BOOST.TABLE.LAST_REWARD')}}:</h3>-->
<!--            <h4>{{ userBoost.lastRewardDate?userBoost.lastRewardDate.toLocaleDateString():"-" }}</h4>-->
<!--          </div>-->

<!--        </div>-->

      </template>
    </DataTableWrapper>
  </span>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView";
import {Coin} from "@/models/store/common";
import {LoyaltyDropPoolConfig, LoyaltyDropUserBoost} from "@/models/store/loyaltyDrop";
import LoyaltyDropPopup from "@/components/loyaltyDrop/LoyaltyDropPopup.vue";
import {useLoyaltyDropStore} from "@/store/boost.store";
import StakeManagementIcon from "@/components/commons/StakeManagementIcon.vue";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {UnbondingDelegationEntry} from "@/models/store/staking";


async function transactionSuccess(arg: string) {
  popupOpened.value = !popupOpened.value;
}



const popupOpened = ref(false);
const currentBoost = ref({});


const userStore = useUserStore();
const boostStore = useLoyaltyDropStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref(Array<LoyaltyDropPoolConfig>());

const userBoosts = computed(() => {
  return boostStore.getUserBoosts;
});

function checkBTN(item: LoyaltyDropPoolConfig){
  currentBoost.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

function createEagerLoadingConfig(): EagerLoadingConfig<LoyaltyDropPoolConfig>{
  const config = new EagerLoadingConfig<LoyaltyDropPoolConfig>(boostStore.getBoosts);
  return config;
}

function onRowExpand(data: LoyaltyDropPoolConfig) {
  expandedRow.value = (expandedRow.value.length && expandedRow.value[0].poolDescription === data.poolDescription) ? [] : [data];
}

function onRowClick(event: any) {
    onRowExpand(event.data);
}

function calculateRemainingTokens(data: LoyaltyDropPoolConfig){
  return new Coin(data.baseTokens.amount - data.reservedTokens.amount - data.rewardsTokens.amount, 'uc4e');
}

function calculatePercentagePoolUsage(data: LoyaltyDropPoolConfig): BigDecimal {
  return divideBigInts(calculateRemainingTokens(data).amount, data.baseTokens.amount);
}

function calculateContributionPerPool(userBoosts: LoyaltyDropUserBoost[], poolId: number) {
  console.log("calculateContributionPerPool poolId:" + poolId);
  const temp = userBoosts.filter(el => el.boostPoolId === poolId);
  const tempCoin = new Coin(0n, "uc4e");
  if (temp && temp.length > 0) {
    temp.forEach((el) => {
      tempCoin.add(el.amount);
    });
  }
  return tempCoin;
}

function msToDays(milliseconds:  number) {
  return milliseconds / (1000 * 60 * 60 * 24);
}

function createUserDropLoadingConfig(id: number){
  const config = new EagerLoadingConfig<LoyaltyDropUserBoost>(userBoosts.value.filter(el => el.boostPoolId === id));
  return config;
}

</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
@import '../../styles/tables.scss';

.boostDetails__header {
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
  // grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  //gap: 24px;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;
  justify-content: space-around;
  gap: 20px;
  height: 100%;
  h3 {
    padding: 10px 10px;
    font-size: 1.1rem;
    text-align: center;
  }
  h4 {
    padding: 10px;
    font-weight: 800;
    font-size: 1rem;
  }

  &__tile {
    flex: 1 1;
    min-width: 150px;
    padding: 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: 'Inter',sans-serif;
    color: #02447A;
    border: 2px solid #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
    //height: 150px;
  }
}

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
