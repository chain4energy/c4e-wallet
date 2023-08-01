<template>
  <div class="calculatorC4E">
    <div class="calculatorC4E__header">
      {{$t('BUY_TOKENS_VIEW.CALCULATE_INVESTMENT')}}
      <span style="float:right;  font-weight: 300;font-size: 19px;"><TooltipComponent :tooltipText="$t('BUY_TOKENS_VIEW.REQUIREMENTS_TIP')">{{$t('BUY_TOKENS_VIEW.REQUIREMENTS')}}</TooltipComponent></span>
    </div>
    <div class="calculatorC4E__body">
      <div style=" flex: 1 1;">
        <div style="display: flex; flex-wrap: wrap; box-sizing: border-box">
          <div class="calculatorC4E__inputContainer">
            <span class="text">{{$t('BUY_TOKENS_VIEW.I_WANT_TO_BUY')}}</span>
            <div>
              <div style="display: flex; min-width:350px;">
                <input @paste="onFirstInputChange" @keyup="onFirstInputChange"  style="width: 100%;" class="calculatorC4E__input" type="number" :disabled="firstInputBlocked" v-model="firstValueInput">
                <Dropdown v-model="firstValue.currency" :options="[Currency.C4E]" :disabled="true"  placeholder="Select network" style="max-width:200px; height: 52px; " class="dropdown flex align-items-center">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <div class="flag flex align-items-center">
                        <C4EIcon size="30" icon="c4e-circle" />
                      </div>
                      <div>{{ slotProps.value}}</div>
                    </div>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <div class="flag flex align-items-center">
                        <C4EIcon size="30" icon="c4e-circle" />
                      </div>
                      <div>{{ slotProps.option }}</div>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
          <div class="calculatorC4E__inputContainer">
            <div>
              <span class="text">{{$t('BUY_TOKENS_VIEW.I_WANT_TO_INVEST')}}</span>
              <div style="display: flex; min-width:350px;">
                <input @paste="onSecondInputChange"  @keyup="onSecondInputChange"  style="width: 100%;" class="calculatorC4E__input" type="number" :disabled="firstInputBlocked" v-model="secondValueInput" >
                <Dropdown v-model="secondValue.currency" :options="currencyList" placeholder="Select network" style="max-width:200px; height: 52px; " class="dropdown flex align-items-center">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <div class="flag">
                        <CountryFlag v-if='slotProps.value !== Currency.STABLE'
                                     :country="flagSelector[slotProps.value]"/>
                        <img src="../../assets/stablecoin.png" alt="stablecoin symbol" class="h-full" v-else/>
                      </div>
                      <div>{{ slotProps.value}}</div>
                    </div>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <div class="flag">
                        <CountryFlag v-if='slotProps.option !== Currency.STABLE'
                                       :country="flagSelector[slotProps.option]"/>
                        <img src="../../assets/stablecoin.png" alt="stablecoin symbol" class="h-full" v-else/>
                      </div>
                      <div>{{ slotProps.option }}</div>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:30px">
          1 {{firstValue.currency}} = {{exchangeRate?.toString()}} {{secondValue.currency}}
        </div>
        <div class="calculatorC4E__btnSection">
<!--          <span style=" font-weight: 300;font-size: 19px;">{{$t('BUY_TOKENS_VIEW.REQUIREMENTS')}} <TooltipComponent :tooltipText="$t('BUY_TOKENS_VIEW.REQUIREMENTS_TIP')" /></span>-->
          <div v-tooltip="{ value: 'You cannot invest less then $25 and more than $10000', disabled: minimumRequired()}" >
            <Button class="p-button p-component secondary" :disabled="!minimumRequired()" style="width: 141px; " @click="onBuy">{{$t('BUTTONS.BUY')}}</Button>
          </div>
        </div>
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
import TooltipComponent from "@/components/TooltipComponent.vue";
import CountryFlag from 'vue-country-flag-next';
import C4EIcon from "@/components/commons/C4EIcon.vue";
import {BigDecimal} from "@/models/store/big.decimal";
import {DecCoin} from "@/models/store/common";
import {useConfigurationStore} from "@/store/configuration.store"; // https://www.npmjs.com/package/vue-country-flag-next


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
  secondInputDefaultValue: {
    type: Number,
    required: false
  },
  disableStablecoin: {
    type: Boolean,
    required: false,
    default: false
  },
  isDeclaration: {
    type: Boolean,
    required: false,
    default: true
  }
});

const emit = defineEmits(['onBuy']);

onBeforeMount(() => {
  usePublicSalesStore().fetchRoundInfo(useConfigurationStore().config.currentPublicSaleRoundId).then(() => {
    const rate =  usePublicSalesStore().getC4eToUSD;
    if(rate) {
      exchangeRate.value = rate;
    }
  });
  onCurrencyChange();
});

