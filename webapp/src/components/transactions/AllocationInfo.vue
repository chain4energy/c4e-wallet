<template>
<div class="allocationInfo">
  <div class="allocationInfo__head">
    <span class="title">Allocation info</span>
    <div class="payment-status" style="float: right; text-align:center" :class="getReservationStatusClass(transaction.status)">
      <Icon :name="getReservationIcon(transaction.status)"></Icon> &nbsp;
      {{ i18n.t('ENUMS.RESERVATION_STATUS.'+transaction.status)  }}
    </div>
    <span v-if="transaction.unconfirmed" class="title" style="float: right; text-align: center">
      <Icon style="width:30px; height:30px; margin-bottom:2px" name="Clock" />
      Waiting for confirmation
    </span>
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
<!--            <tr v-if="transaction.unconfirmed">-->
<!--              <th class="allocationInfo__tableTabs">Unconfirmed</th>-->
<!--              <th class="allocationInfo__tableTabs">{{ transaction.unconfirmed }}</th>-->
<!--            </tr>-->
            <tr>
              <th class="allocationInfo__tableTabs">Round</th>
              <th class="allocationInfo__tableTabs">{{ getRoundName(transaction.roundId) }}</th>
            </tr>

          </table>
        </div>
        <div class="table__second_column">
          <table v-if="transaction.status == RESERVATION_STATUS.DECLARED || transaction.status == RESERVATION_STATUS.PARTIALLY_PAID || transaction.status == RESERVATION_STATUS.OVERPAID" cellspacing="0" cellpadding="0" class="allocationInfo__table smaller">
            <tr v-if="transaction.status == RESERVATION_STATUS.DECLARED || transaction.status == RESERVATION_STATUS.PARTIALLY_PAID">
              <th class="allocationInfo__tableTabs">Left to pay</th>
              <th class="allocationInfo__tableTabs">
                <img src="../../assets/stablecoin.png" alt="stablecoin symbol" style="width: 23px; margin-right:8px;"/>
                {{ transaction.leftToPayInStableCoin().toFixed(6) }} USDC/USDT
              </th>
            </tr>
            <tr v-if="transaction.status == RESERVATION_STATUS.DECLARED || transaction.status == RESERVATION_STATUS.PARTIALLY_PAID">
              <th class="allocationInfo__tableTabs">Left to buy</th>
              <th class="allocationInfo__tableTabs">
                <img style="width: 23px; margin-right:8px;" src="@/assets/svg/C4E.svg">
                {{ transaction.leftToBuyC4E().toFixed(6) }} C4E
              </th>
            </tr>
            <tr v-if="transaction.status == RESERVATION_STATUS.OVERPAID">
              <th class="allocationInfo__tableTabs">Overpaid</th>
              <th class="allocationInfo__tableTabs">
                <img style="width: 23px; margin-right:8px;" src="@/assets/svg/C4E.svg">
                {{ transaction.getOverpaid().toFixed(6) }} USDC/USDT
              </th>
            </tr>
            <tr v-if="transaction.status == RESERVATION_STATUS.DECLARED || transaction.status == RESERVATION_STATUS.PARTIALLY_PAID">
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
    <div v-if="transaction.transactions.length>0" class="transactions">
      Transactions
    </div>
    <Accordion :multiple="true" style="white-space: normal;">
      <AccordionTab v-for="blockchainTransaction in transaction.transactions" :key="blockchainTransaction">
        <template #header >
          <div class="accordion_container" >
            <div class="accordion_container__content" style="max-width:70%">
              <div style=" text-align: left; " v-if="blockchainTransaction.type ==PAYMENT_TYPE.COIN">
                <!--            {{$t('ENUMS.BLOCKCHAIN_STATUS.'+blockchainTransaction.blockchainStatus)}} - {{blockchainTransaction.txHash}}-->
                <a style="margin-right:10px" :href="blockchainTransaction.getTransactionLink()" target="_blank">TX: {{ addDotsInsideTooLongString(blockchainTransaction.txHash, 10) }}</a>
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.SEPOLIA" style="width: 23px; margin-right:4px;" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" />
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.BSC" style="width: 23px; margin-right:4px;" src="../../assets/BSCIcon.png" alt="stablecoin symbol" />
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.POLYGON" style="width: 23px; margin-right:4px;" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" />
              </div>
              <div style="white-space: nowrap; padding:0 30px" v-if="blockchainTransaction.blockchainStatus == BLOCKCHAIN_STATUS.CONFIRMED && blockchainTransaction.type ==PAYMENT_TYPE.COIN">
                <span style=" margin-right:5px">{{blockchainTransaction.getSumOfPayments(TOKEN_NAME.USDC).toFixed(2)}}</span>
                <img style="width: 23px; margin-right:4px;" src="../../assets/USDC-icon.png" alt="stablecoin symbol" />
                <span style="margin-left:40px; margin-right:5px">{{blockchainTransaction.getSumOfPayments(TOKEN_NAME.USDT).toFixed(2)}}</span>
                <img style="width: 23px; margin-right:4px;"  src="../../assets/USDT-icon.png" alt="stablecoin symbol"/>
              </div>
              <div style=" text-align: left; " v-if="blockchainTransaction.type ==PAYMENT_TYPE.FIAT">
                <CountryFlag :country="getFlagSelector(blockchainTransaction.currencyCode)"/>
                <a style="margin-right:10px; margin-left: 10px;" :href="blockchainTransaction.getTransactionLink()" target="_blank">{{blockchainTransaction.currencyCode}} Payment</a>
              </div>
              <div style="white-space: nowrap; padding:0 60px" v-if="blockchainTransaction.type ==PAYMENT_TYPE.FIAT">
                <span style=" margin-right:5px">{{blockchainTransaction.amount}}</span>
                <CountryFlag :country="getFlagSelector(blockchainTransaction.currencyCode)"/>

              </div>
              <div v-if="blockchainTransaction.blockchainStatus == BLOCKCHAIN_STATUS.UNCONFIRMED" style="padding:0 30px">
              <span  class="title" style="float: right;">
                <Icon style="width:30px; height:30px; margin-bottom:2px" name="Clock" />
                Waiting for confirmation
              </span>
              </div>
            </div>


            <div class="transaction_status transaction_status-completed" :class="getTransactionStatusClass(blockchainTransaction.status)"  >
              {{ i18n.t('ENUMS.TRANSACTION_STATUS.'+blockchainTransaction.status) }}
            </div>
          </div>

        </template>
        <div class="reservation_table">
          <table style=" width: 100%; table-layout: fixed;  border-collapse: separate; border-spacing: 6px;">

            <tr v-if="blockchainTransaction.blockchain">
              <th class="reservation_table__tab">Blockchain</th>
              <th class="reservation_table__tab">
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.SEPOLIA" style="width: 23px; margin-right:4px;" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" />
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.BSC" style="width: 23px; margin-right:4px;" src="../../assets/BSCIcon.png" alt="stablecoin symbol" />
                <img v-if="blockchainTransaction.blockchain == CHAIN_NAME.POLYGON" style="width: 23px; margin-right:4px;" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" />
                {{ blockchainTransaction.blockchain }}
              </th>
            </tr>
            <tr v-if="blockchainTransaction.txHash">
              <th class="reservation_table__tab">TxHash</th>
              <th class="reservation_table__tab">
                <a :href="blockchainTransaction.getTransactionLink()" target="_blank">{{ addDotsInsideTooLongString(blockchainTransaction.txHash, 28) }}</a>
              </th>
            </tr>
