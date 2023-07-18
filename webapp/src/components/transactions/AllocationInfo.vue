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
            :amount="transaction.amountRequested"
            :show-denom="true"
            :reduce-big-number="false"
            :precision="2"/></th>
      </tr>
      <tr v-if="transaction.status === RESERVATION_STATUS.DECLARED && transaction.reservationEndTime">
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.REMAINING_RESERVATION_TIME')}}</th>
        <th class="allocationInfo__tableTabs">{{ timeToPass }}</th>
      </tr>
<!--      <tr>-->
<!--        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.PAYMENT_TYPE')}}</th>-->
<!--        <th class="allocationInfo__tableTabs">{{ getPaymentType() }}</th>-->
<!--      </tr>-->
      <tr>
        <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.STATUS')}}</th>
        <th :style="{color: getStatusColor()}">{{ transaction.status }}</th>
      </tr>
      <tr>
        <th class="allocationInfo__tableTabs">Unconfirmed</th>
        <th class="allocationInfo__tableTabs">{{ transaction.unconfirmed }}</th>
      </tr>
      <tr>
        <th class="allocationInfo__tableTabs">Round</th>
        <th class="allocationInfo__tableTabs">{{ transaction.roundId }}</th>
      </tr>
<!--      <tr v-if="transaction.txHash">-->
<!--        <th class="allocationInfo__tableTabs">Tx-hash</th>-->
<!--        <th class="allocationInfo__tableTabs">{{ transaction.txHash }}</th>-->
<!--      </tr>-->
<!--      <tr v-if="transaction.blockchainType">-->
<!--        <th class="allocationInfo__tableTabs">Blockchain</th>-->
<!--        <th class="allocationInfo__tableTabs">{{ transaction.blockchainType }}</th>-->
<!--      </tr>-->

    </table>
    <Button
      class="p-button p-component secondary accountInfo__btn allocationInfo__btn"
      v-if="props.transaction.status === RESERVATION_STATUS.DECLARED"
      @click="submit"
    >Pay</Button>
  </div>

  <Accordion :multiple="true">
    <AccordionTab v-for="blockchainTransaction in transaction.transactions" :key="blockchainTransaction" :header="blockchainTransaction.txHash">
      <div class="allocationInfo__body">
        <table style=" width: 90%">

          <tr>
            <th class="allocationInfo__tableTabs">Blockchain status</th>
            <th class="allocationInfo__tableTabs">{{ blockchainTransaction.blockchainStatus }}</th>
          </tr>
          <tr>
            <th class="allocationInfo__tableTabs">Status</th>
            <th class="allocationInfo__tableTabs">{{ blockchainTransaction.status }}</th>
          </tr>
          <tr>
            <th class="allocationInfo__tableTabs">Type</th>
            <th class="allocationInfo__tableTabs">{{ blockchainTransaction.type }}</th>
          </tr>
          <tr>
            <th class="allocationInfo__tableTabs">TxHash</th>
            <th class="allocationInfo__tableTabs">{{ blockchainTransaction.txHash }}</th>
          </tr>
          <tr>
            <th class="allocationInfo__tableTabs">Payments</th>
            <th>
              <div style="display: flex; justify-content: center; margin-top:20px">
                <table id="txs">
                  <tr>
                    <th style="width:10%">Number</th>
                    <th>Amount</th>
                    <th>Currency</th>
                  </tr>
                  <tr v-for="blockchainTx in blockchainTransaction.blockchainTxs" :key="blockchainTx">
                    <td >1</td>
                    <td>{{blockchainTx.amount}}</td>
                    <td>{{blockchainTx.coinName}}</td>
                  </tr>
                </table>
              </div>
            </th>
          </tr>
        </table>
      </div>



<!--      <Accordion :multiple="true">-->
<!--        <AccordionTab v-for="blockchainTx in blockchainTransaction.blockchainTxs" :key="blockchainTx" :header="blockchainTx.coinName">-->
<!--          <div class="allocationInfo__body">-->
<!--            <table style=" width: 90%">-->
<!--              <tr>-->
<!--                <th class="allocationInfo__tableTabs">Coin name</th>-->
<!--                <th class="allocationInfo__tableTabs">{{ blockchainTx.coinName }}</th>-->
<!--              </tr>-->
<!--              <tr>-->
<!--                <th class="allocationInfo__tableTabs">Amount</th>-->
<!--                <th class="allocationInfo__tableTabs">{{ blockchainTx.amount }}</th>-->
<!--              </tr>-->
<!--            </table>-->
<!--          </div>-->

<!--        </AccordionTab>-->
<!--      </Accordion>-->
    </AccordionTab>
  </Accordion>

</div>
</template>

<script setup lang="ts">
import {paymentType, TokenReservation} from "@/store/publicSales.store";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import {RESERVATION_STATUS} from "@/models/saleServiceCommons";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

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
// function getPaymentType(){
//   switch (props.transaction.paymentType){
//     case paymentType.Crypto: return 'Crypto';
//     case paymentType.StandardCurrency: return 'USD or EUR';
//     case paymentType.updating: return '';
//   }
// }
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
  const diference = props.transaction.reservationEndTime.getTime() - now.getTime();
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

#txs {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#txs td, #txs th {
  border: 1px solid #ddd;
  padding: 8px;
}

#txs tr:nth-child(even){background-color: #f2f2f2;}

#txs tr:hover {background-color: #ddd;}

#txs th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #002C50;
  color: white;
}
</style>
