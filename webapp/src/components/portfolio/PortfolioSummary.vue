<script setup lang="ts">
import C4EIcon from "@/components/commons/C4EIcon.vue";
import {useUserStore} from "@/store/user.store";
// import {VestingPeriods} from "@/models/store/account";
import FormattedNumber from "@/components/commons/FormattedNumber.vue";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {computed} from "vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {BigDecimal} from "@/models/store/big.decimal";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";

const userStore = useUserStore();
const publicSalesStore = usePublicSalesStore();

const totalBalance = computed(()=> {
  return userStore.getBalance;
});

const spendableBalance = computed(()=> {
  return userStore.getSpendableBalance || 0n;
});

const lockedBalance = computed(()=> {
  return totalBalance.value - spendableBalance.value;
});

const ratio = computed(()=> {
  return publicSalesStore.getConversionRatio;
});

const amountToUSD = (amount: bigint) => {
  let converted = Number(String(amount)) / 1000000;
  if (ratio.value)
    return converted * ratio.value;
  else
    return converted * 0.085;
};

function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}

</script>

<template>

  <div class="portfolioSummary" v-if="totalBalance">

    <div>
      <C4EIcon size="100" icon="c4e-green"/>
    </div>
    <div class="portfolioSummary__tile" >
      <h3>{{$t("PORTFOLIO_VIEW.BALANCE")}}</h3>
      <h4>
        <CoinAmount :key="totalBalance" :amount="convertAmount(totalBalance)" :precision="4" :reduce-big-number="true" :show-denom="true"/>
      </h4>
      <h5>
        $<FormattedNumber :amount="amountToUSD(totalBalance)" :precision="2"/>
      </h5>
    </div>
    <div class="portfolioSummary__tile" v-if="spendableBalance">
      <h3>{{$t("PORTFOLIO_VIEW.SPENDABLE")}}</h3>
      <h4>
        <CoinAmount :key="spendableBalance" :amount="convertAmount(spendableBalance)" :precision="4" :reduce-big-number="true" :show-denom="true"/>
      </h4>
      <h5>$<FormattedNumber :amount="amountToUSD(spendableBalance)" :precision="2"/></h5>
    </div>

    <div>
      <Button class="secondary portfolioSummary__button">{{$t("PORTFOLIO_VIEW.SEND")}}</Button>
    </div>

  </div>

</template>

<style scoped lang="scss">

.portfolioSummary {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;

  div {
    width: 100%;
  }
  h3 {
    padding: 20px 10px;
  }
  h4 {
    padding: 5px;
    font-weight: 800;
  }
  &__button {
    width: 80%;
  }
  &__tile {
    padding: 10px 0 0 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;
    color: white;
    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
    height: 100%;
  }
}

</style>
