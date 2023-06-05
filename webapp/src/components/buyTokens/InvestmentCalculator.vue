<template>
  <div class="calculatorC4E">
    <div class="calculatorC4E__header">Calculate investment</div>
    <div class="calculatorC4E__body">
      <div style="width:100%; margin-right: 70px">
        <div style="display: flex; width:100%; box-sizing: border-box">
          <div style="width:50%; margin-right: 40px" class="calculatorC4E__inputContainer">
            <p>I want to buy</p>
            <div>
              <div style="display: flex">
                <input @paste="onFirstInputChange" @keyup="onFirstInputChange" style="width: 100%;" class="calculatorC4E__input" type="text" v-model="firstValue.amount">
                <Dropdown v-model="firstValue.currency" :options="[Currency.C4E]"  placeholder="Select network" style="max-width:80px;" class="dropdown" />
              </div>
            </div>
          </div>

          <div style="width:50%" class="calculatorC4E__inputContainer">
            <div>
              <p>I want to invest</p>
              <div style="display: flex">
                <input @paste="onSecondInputChange"  @keyup="onSecondInputChange" style="width: 100%;" class="calculatorC4E__input" type="text" v-model="secondValue.amount">
                <Dropdown v-model="secondValue.currency" :options="currencyList" placeholder="Select network" style="max-width:80px;" class="dropdown" />
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:30px">
          1 {{firstValue.currency}} = {{exchangeRate}} {{secondValue.currency}}
        </div>
      </div>

      <div class="calculatorC4E__btnSection">
        <p>Required</p>
        <span>terms acceptance</span>
        <span>proof of residence</span>
        <Button class="p-button p-component secondary" style="width: 141px;" @click="onBuy">Buy</Button>
      </div>

    </div>

    <Dialog v-model:visible="summaryVisible" closeIcon="false" modal header="Order summary" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px'}">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
        <h5 style="font-weight:700">You want to invest {{secondValue.amount}} {{secondValue.currency}}</h5>
        <div class="requirements_container">
          <div>Pass KYC - Level 2</div>
          <div><Button class="p-button p-component secondary">Start KYC</Button></div>
          <div>Accept sale terms</div>
          <div><Button class="p-button p-component secondary">Accept</Button></div>
          <div>Provide claimer address</div>
          <div><Button class="p-button p-component secondary">Provide address</Button></div>
          <div>Provide source address</div>
          <div><Button class="p-button p-component secondary">Provide address</Button></div>
        </div>
        <div style="display: flex">
          <Button class="p-button p-component secondary" @click="summaryVisible=false">Cancel order</Button>
          <Button class="p-button p-component secondary" @click="onConfirm">Confirm order</Button>
        </div>
      </div>

    </Dialog>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import { onMounted, reactive, ref, watch} from "vue";
import Dialog from 'primevue/dialog';
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {usePublicSalesStore} from "@/store/publicSales.store";
import Dropdown from "primevue/dropdown";
import {Currency} from "@/models/currency";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import {useToast} from "vue-toastification";

onMounted(() => {
  const c4eToUsdt = usePublicSalesStore().getC4eToUSDC;
  if(c4eToUsdt) {
    exchangeRate.value = c4eToUsdt;
  }
  firstValue.amount = 1000;
  onFirstInputChange();

});

const firstValue = reactive({
  amount: 0,
  currency: Currency.C4E
});

const secondValue = reactive({
  amount: 0,
  currency: Currency.USDT
});


const exchangeRate = ref(0.18);

const onFirstInputChange = () => {
  secondValue.amount = firstValue.amount * exchangeRate.value;
};

const onSecondInputChange = () => {
  firstValue.amount = secondValue.amount / exchangeRate.value;
};


watch(() => exchangeRate.value, () => {
  secondValue.amount = firstValue.amount * exchangeRate.value;
});

watch(() => secondValue.currency, () => {
  if(secondValue.currency == Currency.USDT || secondValue.currency == Currency.USDC) {
    exchangeRate.value = 0.18;
  } else {
    const requestedAmount = 100;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "Ari10-Widget-Id": "41875703-9ee2-4729-9d51-e574c61467c3" },
      body: JSON.stringify({"offeredCurrencyCode": secondValue.currency, "offeredAmount": requestedAmount })
    };
    fetch("https://xqkzzpmim7.eu-west-1.awsapprunner.com/currencies/USDT/calculate", requestOptions)
      .then(response => response.json())
      .then(data => {
        const c4eTOUSDT = usePublicSalesStore().getC4eToUSDC;
        if(c4eTOUSDT != undefined) {
          exchangeRate.value = c4eTOUSDT * requestedAmount / data.amount;
        }
      });
  }
});

const summaryVisible = ref(false);
const currencyList = [Currency.USDT, Currency.USDC, Currency.EUR, Currency.USD];
const transactionContextStore = useTransactionContextStore();
const router = useRouter();

const onBuy = () => {
  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    summaryVisible.value = true;
  }
};

const onConfirm = () => {

  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    summaryVisible.value = false;
    transactionContextStore.setAmountToBuy(firstValue.amount);
    transactionContextStore.setAmountToPay(secondValue.amount);
    transactionContextStore.setPaymentCurrency(secondValue.currency);
    onReserve();

  }
};
const publicSaleStore = usePublicSalesStore();
const toast = useToast();
const onReserve = () => {
  publicSaleStore.reserveTokens(Number(transactionContextStore.amountToBuy), onSuccess, onFail);
};
const onSuccess = (orderId: number) => {
  usePublicSalesStore().fetchTokenReservations();
  toast.success('Tokens reserved successfully');
  router.push({name: 'paymentConfirmation'});
};
const onFail = () => {
  toast.error('An error occured');
};
</script>

<style scoped lang="scss">
.calculatorC4E{
  margin-top: 29px;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 32px 33px 26px 116px;
  border-radius: 5px;
  &__header{
    width: 100%;
    text-align: left;
    font-weight: 700;
    font-size: 29px;
    line-height: 35px;
  }
  &__body{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__inputContainer{
    text-align: start;
    max-width:500px;

  }
  &__btnSection{
    display: flex;
    flex-direction: column;
    font-size: 16px;
  }
  &__input{
    height: 52px;
    padding: 20px 10px;
    background: #FFFFFF;
    border: 1px solid #81CF1F;
    border-radius: 8px 0 0 8px;
    text-align: end;

    &:focus-visible{
      border: 1px solid #81CF1F;
    }
    &:focus{
      border: 1px solid #81CF1F;
    }
    &:hover{
      border: 1px solid #81CF1F;
    }

  }
}
.requirements_container {
  padding: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;

  font-size: 18px;

}
</style>
<style lang="scss" scoped>
.dropdown {
  border: 1px solid #81CF1F !important;
  border-left-width: 0 !important;
  border-radius: 0 8px 8px 0 !important;

}
:deep(.p-dropdown .p-dropdown-label) {
  font-size: 18px;
  font-weight: bold;
}
:deep(.p-dropdown .p-dropdown-trigger){
  display: none !important;
}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
