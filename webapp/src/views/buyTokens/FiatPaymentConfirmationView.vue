<template>
  <div>
    <h1>Make Payment</h1>
    <span>Your order no. {{transactionContextStore.orderId}} has been placed successfully</span><br />
    <span>Your order have to ba pain in 24 hours, after this time it will be automatically canceled</span> <br />
    <span>Please use ARI10 gateway to pay your order</span>
    <div>
      <h2>Your order info</h2>
      <div>
        <div>Amount of coins: {{transactionContextStore.amountToBuy}}</div>
        <div>Amount of {{transactionContextStore.paymentCurrency}}: {{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</div>
        <div>Current exchange rate: 1 C4E = {{transactionContextStore.exchangeRate}} {{transactionContextStore.paymentCurrency}}</div>
      </div>
      <Button class="secondary" @click="onPay">GO TO ARI10 PAYMENT GATEWAY</Button>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useTransactionContextStore} from "@/store/transactionContext.store";
import {usePublicSalesStore} from "@/store/publicSales.store";

const transactionContextStore = useTransactionContextStore();

const onPay = () => {
  if(transactionContextStore.paymentCurrency){
    usePublicSalesStore().initPaymentSession({orderId: transactionContextStore.orderId, offeredCurrencyCode: transactionContextStore.paymentCurrency, offeredAmount: Number((Math.round(transactionContextStore.amountToPay * 100) / 100).toFixed(2))})
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

</style>