onMounted(() => {
  if(props.secondInputDefaultValue) {
    secondValue.amount = new DecCoin(new BigDecimal(props.secondInputDefaultValue),Currency.STABLE);
    secondValueInput.value = secondValue.amount.amount;
    onSecondInputChange();
  } else {
    firstValue.amount = new DecCoin(new BigDecimal(props.firstInputDefaultValue),Currency.C4E);

    if(useTransactionContextStore().orderModalVisible) {
      firstValue.amount = useTransactionContextStore().amountToBuy;
    }
    firstValueInput.value = firstValue.amount.amount;

    onFirstInputChange();
  }


});

const firstValue = reactive({
  amount: new DecCoin(new BigDecimal(0),Currency.C4E),
  currency: Currency.C4E
});

const secondValue = reactive({
  amount: new DecCoin(new BigDecimal(0),props.disableStablecoin ? Currency.USD : Currency.STABLE),
  currency: props.disableStablecoin ? Currency.USD : Currency.STABLE
});

const firstValueInput = ref();
const secondValueInput = ref();

const exchangeRate = ref<BigDecimal>(new BigDecimal(0));

const onFirstInputChange = () => {
  firstValue.amount = new DecCoin(new BigDecimal(firstValueInput.value), firstValue.currency);
  secondValue.amount = new DecCoin(ceilBigDecimal(exchangeRate.value.multiply(firstValue.amount.amount), secondValue.currency), secondValue.currency);
  secondValueInput.value = secondValue.amount.amount;
};

const onSecondInputChange = () => {
  secondValue.amount= new DecCoin(new BigDecimal(secondValueInput.value), secondValue.currency);
  firstValue.amount = new DecCoin(floorBigDecimal(secondValue.amount.amount.divide(exchangeRate.value), firstValue.currency), firstValue.currency);
  firstValueInput.value = firstValue.amount.amount;
};


watch(() => exchangeRate.value, () => {
  secondValue.amount = new DecCoin(ceilBigDecimal(exchangeRate.value.multiply(firstValue.amount.amount), secondValue.currency), secondValue.currency);
  secondValueInput.value = secondValue.amount.amount;
});

watch(() => secondValue.currency, () => {
  onCurrencyChange();
});

const onCurrencyChange = () => {
  if(secondValue.currency == Currency.USDT || secondValue.currency == Currency.USDC || secondValue.currency == Currency.STABLE) {
    const rate =  usePublicSalesStore().getC4eToUSD;
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
        const c4eTOUSDT = usePublicSalesStore().getC4eToUSD;

        if(c4eTOUSDT != undefined) {
          exchangeRate.value = c4eTOUSDT.multiply(requestedAmount).divide(data.amount);
        }
      });
  }
};

const currencyList = computed(() => {
  if(props.disableStablecoin == false) {
    return [Currency.STABLE, Currency.EUR, Currency.USD, Currency.PLN];
  } else return [ Currency.EUR, Currency.USD, Currency.PLN];
});

const transactionContextStore = useTransactionContextStore();
const router = useRouter();

const onBuy = () => {
  if(!useUserServiceStore().isLoggedIn) {
    router.push({name: 'signIn'});
  } else {
    transactionContextStore.setAmountToBuy(firstValue.amount);
    transactionContextStore.setAmountToPay(secondValue.amount);
    transactionContextStore.setPaymentCurrency(secondValue.currency);
    transactionContextStore.setExchangeRate(exchangeRate.value);
    emit('onBuy');
  }
};

// const round = (number: number, currency: Currency) => {
//   let decimals = 2;
//   if (currency === Currency.STABLE || currency === Currency.C4E) decimals = 6;
//   return Math.ceil(number*10**decimals)/10**decimals;
// };

const ceilBigDecimal = (number: BigDecimal, currency: Currency) => {
  let decimals = 2;
  if (currency === Currency.STABLE || currency === Currency.C4E) decimals = 6;
  return number.ceil(decimals);
};

const floorBigDecimal = (number: BigDecimal, currency: Currency) => {
  let decimals = 2;
  if (currency === Currency.STABLE || currency === Currency.C4E) decimals = 6;
  return number.floor(decimals);
};
const minimumRequired = () => {
  return (usePublicSalesStore().getC4eToUSD.multiply(firstValue.amount.amount).isBiggerThanOrEqualTo(25) && !usePublicSalesStore().getC4eToUSD.multiply(firstValue.amount.amount).isBiggerThanOrEqualTo(10000)) || !props.isDeclaration;
};

const flagSelector = {
  EUR: 'eu',
  USD: 'us',
  PLN: 'pl'
};
</script>

<style scoped lang="scss">
.calculatorC4E{
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 32px 33px 26px 32px;
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
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
  }
  &__inputContainer{
    text-align: start;
    //max-width:500px;
    flex: 1 1;
    margin: 20px 20px 0px 20px;

    .text {
      font-size: 0.9em;
    }
  }
  &__btnSection{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 15px;

    //flex-direction: column;
    //font-size: 16px;
    //flex: 1 1;
    //max-width: 160px;
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
//:deep(.p-dropdown .p-dropdown-trigger){
//  display: none !important;
//}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
