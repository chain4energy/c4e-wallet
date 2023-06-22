<template>
  <div class="amount">
    <slot name="logo-front"></slot>
    <div class="amount__amount">
      <div class="userdata-container" :class="useUserStore().isContinuousVestingAccount ? '' : 'width-95'">
        <div class="userdata-option" v-for="(items, index) in props.coins" :key="index">
          <span class="header" v-if="items.header">{{items.header}}</span>
          <CoinAmount :amount="convertAmount(items.amount)" :precision="precision" :show-denom="items.showDenom || showDenom" :show-tooltip="true" :reduce-big-number="reduceBigNumber"/>
        </div>
      </div>
      <span class="vesting-container" v-if="useUserStore().isContinuousVestingAccount && showVesting">
        <div class="vesting-flag">Vesting</div>
        <div class="userdata-option vesting-first" v-if="useUserStore().isContinuousVestingAccount">
              <span class="header">{{ $t('USER_DATA.LOCKED') }}</span>
              <CoinAmount :key="locked" :amount="convertAmount(locked)" :precision="precision" :reduce-big-number="reduceBigNumber" :show-tooltip="true" :show-denom="true"/>
          </div>
          <div class="userdata-option vesting" v-if="useUserStore().isContinuousVestingAccount">
              <span class="header">{{ $t('USER_DATA.VESTING_END') }}</span>
              <b><DateCommon :date="useUserStore().getAccount.continuousVestingData?.endTime" :show-time="false" :showTooltip="true" /></b>
          </div>
          <div class="userdata-option vesting" v-if="!useUserStore().isContinuousVestingAccount"></div>

      </span>
    </div>
    <slot name="logo-back"></slot>
  </div>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import {computed, onMounted} from "vue";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import CoinAmount from "./CoinAmount.vue";
import { useUserStore } from "@/store/user.store";
import DateCommon from "@/components/commons/DateCommon.vue";
import {useBlockStore} from "@/store/block.store";
import dataService from "@/services/data.service";

const props = defineProps<{
  coins:[
    {
      header: string | undefined,
      amount: bigint | number | BigDecimal | Coin | DecCoin,
      showDenom: boolean,
    }
  ]
  precision?: number,
  reduceBigNumber: boolean,
  showDenom?: boolean,
  showVesting?: boolean
}>();
function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}
const locked = computed(()=> {
  return useUserStore().getVestingLockAmount;
});



onMounted(() =>{
  dataService.refreshValidators();
});


</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.userdata-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 55%;
  height: 80px;
  overflow: hidden;
  z-index: 2;
}

.width-95 {
  width: 95%;
}

.amount{
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 2;
  position: relative;
  &__amount{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  z-index: 2;
    margin-left: 10px;
  }
}

.vesting-flag {
  color: white;
  background: $secondary-color;
  padding: 5px;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-30%, -50%);
  font-size: 0.6em;
}
.userdata-option {
  display: flex;
  flex-direction: column;
  z-index: 2;
  align-items: flex-start;

  .header {
    font-size: 0.8em;
    color: gray
  }
}

.vesting-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;
  background: #E6FFF1;
  position: relative;
  min-width: 40%;
  height: 80px;

  &::before {
    content: '';
    clip-path: polygon(3% 50%, 0 0, 0 100%);
    background: white;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

}
.vesting-first {
  min-height: 100%;
  padding: 2em 0 2em 12%;
}

.vesting {
  background: #E6FFF1;
  min-height: 100%;
  padding: 2em 0;
}

@media screen and (max-width: 1400px) {
  .amount{
    &__amount{
      flex-direction: column;
      margin: 0;
    }
  }
  .userdata-container {
    width: 90%;
  }

  .vesting-container {
    min-width: 100%;
    overflow: hidden;

    &::before {
      content: none;
    }
  }

  .vesting-first {
    padding: 2em 0;
  }

  .vesting-flag {
    display: none;
  }
}

@media screen and (max-width: 650px) {
  .userdata-container {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
    justify-content: center;

    .userdata-option{
      margin: 10px;
    }
  }

  .vesting-container {
      flex-wrap: wrap;
      height: auto;
      padding: 10px;
      justify-content: center;

      .userdata-option{
        margin: 10px;
      }
    }
}
</style>
