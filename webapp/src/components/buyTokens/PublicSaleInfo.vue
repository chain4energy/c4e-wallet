<template>
  <div class="publicSaleInfo">
    <h3 class="publicSaleInfo__header">{{$t('BUY_TOKENS_VIEW.ROUND_INFO')}} {{usePublicSalesStore().roundInfo?.name}}</h3>
<!--    <div style="width: 100%; height: 50px; padding: 0 20px;">-->
<!--      <PublicSalesBar v-if="parts && total" :total="total" :values="parts"/>-->
<!--    </div>-->
    <div class="publicSaleInfo__summary">
      <div class="publicSaleInfo__infoBlock green_background" >
        <span>{{$t('BUY_TOKENS_VIEW.PRICE')}}</span>
        <span>1 C4E = ${{currency}}</span>
      </div>
      <div class="publicSaleInfo__infoBlock">
        <span>Total Raise</span>
        <CoinAmount :amount="total ? total : 0" :show-denom="true" :precision="2" :reduce-big-number="false" />
      </div>
      <div class="publicSaleInfo__infoBlock">
        <span>{{$t('BUY_TOKENS_VIEW.TIME_TO_START')}}</span>
        <span>{{timeToStart}}</span>
        <span v-if="startDate" class="publicSaleInfo__dateText">({{startDate.toUTCString()}})</span>
      </div>
      <div class="publicSaleInfo__infoBlock">
        <span>{{$t('BUY_TOKENS_VIEW.TIME_TO_END')}}</span>
        <span>{{timeToEnd ? timeToEnd : 'The round has ended'}}</span>
        <span v-if="endDate" class="publicSaleInfo__dateText">({{endDate.toUTCString()}})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePublicSalesStore } from "@/store/publicSales.store";
import {computed, onBeforeMount, onUnmounted, ref} from "vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {useI18n} from "vue-i18n";
const publicSalesStore = usePublicSalesStore();

let startDateIntevalId = 0;
let endDateIntervalId = 0;
const timeToStart = ref();
const timeToEnd = ref();

onBeforeMount(() => {
  startDateIntevalId = window.setInterval(() => {
    timeToStart.value = calculateTimeToPAss(new Date(Date.now()), startDate.value);
  }  , 1000);
  endDateIntervalId = window.setInterval( () => {
    timeToEnd.value = calculateTimeToPAss(startDate.value, endDate.value);
  }, 1000);
});

onUnmounted(() => {
  window.clearInterval(startDateIntevalId);
  window.clearInterval(endDateIntervalId);
});

const total = computed(() =>{
  return publicSalesStore.roundInfo?.totalTokens;
});

// const parts = computed(() =>{
//   return publicSalesStore.getParts;
// });

const currency = computed(() => {
  return publicSalesStore.getC4eToUSD;
});

const startDate = computed(() => {
  return publicSalesStore.roundInfo?.startDate;
});
const endDate = computed(() => {
  return publicSalesStore.roundInfo?.endDate;
});

const i18n = useI18n();

function calculateTimeToPAss(startDate: Date | undefined, endDate: Date | undefined){
  if (startDate == undefined || endDate == undefined) {
    return '-';
  }
  if(startDate.getTime() < endDate.getTime()){

    const now = new Date(Date.now());
    const diference = new Date(endDate).getTime() - now.getTime();
    if (diference < 0) return null;
    const days = Math.floor(diference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else {
    return i18n.t('BUY_TOKENS_VIEW.ALREADY_STARTED');
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
  //background: #0F3153;
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 10px;
  align-items: center;

  background-color: $main-color;

  &__header{
    margin-top:20px;
    color: white;
    margin-bottom: 10px;
    font-weight: 900;
    word-wrap:break-word;

  }
  &__summary{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: auto;
  }
  &__infoBlock{
    padding: 20px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;
    color: white;
    background-color: $main-lighter-color;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 6px;
    span:first-child {
      margin-bottom:10px;
    }
  }
  &__dateText{
    font-family: 'Inter',sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
  }
}
.green_background {
  background-color: $secondary-color;
}

@media screen and (max-width: 1324px) {
  .publicSaleInfo {
    &__summary {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
}
</style>
