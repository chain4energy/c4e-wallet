<template>
    <span>{{transformToExpView()}}</span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { PropType } from "vue";
import { formatBigNumberLocalized, reduceBigNumberLocalized } from "@/utils/locale-number-formatter";

// const props = defineProps<{
//   amount: bigint | number | BigDecimal ,
// //   amount: [Object, Number, BigDecimal] as PropType<bigint | number | BigDecimal>,
//   precision?: number,
//   reduceBigNumber?: boolean,
// }>();

// whatever: BigInt as unknown as PropType<bigint>,

const props =  defineProps({
  amount: {
    type:  [Object , Number, BigDecimal] as PropType<bigint | number | BigDecimal>,
    required: true
  },
  precision: {
    type : Number,
    required: false
  } ,
  reduceBigNumber: {
    type : Boolean,
    required: false
  },
});

function transformToExpView() {
  if (typeof props.amount === 'number' && isNaN(props.amount)) {
    return Number.NaN.toString(); // TODO some text?
  }
  if (props.reduceBigNumber) {
    return reduceBigNumberLocalized(props.amount, props.precision || 4);
  }
  return formatBigNumberLocalized(typeof props.amount === 'bigint' ? props.amount.toString() : props.amount.toFixed(props.precision || 4));
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
</style>
