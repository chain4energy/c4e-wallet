<template>
  <div class="calculatorC4E">
    <div class="calculatorC4E__header">
      {{$t('BUY_TOKENS_VIEW.CALCULATE_INVESTMENT')}}
      <span style="float:right;  font-weight: 300;font-size: 19px;">{{$t('BUY_TOKENS_VIEW.REQUIREMENTS')}} <TooltipComponent tooltipText="asdasd" /></span>
    </div>
    <div class="calculatorC4E__body">
      <div style="width:100%; margin-right: 70px">
        <div style="display: flex; width:100%; box-sizing: border-box">
          <div style="width:50%; margin-right: 40px" class="calculatorC4E__inputContainer">
            <p>{{$t('BUY_TOKENS_VIEW.I_WANT_TO_BUY')}}</p>
            <div>
              <div style="display: flex">
                <input @paste="onFirstInputChange" @keyup="onFirstInputChange" style="width: 100%;" class="calculatorC4E__input" type="text" v-model="firstValue.amount">
                <Dropdown v-model="firstValue.currency" :options="[Currency.C4E]"  placeholder="Select network" style="max-width:80px;" class="dropdown" />
              </div>
            </div>
          </div>

          <div style="width:50%" class="calculatorC4E__inputContainer">
            <div>
              <p>{{$t('BUY_TOKENS_VIEW.I_WANT_TO_INVEST')}}</p>
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

        <Button class="p-button p-component secondary" style="width: 141px;" @click="onBuy">{{$t('BUTTONS.BUY')}}</Button>
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {usePublicSalesStore} from "@/store/publicSales.store";
import Dropdown from "primevue/dropdown";
import {Currency} from "@/models/currency";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import {useToast} from "vue-toastification";
import TooltipComponent from "@/components/TooltipComponent.vue";

const emit = defineEmits(['onBuy']);
onBeforeMount(() => {
  usePublicSalesStore().fetchBlockchainInfo(false).then(() => {
    const rate =  usePublicSalesStore().roundInfo?.c4eToUsd;
    if(rate) {
      exchangeRate.value = rate;
    }
  });
});
onMounted(() => {

  firstValue.amount = 1000;
  onFirstInputChange();

});

const firstValue = reactive({
  amount: 0,
  currency: Currency.C4E
});

const secondValue = reactive({
  amount: 0,
  currency: Currency.STABLE
});


const exchangeRate = ref(1);

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
  if(secondValue.currency == Currency.USDT || secondValue.currency == Currency.USDC || secondValue.currency == Currency.STABLE) {
    const rate =  usePublicSalesStore().roundInfo?.c4eToUsd;
    if(rate) {
      exchangeRate.value = rate;
    }

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

const currencyList = [Currency.STABLE, Currency.EUR, Currency.USD, Currency.PLN];
const transactionContextStore = useTransactionContextStore();
const router = useRouter();

const onBuy = () => {
  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    transactionContextStore.setAmountToBuy(firstValue.amount);
    transactionContextStore.setAmountToPay(secondValue.amount);
    transactionContextStore.setPaymentCurrency(secondValue.currency);
    transactionContextStore.setExchangeRate(exchangeRate.value);
    emit('onBuy');
  }
};

const toast = useToast();

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
    margin-bottom:30px;
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
