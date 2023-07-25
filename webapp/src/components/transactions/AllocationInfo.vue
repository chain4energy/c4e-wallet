<template>
<div class="allocationInfo">
  <div class="allocationInfo__head">
    <span class="title">Allocation info</span>

    <div class="payment-status payment-status-completed" :class="getReservationStatusClass(transaction.status)">
      <Icon :name="getReservationIcon(transaction.status)"></Icon> &nbsp;
      {{ transaction.status }}
    </div>
  </div>
  <div class="allocationInfo__container">
    <div class="allocationInfo__body">
      <div class="table">
        <div class="table__first_column">
          <table class="allocationInfo__table">
            <tr>
              <th class="allocationInfo__tableTabs">{{$t('BUY_TOKENS_VIEW.AMOUNT_REQUESTED')}}</th>
              <th class="allocationInfo__tableTabs">
                <img style="width: 23px; margin-right:8px;" src="@/assets/svg/C4E.svg">
                <CoinAmount
                  :amount="transaction.amountRequested"
                  :show-denom="true"
                  :reduce-big-number="false"
                  :precision="2"/></th>
            </tr>
            <tr>
              <th class="allocationInfo__tableTabs">Date</th>
              <th class="allocationInfo__tableTabs">{{ formattedDate(transaction.timestamp) }}</th>
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
            <tr v-if="transaction.unconfirmed">
              <th class="allocationInfo__tableTabs">Unconfirmed</th>
              <th class="allocationInfo__tableTabs">{{ transaction.unconfirmed }}</th>
            </tr>
            <tr>
              <th class="allocationInfo__tableTabs">Round</th>
              <th class="allocationInfo__tableTabs">{{ getRoundName(transaction.roundId) }}</th>
            </tr>
            <tr v-if="transaction.transactions.length>0">
              <th class="allocationInfo__tableTabs">Transactions</th>
              <th class="allocationInfo__tableTabs"></th>
            </tr>

          </table>
        </div>
        <div class="table__second_column">
          <table cellspacing="0" cellpadding="0" class="allocationInfo__table smaller">
            <tr >
              <th class="allocationInfo__tableTabs">Left to pay</th>
              <th class="allocationInfo__tableTabs">
                <img src="../../assets/stablecoin.png" alt="stablecoin symbol" style="width: 23px; margin-right:8px;"/>
                {{ transaction.leftToPayInStableCoin().toFixed(6) }} USDT
              </th>
            </tr>
            <tr >
              <th class="allocationInfo__tableTabs">Left to buy</th>
              <th class="allocationInfo__tableTabs">
                <img style="width: 23px; margin-right:8px;" src="@/assets/svg/C4E.svg">
                {{ transaction.leftToBuyC4E().toFixed(6) }} C4E
              </th>
            </tr>
            <tr>
              <th></th>
              <th>
                <Button
                  class="p-button p-component secondary accountInfo__btn allocationInfo__btn"
                  v-if="props.transaction.status === RESERVATION_STATUS.DECLARED || props.transaction.status === RESERVATION_STATUS.PARTIALLY_PAID"
                  @click="submit"
                >Pay</Button>
              </th>
            </tr>
          </table>
        </div>

      </div>



    </div>

    <Accordion :multiple="true" style="white-space: normal;">
      <AccordionTab v-for="blockchainTransaction in transaction.transactions" :key="blockchainTransaction">
        <template #header >
          <div style="width:95%;overflow-wrap: break-word; word-wrap: break-word; text-align: left">
            {{$t('ENUMS.BLOCKCHAIN_STATUS.'+blockchainTransaction.blockchainStatus)}} - {{blockchainTransaction.txHash}}
          </div>
        </template>
        <div class="allocationInfo__body">
          <table style=" width: 90%;table-layout: fixed;  border-collapse: separate; border-spacing: 6px;">

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
            <tr v-if="blockchainTransaction.amount">
              <th class="allocationInfo__tableTabs">Amount</th>
              <th class="allocationInfo__tableTabs">{{ blockchainTransaction.amount }}</th>
            </tr>
            <tr v-if="blockchainTransaction.currencyCode">
              <th class="allocationInfo__tableTabs">Currency</th>
              <th class="allocationInfo__tableTabs">{{ blockchainTransaction.currencyCode }}</th>
            </tr>
            <tr v-if="blockchainTransaction.blockchain">
              <th class="allocationInfo__tableTabs">Blockchain</th>
              <th class="allocationInfo__tableTabs">{{ blockchainTransaction.blockchain }}</th>
            </tr>
            <tr v-if="blockchainTransaction.txHash">
              <th class="allocationInfo__tableTabs">TxHash</th>
              <th class="allocationInfo__tableTabs" style="font-size: 1em">
                <a :href="blockchainTransaction.getTransactionLink()" target="_blank">{{ blockchainTransaction.txHash }}</a>
              </th>
            </tr>
            <tr v-if="blockchainTransaction.blockchainTxs.length>0">
              <th class="allocationInfo__tableTabs">Payments </th>
              <th>
                <div  style="display: flex; justify-content: center; margin-top:20px">
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

      </AccordionTab>
    </Accordion>
  </div>




