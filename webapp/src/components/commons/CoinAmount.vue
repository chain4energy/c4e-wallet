<template>
    <span v-tooltip="{ value: retrieveConvertedAmount() + ' ' + getDenom(), disabled:!props.showTooltip, class:'coin-amount-tooltip'}">
      <FormattedNumber :amount="retrieveConvertedAmount()" :precision="precision" :reduceBigNumber="reduceBigNumber" />
      <span v-if="showDenom">&nbsp;{{ getDenom()}}</span>
    </span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import FormattedNumber from "./FormattedNumber.vue";

import {PropType} from "vue";

// const props = withDefaults(defineProps<{
//   amount:  bigint | number | BigDecimal | Coin | DecCoin,
//   precision?: number,
//   reduceBigNumber?: boolean,
//   showDenom?: boolean,
//   showTooltip?: boolean
// }>(),{showTooltip: false});


const props =  defineProps({
  amount: {
    type:  [BigIntWrapper, Number, BigDecimal, Coin, DecCoin] as PropType<BigIntWrapper | number | BigDecimal | Coin | DecCoin>,
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
});

function getDenom(): string {
  if (props.amount instanceof Coin || props.amount instanceof DecCoin) {
    return useConfigurationStore().config.getConvertedDenom(props.amount.denom);
  } else {
    return useConfigurationStore().config.getConvertedDenom();
  }
}

function retrieveConvertedAmount(): number | BigDecimal {
  if (props.amount instanceof Coin || props.amount instanceof DecCoin ) {
    return useConfigurationStore().config.getConvertedAmount(props.amount.amount, props.amount.denom);
  } else if(props.amount instanceof BigIntWrapper){
    return useConfigurationStore().config.getConvertedAmount(props.amount.value);
  }
  else {
    return useConfigurationStore().config.getConvertedAmount(props.amount);
  }
}

</script>

<style scoped lang="scss">
.amount{
  display: flex;
  align-items: center;
  width: 100%;
  &__amount{
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}

span {
  font-weight: bold;
}



</style>
