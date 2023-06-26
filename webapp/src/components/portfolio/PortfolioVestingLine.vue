<script setup lang="ts">

import C4EIcon from "@/components/commons/C4EIcon.vue";
import {VestingPeriods} from "@/models/store/account";
import {BigDecimal} from "@/models/store/big.decimal";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {useI18n} from "vue-i18n";
import {calculateLockedVesting} from "@/utils/vesting-utils";
import {useBlockStore} from "@/store/block.store";

const props = defineProps<{vesting: VestingPeriods }>();
const i18n = useI18n();

const blockStore = useBlockStore();

function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}

const calculateDays = (date: number) => {
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  let timeRemaining = new Date(date*1000).getTime() - Date.now();
  return timeRemaining/oneDay < 1
    ?
    `${Math.floor(timeRemaining / oneHour)} ${i18n.t("PORTFOLIO_VIEW.HOURS")} ${Math.floor(timeRemaining/60000) % 60} ${i18n.t("PORTFOLIO_VIEW.MINS")}`
    :
    `${Math.floor(timeRemaining / oneDay)} ${i18n.t("PORTFOLIO_VIEW.DAYS")}`;
};

function sumVestingAmount(): bigint {
  let sumAmount = 0n;
  props.vesting.amount.forEach((item) => sumAmount += item.amount);

  return calculateLockedVesting(props.vesting.startTime*1000, props.vesting.endTime*1000, blockStore.getLatestBlock.time.getTime(), sumAmount);
}



</script>

<template>

  <div class="portfolioVesting__line">
    <div class="mobile-hidden">
      <C4EIcon size="75" icon="c4e-green"/>
    </div>
    <div class="portfolioVesting__tile start-date">
      <h3>{{ new Date(vesting.startTime*1000).toLocaleString() }}</h3>
    </div>
    <div class="portfolioVesting__tile end-date">
      <h3>{{ new Date(vesting.endTime*1000).toLocaleString() }}</h3>
    </div>
    <div class="portfolioVesting__tile">
      <h4>
        <CoinAmount :amount="convertAmount(sumVestingAmount())" :precision="2" :reduce-big-number="true" :show-tooltip="true" :show-denom="true"/>
      </h4>
    </div>
    <div class="portfolioVesting__tile">
      <h3>{{calculateDays(vesting.endTime)}}</h3>
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

@media screen and (width<1500px) {
  .mobile-hidden {
    display: none;
  }
  .portfolioVesting h3{
    font-size: 1.25rem !important;
  }
  .portfolioVesting__line {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media screen and (width<850px) {
  .end-date {
    display: none;
  }
}

@media screen and (width<520px) {
  .start-date {
    display: none;
  }
}

</style>

