<template>
  <span><FormattedNumber :amount="amount" :precision="precision" :remove-dec="removeDec"/>%</span>
</template>

<script setup lang="ts">

import { BigDecimal } from "@/models/store/big.decimal";
import {computed, PropType} from "vue";
import FormattedNumber from "./FormattedNumber.vue";

// const props = defineProps<{
//   amount: bigint | number | BigDecimal ,
//   precision: number
// }>();

const props =  defineProps({
  amount: [Object, Number, BigDecimal] as PropType<bigint | number | BigDecimal>,
  precision: Number,
  removeDec: {
    type : Boolean,
    required: false,
    default: true
  },
});

const amount = computed(() => {
  if (typeof props.amount === 'number') {
    if (isNaN(props.amount)) {
      return Number.NaN;
    }
    return props.amount * 100;
  } else if (typeof props.amount === 'bigint') {
    return props.amount * 100n;
  } else if (props.amount){
    return props.amount.multiply(100);
  } else {
    return 0;
  }
});
</script>

<style scoped>

</style>
