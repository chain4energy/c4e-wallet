<template>
  <CoinAmount key="amount" :amount="amount" :precision="precision" :reduce-big-number="reduceBigNumber" :show-tooltip="true" :show-denom="true"/>
  <CoinAmount key="price" style="font-size: 0.7rem" :amount="new Coin(retrieveConvertedAmount(), 'USD')" :precision="precision" :reduce-big-number="reduceBigNumber" :show-tooltip="true" :show-denom="true"/>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import FormattedNumber from "./FormattedNumber.vue";

import {PropType} from "vue";
import {calculatePrice} from "@/utils/token-price";
import CoinAmount from "@/components/commons/CoinAmount.vue";

// const props = withDefaults(defineProps<{
//   amount:  bigint | number | BigDecimal | Coin | DecCoin,
//   precision?: number,
//   reduceBigNumber?: boolean,
//   showDenom?: boolean,
//   showTooltip?: boolean
// }>(),{showTooltip: false});


const props =  defineProps({
  amount: {
    type:  [BigIntWrapper, Number, BigDecimal, Coin, DecCoin, String] as PropType<BigIntWrapper | number | BigDecimal | Coin | DecCoin | string>,
    required: true,
  },
  precision: {
    type : Number,
    required: false
  },
  reduceBigNumber: {
    type : Boolean,
    required: false
  },
  showDenom: {
    type : Boolean,
    required: false
  },
  showTooltip: {
    type : Boolean,
    required: false,
    default: false
  },
  tooltipOnly: {
    type: Boolean,
    required: false
  }
});

function retrieveConvertedAmount(): number | BigDecimal {
  if (props.amount instanceof Coin || props.amount instanceof DecCoin ) {
    return useConfigurationStore().config.getConvertedAmount(props.amount.amount, props.amount.denom);
  } else if(props.amount instanceof BigIntWrapper){
    return useConfigurationStore().config.getConvertedAmount(props.amount.value);
  } else if(typeof (props.amount) === 'string'){
    return useConfigurationStore().config.getConvertedAmount(Number(props.amount));
  }
  else {
    return useConfigurationStore().config.getConvertedAmount(props.amount);
  }
}


</script>

<style scoped lang="scss">

</style>
