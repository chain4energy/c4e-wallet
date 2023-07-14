<template>
<div class="allocationInfo">
  <div class="allocationInfo__head">
    Allocation info
  </div>
  <div class="allocationInfo__body">
    <table class="allocationInfo__table">
      <tr>
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.AMOUNT_REQUESTED')}}</th>
        <th class="allocationInfo__tableTabs">
          <CoinAmount
            :amount="transaction.amount"
            :show-denom="true"
            :reduce-big-number="false"
            :precision="2"/></th>
      </tr>
      <tr v-if="transaction.status === RESERVATION_STATUS.DECLARED && transaction.reservationEnd">
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.REMAINING_RESERVATION_TIME')}}</th>
        <th class="allocationInfo__tableTabs">{{ timeToPass }}</th>
      </tr>
      <tr>
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.PAYMENT_TYPE')}}</th>
        <th class="allocationInfo__tableTabs">{{ getPaymentType() }}</th>
      </tr>
      <tr>
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.STATUS')}}</th>
        <th :style="{color: getStatusColor()}">{{ transaction.status }}</th>
      </tr>
      <tr v-if="transaction.txHash">
        <th class="allocationInfo__tableTabs">Tx-hash</th>
        <th class="allocationInfo__tableTabs">{{ transaction.txHash }}</th>
      </tr>
      <tr v-if="transaction.blockchainType">
        <th class="allocationInfo__tableTabs">Blockchain</th>
        <th class="allocationInfo__tableTabs">{{ transaction.blockchainType }}</th>
      </tr>
    </table>
    <Button
      class="p-button p-component secondary accountInfo__btn allocationInfo__btn"
      v-if="props.transaction.status === RESERVATION_STATUS.DECLARED"
      @click="submit"
    >Pay</Button>
  </div>

</div>
</template>

<script setup lang="ts">
import {paymentType, TokenReservation} from "@/store/publicSales.store";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import {RESERVATION_STATUS} from "@/models/saleServiceCommons";


const props = defineProps<{
  transaction: TokenReservation
}>();

let timeToPassId = 0;

const timeToPass = ref();


onBeforeMount(() => {
  timeToPassId = window.setInterval(calculateTimeToPass, 1000);
});

onUnmounted(() => {
  window.clearInterval(timeToPassId);
});

const emit = defineEmits(['pay']);
function getPaymentType(){
  switch (props.transaction.paymentType){
    case paymentType.Crypto: return 'Crypto';
    case paymentType.StandardCurrency: return 'USD or EUR';
    case paymentType.updating: return '';
  }
}
function getStatusColor(){
  switch (props.transaction.status){
    case RESERVATION_STATUS.DECLARED: return `#858585`;
    case RESERVATION_STATUS.COMPLETED: return `#19B15D`;
    case RESERVATION_STATUS.CANCELED: return `#E02626`;
  }
}

function submit(){
  console.log('submit');
  emit('pay');
}

function calculateTimeToPass(){
  const now = new Date(Date.now());
  const diference = props.transaction.reservationEnd.getTime() - now.getTime();
  const days = Math.floor(diference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diference % (1000 * 60)) / 1000);
  timeToPass.value = `${days}D ${hours}H ${minutes}M ${seconds}S`;
}
</script>

<style scoped lang="scss">
.allocationInfo{
  display: flex;
  flex-direction: column;
  margin-top: 36px;
  padding: 11px 27px;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  &__head{
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: start;
  }
  &__body{
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__table{
    width: 70%;
  }
  &__tableTabs{
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 28px;
    color: #858585;
  }
  th{
    text-align: start;
    width: 50%;
  }
  &__btn{
    border-radius: 24px;
    width: 161px;
    min-height: 40px;
    font-family: 'Work Sans',sans-serif;
  }
}
</style>
