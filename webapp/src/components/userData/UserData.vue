<template>
<div class="userdata">
  <div class="userdata__accountData">
    <div class="userdata__accountData-base" >
      <AmountView :coins="representData" :show-denom="true">
        <template v-slot:logo-front>
          <C4EIcon icon="c4e-circle" :size="30"/>
        </template>
      </AmountView>
    <div class="userdata__accountData-vesting-first" v-if="useUserStore().isContinuousVestingAccount">
      <div>
        <p>{{ $t('USER_DATA.LOCKED') }}</p>
        <CoinAmount :amount="locked" :show-denom="true"/>
      </div>
    </div>
    <div class="userdata__accountData-vesting" v-if="useUserStore().isContinuousVestingAccount">
      <div>
        <p>{{ $t('USER_DATA.VESTING_END') }}</p>
        <p>{{ useUserStore().getAccount.continuousVestingData?.endTime.toLocaleString() }}</p>
      </div>
    </div>
    <div class="userdata__amounts_last" v-if="!useUserStore().isContinuousVestingAccount"></div>
  </div>

  </div>

  <div class="userdata__rewards">
    <div class="userdata__rewardAmount">
      <Icon name="Gift" class="gift-color"></Icon>
      <CoinAmount :amount="useUserStore().getTotalRewards" :show-denom="true"/>
    </div>
    <Button class="secondary" @click="claimRewards">{{ $t('USER_DATA.CLAIM_REWARDS') }}</Button>

  </div>

</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.store";
import { Account } from "@/models/store/account";
import {useBlockStore} from "@/store/block.store";
import { computed, ref } from "vue";
import C4EIcon from "../commons/C4EIcon.vue";
import AmountView from "@/components/commons/AmountView.vue";
import i18n from "@/plugins/i18n";
import CoinAmount from "../commons/CoinAmount.vue";

function claimRewards(){
  useUserStore().claimRewards();
}
// useBlockStore().fetchLatestBlock();
// setInterval(useBlockStore().fetchLatestBlock, 6000);

const total = computed(() => useUserStore().getTotal);
const locked = computed(()=> useUserStore().getVestingLockAmount);
const available = computed(() => useUserStore().getBalance);
const stacked = computed(()=> useUserStore().getTotalDelegated);
const unstaked = computed(()=> useUserStore().getTotalUndelegating);
// const startTime = computed(()=> useUserStore().getAccount.continuousVestingData?.getStartTimeDateString() || 'loading');
// const endTime = computed(()=> useUserStore().getAccount.continuousVestingData?.getStartTimeDateString() || 'loading');

const representData = computed(()=> {
  const coins = [
    {
      header : i18n.global.t('USER_DATA.TOTAL'),
      amount: total.value || 0
    },
    {
      header : i18n.global.t('USER_DATA.AVAILABLE'),
      amount: available.value || 0
    },
    {
      header : i18n.global.t('USER_DATA.STAKED'),
      amount: stacked.value || 0
    },
    {
      header : i18n.global.t('USER_DATA.UNSTAKING'),
      amount: unstaked.value || 0
   },
  ];
  return coins;
});
</script>

<style scoped lang="scss">
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
  p{
    margin: 0;
  }
  &__accountData{
    display: flex;
    width: 60%;
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
    padding: 20px 25px;
    width: 40%;
    min-height: 100%;
    max-height: 80px;
    border-radius: 0 6px 6px 0;
    background: #0F3153;
  }
  &__rewardAmount{
    display: flex;
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
</style>
