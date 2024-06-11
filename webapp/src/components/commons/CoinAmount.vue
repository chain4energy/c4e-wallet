<template>
    <span v-tooltip="{ value: (( denomAsPrefix ? getDenom() : '') + retrieveConvertedAmount().toFixed(tooltipPrecision) + ' ' + (!denomAsPrefix ? getDenom() : '')), disabled:!props.showTooltip, class:'coin-amount-tooltip'}">
     <span v-if="showDenom && !tooltipOnly && denomAsPrefix">&nbsp;{{ getDenom()}}</span>
     <FormattedNumber :amount="retrieveConvertedAmount()" :precision="precision" :reduceBigNumber="reduceBigNumber" v-if="!tooltipOnly" @click="copyValue"/>
     <span v-if="showDenom && !tooltipOnly && !denomAsPrefix">&nbsp;{{ getDenom()}}</span>
     <slot/>
   </span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import FormattedNumber from "./FormattedNumber.vue";

import {PropType} from "vue";
import {useToast} from "vue-toastification";
import i18n from "@/plugins/i18n";

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
  },
  denomAsPrefix: {
    type: Boolean,
    required: false
  },
  defaultViewDenom: {
    type : String,
    required: false
  },
  tooltipPrecision:{
    type : Number,
    required: false,
    default: 6
  },
  allowCopyValue:{
    type: Boolean,
    required: false,
    default: true
  }

});

function getDenom(): string {
  if (props.amount instanceof Coin || props.amount instanceof DecCoin) {
    return useConfigurationStore().config.getConvertedDenom(props.amount.denom);
  } else {
    if(props.defaultViewDenom){
      return props.defaultViewDenom;
    } else {
      return useConfigurationStore().config.getConvertedDenom();
    }
  }
}

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

function copyValue(){
  if(props.allowCopyValue) {
    navigator.clipboard.writeText(retrieveConvertedAmount().toFixed(6));
    useToast().success(i18n.global.t('COPY.VALUE'));
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