<!--            <tr>-->
<!--              <th class="reservation_table__tab">Type</th>-->
<!--              <th class="reservation_table__tab">{{ blockchainTransaction.type }}</th>-->
<!--            </tr>-->
<!--            <tr v-if="blockchainTransaction.amount">-->
<!--              <th class="reservation_table__tab">Amount</th>-->
<!--              <th class="reservation_table__tab">{{ blockchainTransaction.amount }}</th>-->
<!--            </tr>-->
<!--            <tr v-if="blockchainTransaction.currencyCode">-->
<!--              <th class="reservation_table__tab">Currency</th>-->
<!--              <th class="reservation_table__tab">{{ blockchainTransaction.currencyCode }}</th>-->
<!--            </tr>-->

            <tr v-if="blockchainTransaction.blockchainTxs.length>0 && blockchainTransaction.type == PAYMENT_TYPE.COIN">
              <th class="reservation_table__tab">Payments </th>
              <th class="row_visible">
                <div style="display:flex; align-items:center; width:100%" v-for="blockchainTx in blockchainTransaction.blockchainTxs" :key="blockchainTx">
                  <span class="no_wrap">
                            <img style="width: 23px; margin-right:4px;" v-if="blockchainTx.coinName == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" />
                  <img style="width: 23px; margin-right:4px;" v-if="blockchainTx.coinName == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol"/>
                  {{blockchainTx.amount}} {{blockchainTx.coinName}}
                  </span>

                  <i class="gg-arrow-long-right"></i>
                  <span class="no_wrap">
                          <img style="width: 23px; margin-right:4px;" src="@/assets/svg/C4E.svg">~{{blockchainTx.getInC4E().toFixed(6)}} C4E
                  </span>

                </div>
              </th>
            </tr>
            <tr  v-if="blockchainTransaction.type == PAYMENT_TYPE.FIAT">
              <th class="reservation_table__tab">Payments </th>
              <th class="row_visible">
                <div style="display:flex; align-items:center" >
                  <CountryFlag :country="getFlagSelector(blockchainTransaction.currencyCode)"/> &nbsp;
                  {{blockchainTransaction.amount}} {{blockchainTransaction.currencyCode}}
                  <i class="gg-arrow-long-right"></i>
                  <img style="width: 23px; margin-right:4px;" src="@/assets/svg/C4E.svg">~{{blockchainTransaction.amount*exchangeRateMap.get(blockchainTransaction.currencyCode)?.toFixed(6)}} C4E
                </div>
              </th>
            </tr>

          </table>
          <div v-if="blockchainTransaction.type == PAYMENT_TYPE.COIN">
            <div class="under_table_visible" v-for="blockchainTx in blockchainTransaction.blockchainTxs" :key="blockchainTx">
              <img style="width: 23px; margin-right:4px;" v-if="blockchainTx.coinName == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" />
              <img style="width: 23px; margin-right:4px;" v-if="blockchainTx.coinName == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol"/>
              {{blockchainTx.amount}} {{blockchainTx.coinName}}
              <i class="gg-arrow-long-right"></i>
              <img style="width: 23px; margin-right:4px;" src="@/assets/svg/C4E.svg">~{{blockchainTx.getInC4E().toFixed(6)}} C4E
            </div>
          </div>
        </div>
        <div class="under_table_visible" v-if="blockchainTransaction.type == PAYMENT_TYPE.FIAT">
          <CountryFlag :country="getFlagSelector(blockchainTransaction.currencyCode)"/> &nbsp;
          {{blockchainTransaction.amount}} {{blockchainTransaction.currencyCode}}
          <i class="gg-arrow-long-right"></i>
          <img style="width: 23px; margin-right:4px;" src="@/assets/svg/C4E.svg">~{{blockchainTransaction.amount*exchangeRateMap.get(blockchainTransaction.currencyCode)?.toFixed(6)}} C4E
        </div>

      </AccordionTab>
    </Accordion>
  </div>




