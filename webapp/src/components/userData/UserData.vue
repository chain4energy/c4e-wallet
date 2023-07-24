<template>
<div class="userdata">
  <div class="userdata__accountData">
    <div class="userdata__accountData-base" >
      <AmountView
        :coins="representData"
        :showVesting="vestingStatus"
        :reduceBigNumber="true"
        :precision="2"
      >
        <template v-slot:logo-front>
          <C4EIcon icon="c4e-circle" :size="30"/>
        </template>
      </AmountView>
<!--      <div class="vesting">-->
<!--        <div class="userdata__accountData-vesting-first" v-if="useUserStore().isContinuousVestingAccount">-->
<!--          <div>-->
<!--            <p>{{ $t('USER_DATA.LOCKED') }}</p>-->
<!--            <CoinAmount :amount="locked" :show-denom="true"/>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="userdata__accountData-vesting" v-if="useUserStore().isContinuousVestingAccount">-->
<!--          <div>-->
<!--            <p>{{ $t('USER_DATA.VESTING_END') }}</p>-->
<!--            <p><DateCommon :date="useUserStore().getAccount.continuousVestingData?.endTime"/></p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="userdata__amounts_last" v-if="!useUserStore().isContinuousVestingAccount"></div>-->
<!--      </div>-->
  </div>

  </div>

  <div class="userdata__rewards">
    <div class="userdata__rewardAmount">
      <p class="userdata__claimText">{{ $t('USER_DATA.CLAIM_HEADER') }}</p>
      <CoinAmount class="userdata__claimAmount" :amount="useUserStore().getTotalRewards" :show-denom="true"/>
    </div>
    <Button class="outlined-secondary" @click="claimRewards">{{ $t('USER_DATA.CLAIM_REWARDS') }}</Button>

  </div>

</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.store";
import { computed } from "vue";
import C4EIcon from "../commons/C4EIcon.vue";
import AmountView from "@/components/commons/AmountView.vue";
import i18n from "@/plugins/i18n";
import CoinAmount from "../commons/CoinAmount.vue";
import DateCommon from "@/components/commons/DateCommon.vue"
import dataService from "@/services/data.service";

function claimRewards(){
  dataService.onClaimRewards();
}

const total = computed(() => useUserStore().getTotal);
const locked = computed(()=> useUserStore().getVestingLockAmount);
const available = computed(() => useUserStore().getBalance);
const stacked = computed(()=> useUserStore().getTotalDelegated);
const unstaked = computed(()=> useUserStore().getTotalUndelegating);
const vestingStatus = true;
const representData = computed(()=> {
  const coins = [
    {
      header : i18n.global.t('USER_DATA.TOTAL'),
      amount: total.value || 0,
      showDenom: true,
    },
    {
      header : i18n.global.t('USER_DATA.AVAILABLE'),
      amount: available.value || 0,
      showDenom: false,
    },
    {
      header : i18n.global.t('USER_DATA.STAKED'),
      amount: stacked.value || 0,
      showDenom: false,
    },
    {
      header : i18n.global.t('USER_DATA.UNSTAKING'),
      amount: unstaked.value || 0,
      showDenom: false,
   },
  ];
  return coins;
});
</script>

<style scoped lang="scss">
@import "../../styles/variables.scss";

.vesting {
  display: flex;
  flex-wrap: nowrap;

  div {

  }
}
.userdata{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  max-height: 80px;
  margin-left: auto;
  margin-right: auto;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  color: #090909;
  overflow: hidden;
  transition: 0.2s all ease-in-out;
  z-index: 2;

  p{
    margin: 0;
  }
  &__accountData{
    display: flex;
    width: 67%;
    z-index: 2;
    align-items: center;
    //padding: 20px 25px;
    justify-content: space-between;
    &-base{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      // max-width: 50%;
      margin-left: 20px;
      z-index: 2;
      justify-content: space-between;
    }
    &-vesting-first{
      padding-left: 3%;
      background: #E6FFF1;
      display: flex;
      align-items: center;
      min-height: 100%;
      width: 100%;
      // text-align: left;
      clip-path: polygon(100% 0%, 100% 100%, 0 100%, 5% 50%, 0 0);
    }
    &-vesting{
      background: #E6FFF1;
      display: flex;
      align-items: center;
      min-height: 100%;
      width: 100%;
      // text-align: left;
    }
  }
  &__claimText{
    font-size: 0.6em;
    color: white;
  }
  &__claimAmount{
    text-align: left;
  }
  &__amounts{
    text-align: center;
    width: 100%;
  }
  &__amounts_last{
    padding-right: 30px;
  }
  &__rewards{
   display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px;
    width: 33%;
    height: 80px;
    border-radius: 0 6px 6px 0;
    background: #0F3153;
  }
  &__rewardAmount{
    display: flex;
    flex-direction: column;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    text-align: center;
    color: #FFFFFF;
    :nth-child(1){
      margin-right: 16px;
    }
  }

  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    width: 161px;
    background-color: transparent;
    color: #FFFFFF;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
    }
  }
}

.gift-color {
  color: #72BF44;
}

.c4e-icon {
  color: #0F3153;
}

@media screen and (max-width: 1420px) {
  .userdata {
    flex-direction: column;
    max-height: 80px;

    &:hover {
      max-height: 240px;
    }

  &__rewards {
    width: 100%;
    justify-content: space-evenly;
  }
    &__accountData{
      flex-direction: column;
      width: 100%;
      &-base{
        width: 100%;
        margin-left: 0;
        justify-content: space-around;
      }
    }
  }

  .c4e-icon {
    display: none;
  }
}

@media screen and (max-width: 650px) {
  .userdata {
    height: 80px;
    transition: 0.2s all ease-in-out;

    &:hover {
      height: auto;
      max-height: initial;
    }

    &__rewards {
      flex-wrap: wrap;
      height: auto;
      padding: 10px;
      justify-content: center;
    }
  }


}
</style>
