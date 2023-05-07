<template>
  <div class="publicSaleInfo">
    <h3 class="publicSaleInfo__header">Public Sale Info</h3>
    <div style="width: 100%; height: 50px; padding: 0 20px;">
      <PublicSalesBar v-if="parts && total" :total="total" :values="parts"/>
    </div>
    <div class="publicSaleInfo__summary">
      <div class="publicSaleInfo__infoBlock">
        <p>Total Raise</p>
        <CoinAmount :amount="total" :show-denom="true" :precision="2" :reduce-big-number="false" />
      </div>
      <div class="publicSaleInfo__infoBlock">
        <p>Price</p>
        <p>1 C4E = {{currency}} USDC</p>
      </div>
      <div class="publicSaleInfo__infoBlock">
        <p>Time to start</p>
        <p v-bind:key="refreshDate">{{calculateTimeToPAss(new Date(Date.now()), startDate)}}</p>
        <p class="publicSaleInfo__dateText">({{startDate.toLocaleDateString('en-US')}})</p>
      </div>
      <div class="publicSaleInfo__infoBlock">
        <p>Time to end</p>
        <p v-bind:key="refreshDate">{{calculateTimeToPAss(startDate, endDate)}}</p>
        <p class="publicSaleInfo__dateText">({{endDate.toLocaleDateString('en-US')}})</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicSalesBar from "@/components/buyTokens/PublicSalesBar.vue";
import { usePublicSalesStore } from "@/store/publicSales.store";
import { computed, ref, watch, watchEffect } from "vue";
import ClaimInfo from "@/components/airdrop/dropComponents/ClaimInfo.vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import AmountView from "@/components/commons/AmountView.vue";
const publicSalesStore = usePublicSalesStore();
publicSalesStore.setParts();
publicSalesStore.setTotal();
publicSalesStore.setCurrentPrice();

const refreshDate = ref(false)

const total = computed(() =>{
  return publicSalesStore.getTotal;
});

const parts = computed(() =>{
  return publicSalesStore.getParts;
});

const currency = computed(() => {
  return publicSalesStore.getC4eToUSDC;
});

const startDate = computed(() => {
  return publicSalesStore.getStartDate;
});
const endDate = computed(() => {
  return publicSalesStore.getEndDate;
})

function calculateTimeToPAss(startDate: Date, endDate: Date){
  if(startDate.getTime() < endDate.getTime()){
    setInterval(() => {
      refreshDate.value = !refreshDate.value
    }, 1000)
    const now = new Date(Date.now());
    const diference = new Date(endDate).getTime() - now.getTime();
    const days = Math.floor(diference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else {
    return 'Already Started';
  }
}

// const total = ref(new Coin(BigInt(250000000),'c4e'));
//
// const values = ref([
//   {
//     amount: new Coin(105000000n, 'c4e'),
//     color: '#81CF1F'
//   },
//   {
//     amount: new Coin(10000n, 'uc4e'),
//     color: '#CAE7FF'
//   }
//   ]);
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.publicSaleInfo{
  display: flex;
  flex-direction: column;
  background: #0F3153;
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 10px 33px;
  border-radius: 5px;
  align-items: center;
  &__header{
    color: white;
    margin: 6px 0;
  }
  &__summary{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
  }
  &__infoBlock{
    padding: 10px;
    display:flex;
    flex-direction: column;
    font-family: 'Inter',sans-serif;
    color: white;
    background: #0F3153;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
  }
  &__dateText{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 7px;
    line-height: 12px;
  }
}
</style>