</div>
</template>

<script setup lang="ts">
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import {
  BLOCKCHAIN_STATUS,
  CHAIN_NAME,
  PAYMENT_TYPE,
  RESERVATION_STATUS,
  TOKEN_NAME, TRANSACTION_CURRENCY,
  TRANSACTION_STATUS
} from "@/models/saleServiceCommons";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import {useI18n} from "vue-i18n";
import {addDotsInsideTooLongString} from "@/utils/string-formatter";
import moment from "moment/moment";
import {Currency} from "@/models/currency";
import CountryFlag from "vue-country-flag-next";
import {BigDecimal} from "@/models/store/big.decimal";
const props = defineProps<{
  transaction: TokenReservation
}>();

let timeToPassId = 0;

const timeToPass = ref();
const i18n = useI18n();

onBeforeMount(() => {
  timeToPassId = window.setInterval(calculateTimeToPass, 1000);

  const values = Object.values(TRANSACTION_CURRENCY);

  values.forEach((value, _) => {
    calculateC4EAmount(value).then(res => {
      exchangeRateMap.set(value, res);
    });
  });

});

onUnmounted(() => {
  window.clearInterval(timeToPassId);
});

const exchangeRateMap = new Map<TRANSACTION_CURRENCY, BigDecimal>();
const getReservationStatusClass = (status: RESERVATION_STATUS) => {
  switch (status) {
    case RESERVATION_STATUS.DECLARED:
      return 'payment-status-declared';
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

const getTransactionStatusClass = (status: TRANSACTION_STATUS) => {
  switch (status) {
    case TRANSACTION_STATUS.NOT_VERIFIED:
      return 'transaction_status-entered';
    case TRANSACTION_STATUS.OK:
      return 'transaction_status-ok';
    default:
      return 'transaction_status-error';
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

const getFlagSelector = (currency: TRANSACTION_CURRENCY) => {
  switch (currency) {
    case TRANSACTION_CURRENCY.PLN:
      return 'pl';
    case TRANSACTION_CURRENCY.EUR:
      return 'eu';
    case TRANSACTION_CURRENCY.USD:
      return 'us';
  }
};
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

const calculateC4EAmount = async (currency: TRANSACTION_CURRENCY): Promise<BigDecimal> => {
  const amountInFiat = 100;
    const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json", "Ari10-Widget-Id": "41875703-9ee2-4729-9d51-e574c61467c3"},
    body: JSON.stringify({"offeredCurrencyCode": currency, "offeredAmount": amountInFiat})
  };
  let amount = new BigDecimal(0);
  await fetch("https://xqkzzpmim7.eu-west-1.awsapprunner.com/currencies/USDT/calculate", requestOptions)
    .then(response => response.json())
    .then(data => {
      const c4eTOUSDT = usePublicSalesStore().getC4eToUSD;

      if (c4eTOUSDT != undefined) {

        amount = new BigDecimal(data.amount).divide(c4eTOUSDT).divide(new BigDecimal(amountInFiat));
      }
    });
  return amount;
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
      margin-right: 0;
      border-radius: 0 10px 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-completed {
        background-color: $primary-green-color;
      }
      &-partially_paid {
        background-color: #FDDB2A;
      }
      &-overpaid {
        background-color: #F58925;
      }
      &-rejected {
        background-color: #E02626;
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
      margin-bottom:0;
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
.transactions {
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 28px;
  color: #858585;
  text-align: left;
}
#txs {
  font-family: Arial, Helvetica, sans-serif;

  width: 100%;
}

#txs td, #txs th {
  border: 1px solid #ddd;
  padding: 8px;
}

.transaction_status {
  padding:10px;
  color: black;
  float: right;
  height: 100%;
  width: 30%;
  max-width: 180px;
  margin-left: auto;
  margin-right: 0;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right:0;
  &-ok {
    background-color: $primary-green-color;
  }
  &-error {
    background-color: #E02626;
  }
  &-entered {
    background-color: $processing;
  }
}
.no_wrap {
  white-space: nowrap;
}
.accordion_container {
  width:100%;
  display: flex;
  align-items: center;

  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }
}
.row_visible {
  display: block;
}
.under_table_visible {
  display: none;
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

.reservation_table {
  width:100%;
  &__tab {
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 28px;
    color: #858585;
  }
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
  .reservation_table {

    &__tab {
      font-size: 16px;
    }
    th:first-child{
      width: 150px !important;

    }
  }
}
@media (max-width: 750px) {
  .row_visible {
    display: none;
  }
  .under_table_visible {
    display:flex;
    width:100%;
    align-items:center;
    justify-content: center;
  }
}
@media (max-width: 600px) {
  .allocationInfo {

    th:first-child{
      width: 180px !important;

    }

    &__head {

      .title {
        font-size: 1.2em;
      }
      .payment-status {
        font-size: 1.1em;
        width:130px;

      }
    }
  }

  .reservation_table {
    th:first-child{
      width: 100px !important;

    }
  }
}
.gg-arrow-long-right {
  margin-left:10px;
  margin-right:10px;
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs,1));
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  box-shadow: inset 0 0 0 2px;
  width: 114px;
  height: 6px
}
.gg-arrow-long-right::after {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 6px;
  height: 6px;
  border-top: 2px solid;
  border-right: 2px solid;
  transform: rotate(45deg);
  right: 0;
  bottom: -2px
}


</style>
<style lang="css">
.p-accordion .p-accordion-tab:first-child .p-accordion-header .p-accordion-header-link,
.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link,
.p-accordion .p-accordion-tab:last-child .p-accordion-header:not(.p-highlight) .p-accordion-header-link{
  padding:0;
  padding-left:10px;
  border-radius:10px;
}
.p-accordion .p-accordion-tab .p-accordion-content {
  padding: 10px;
}
.accordion_container {
  position: relative;
  min-height: 50px;
}
</style>
