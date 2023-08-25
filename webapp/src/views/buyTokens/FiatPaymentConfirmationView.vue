<template>
  <div class="payment_container">
    <h1>Make Payment</h1>
    <span>Your order no. {{transactionContextStore.orderId}} has been placed successfully</span><br />
    <span>Your order have to ba pain in 24 hours, after this time it will be automatically canceled</span> <br />
    <span>Please use ARI10 gateway to pay your order</span>
    <div class="payment_container__content">
      <h2>Your order info</h2>
      <div class="box-shadow summary">
        <div>Amount of C4E: {{transactionContextStore.amountToBuy.amount}}</div>
        <div>Amount of {{transactionContextStore.paymentCurrency}}: {{transactionContextStore.amountToPay.amount}} {{transactionContextStore.paymentCurrency}}</div>
        <div>Current exchange rate: 1 C4E = {{transactionContextStore.exchangeRate.toFixed(5)}} {{transactionContextStore.paymentCurrency}}</div>
      </div>
      <Button class="secondary" @click="onPay">
        <img style="height:30px;" src="@/assets/ari10logo.svg">GO TO ARI10 PAYMENT GATEWAY
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useTransactionContextStore} from "@/store/transactionContext.store";
import {usePublicSalesStore} from "@/store/publicSales.store";

const transactionContextStore = useTransactionContextStore();

const onPay = () => {
  if(transactionContextStore.paymentCurrency){
    usePublicSalesStore().initPaymentSession({orderId: transactionContextStore.orderId, offeredCurrencyCode: transactionContextStore.paymentCurrency, offeredAmount: Number((Math.round(Number(transactionContextStore.amountToPay.amount.toString()) * 100) / 100).toFixed(2))})
      .then(transactionId => {
        if(transactionId) {
          window.dispatchEvent(
            new CustomEvent('ari10-widget-start-commodities-payment-request', {
              detail: {
                transactionId: transactionId,
              }
            })
          );
        }
      });
  }
};
</script>


<style scoped lang="scss">

.payment_container {
  padding: 10px 40px;
  text-align: left;
  font-weight: 500;
  font-size: 20px;
  color: black;
  &__content {
    text-align: center;
    margin: 40px auto;
    width: 50%;

    .summary {
      text-align: left;
      padding: 30px;
      margin-bottom: 20px;
    }
  }
}
</style>