</div>
</template>

<script setup lang="ts">
import {paymentType, TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import {RESERVATION_STATUS, TRANSACTION_STATUS} from "@/models/saleServiceCommons";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import {useI18n} from "vue-i18n";
import moment from "moment/moment";

const props = defineProps<{
  transaction: TokenReservation
}>();

let timeToPassId = 0;

const timeToPass = ref();
const i18n = useI18n();

onBeforeMount(() => {
  timeToPassId = window.setInterval(calculateTimeToPass, 1000);
});

onUnmounted(() => {
  window.clearInterval(timeToPassId);
});

const getReservationStatusClass = (status: RESERVATION_STATUS) => {
  switch (status) {
    case RESERVATION_STATUS.DECLARED:
      return 'payment-status-paid';
    case RESERVATION_STATUS.CANCELED:
      return 'payment-status-cancelled';
    case RESERVATION_STATUS.PARTIALLY_PAID:
      return 'payment-status-partially_paid';
    case RESERVATION_STATUS.REJECTED:
      return 'payment-status-rejected';
    case RESERVATION_STATUS.OVERPAID:
      return 'payment-status-overpaid';
    case RESERVATION_STATUS.COMPLETED:
      return 'payment-status-completed';

  }
};

const getReservationIcon = (status: RESERVATION_STATUS) => {
  switch (status) {
    case RESERVATION_STATUS.DECLARED:
      return 'CheckSquare';
    case RESERVATION_STATUS.CANCELED:
      return 'XCircle';
    case RESERVATION_STATUS.PARTIALLY_PAID:
      return 'CheckSquare';
    case RESERVATION_STATUS.REJECTED:
      return 'XCircle';
    case RESERVATION_STATUS.OVERPAID:
      return 'CheckSquare';
    case RESERVATION_STATUS.COMPLETED:
      return 'CheckSquare';
    default:
      return ''

  }
};

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


const getRoundName = (roundId: number) => {
  return usePublicSalesStore().roundInfoMap.get(roundId)?.roundInfo.name;
};
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

const formattedDate = (value: Date) => {
  return moment(value).format('DD.MM.YYYY HH:mm:ss');
};
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.allocationInfo{
  display: flex;
  flex-direction: column;
  margin-top: 36px;

  background: #FFFFFF;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  &__head{
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    text-align: start;

    .title {
      float: left;
      padding: 21px 27px 0 27px;

      font-size: 24px;
      border-radius: 15px;
    }

    .payment-status {
      float: right;
      height: 50px;
      width: 180px;
      padding: 15px 0px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 0 10px 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-completed {
        background-color: $primary-green-color;
      }
      &-partialy_paid {
        background-color: #FDDB2A;
      }
      &-overpaid {
        background-color: #F58925;
      }
      &-rejected {
        background-color: $error-red-color;
      }
      &-cancelled {
        background-color: grey;
      }
      &-declared {
        background-color: $processing;
      }
    }
  }
  &__body{
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;

    .table {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      @media (max-width: 850px) {
        display: block;
      }
      &__first_column {

      }
      &__second_column {

      }
    }
  }
  &__container {
    padding: 11px 27px;
  }
  &__table{
    width: 100%;
  }
  .smaller th:first-child{
    width: 200px;

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
    overflow-wrap: break-word;
  }
  tr {
    border-style: none;
  }

  th:first-child{
    width: 300px;

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
@media (max-width: 1200px) {
  .allocationInfo {
    &__tableTabs{
      font-size: 16px;
    }
    th:first-child{
      width: 200px !important;

    }
  }
}
@media (max-width: 600px) {
  .allocationInfo {

    th:first-child{
      width: 150px !important;

    }
  }
}

</style>
