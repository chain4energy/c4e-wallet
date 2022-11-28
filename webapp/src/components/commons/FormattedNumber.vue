<template>
    <span>{{transformToExpView()}}</span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { formatBigNumberLocalized, reduceBigNumberLocalized } from "@/utils/locale-number-formatter";

const props = defineProps<{
  amount: bigint | number | BigDecimal,
  precision?: number,
  reduceBigNumber?: boolean,
}>();

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
