<template>
  <div class="calculatorC4E">
    <div class="calculatorC4E__header">
      {{$t('BUY_TOKENS_VIEW.CALCULATE_INVESTMENT')}}
      <span style="float:right;  font-weight: 300;font-size: 19px;">{{$t('BUY_TOKENS_VIEW.REQUIREMENTS')}} <TooltipComponent :tooltipText="$t('BUY_TOKENS_VIEW.REQUIREMENTS_TIP')" /></span>
    </div>
    <div class="calculatorC4E__body">
      <div style="width:100%; margin-right: 70px">
        <div style="display: flex; width:100%; box-sizing: border-box">
          <div style="width:50%; margin-right: 40px" class="calculatorC4E__inputContainer">
            <p>{{$t('BUY_TOKENS_VIEW.I_WANT_TO_BUY')}}</p>
            <div>
              <div style="display: flex">
                <input @paste="onFirstInputChange" @keyup="onFirstInputChange" style="width: 100%;" class="calculatorC4E__input" type="text" :disabled="firstInputBlocked" v-model="firstValue.amount">
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
          1 {{firstValue.currency}} = {{exchangeRate.toFixed(5)}} {{secondValue.currency}}
        </div>
      </div>

      <div v-tooltip="{ value: 'You cannot invest less then $25 and more than $10000', disabled: minimumRequired()}" class="calculatorC4E__btnSection">

        <Button class="p-button p-component secondary" :disabled="!minimumRequired()" style="width: 141px;" @click="onBuy">{{$t('BUTTONS.BUY')}}</Button>
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {computed, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {usePublicSalesStore} from "@/store/publicSales.store";
import Dropdown from "primevue/dropdown";
import {Currency} from "@/models/currency";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import {useToast} from "vue-toastification";
import TooltipComponent from "@/components/TooltipComponent.vue";


const props =  defineProps({
  firstInputBlocked: {
    type:  Boolean,
    required: false,
    default: false
  },
  firstInputDefaultValue: {
    type: Number,
    required: false,
    default: 10000
  },
  disableStablecoin: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['onBuy']);
onBeforeMount(() => {
  usePublicSalesStore().fetchRoundInfo(false).then(() => {
    const rate =  usePublicSalesStore().roundInfo?.c4eToUsd;
    if(rate) {
      exchangeRate.value = rate;
    }
  });
});
onMounted(() => {

  firstValue.amount = props.firstInputDefaultValue;
  onFirstInputChange();

});

const firstValue = reactive({
  amount: 0,
  currency: Currency.C4E
});

const secondValue = reactive({
  amount: 0,
  currency: props.disableStablecoin ? Currency.USD : Currency.STABLE
});


const exchangeRate = ref(1);

const onFirstInputChange = () => {
  secondValue.amount = round(firstValue.amount * exchangeRate.value, secondValue.currency);
};

const onSecondInputChange = () => {
  firstValue.amount = round(secondValue.amount / exchangeRate.value, firstValue.currency);
};


watch(() => exchangeRate.value, () => {
  secondValue.amount = round(firstValue.amount * exchangeRate.value, secondValue.currency);
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
        const c4eTOUSDT = usePublicSalesStore().roundInfo?.c4eToUsd;

        if(c4eTOUSDT != undefined) {
          exchangeRate.value = c4eTOUSDT * requestedAmount / data.amount;
        }
      });
  }
});

const currencyList = computed(() => {
  if(props.disableStablecoin == false) {
    return [Currency.STABLE, Currency.EUR, Currency.USD, Currency.PLN];
  } else return [ Currency.EUR, Currency.USD, Currency.PLN];
});

const transactionContextStore = useTransactionContextStore();
const router = useRouter();

const onBuy = () => {
  if(!useUserServiceStore().isLoggedIn()) {
    router.push({name: 'signIn'});
  } else {
    transactionContextStore.setAmountToBuy(firstValue.amount);
    transactionContextStore.setAmountToPay(round(secondValue.amount,secondValue.currency));
    transactionContextStore.setPaymentCurrency(secondValue.currency);
    transactionContextStore.setExchangeRate(exchangeRate.value);
    emit('onBuy');
  }
};

const toast = useToast();

const round = (number: number, currency: string) => {
  let decimals = 2;
  if (currency === 'Stablecoin' || currency === 'C4E') decimals = 6;
  return Math.ceil(number*10**decimals)/10**decimals;
};

const minimumRequired = () => {
  return firstValue.amount * usePublicSalesStore().getC4eToUSD >= 25 && firstValue.amount * usePublicSalesStore().getC4eToUSD <=10000 ;
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
