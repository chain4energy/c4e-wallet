<script setup lang="ts">

import C4EIcon from "@/components/commons/C4EIcon.vue";
import {VestingPeriods} from "@/models/store/account";
import {BigDecimal} from "@/models/store/big.decimal";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import CoinAmount from "@/components/commons/CoinAmount.vue";

const props = defineProps<{vesting: VestingPeriods }>();

function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}

const calculateDays = (date: number) => {
  const oneDay = 24 * 60 * 60 * 1000;
  let targetDate = new Date(date*1000);
  let now = Date.now();
  return Math.floor((targetDate.getTime() - now)/oneDay);
};

function sumVestingAmount(): bigint {
  let sumAmount = 0n;
  props.vesting.amount.forEach((item) => sumAmount += item.amount);
  return sumAmount;
}

</script>

<template>

  <div class="portfolioVesting__line">
    <div>
      <C4EIcon size="75" icon="c4e-green"/>
    </div>
    <div class="portfolioVesting__tile">
      <h3>{{ new Date(vesting.endTime*1000).toLocaleString() }}</h3>
    </div>
    <div class="portfolioVesting__tile">
      <h4>
        <CoinAmount :amount="convertAmount(sumVestingAmount())" :precision="4" :reduce-big-number="true" :show-tooltip="false" :show-denom="true"/>
      </h4>
    </div>
    <div class="portfolioVesting__tile">
      <h3>{{calculateDays(vesting.endTime)}} days</h3>
    </div>
  </div>

</template>

<style scoped lang="scss">

.portfolioVesting__tile {
    height: 100%;

    padding: 10px 0 0 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;

    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
}

.portfolioVesting__line {
  align-items: center;
  display: grid;
  grid-template-columns: 150px repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  margin: 20px auto;
}

h4 {
  padding: 5px;
  font-weight: 800;
}

</style>

