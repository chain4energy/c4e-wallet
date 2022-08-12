<template>
    <span>{{transformToExpView()}}</span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import i18n from "@/plugins/i18n";
import { formatBigNumber, reduceBigNumber } from "@/utils/locale-number-formatter";

const props = defineProps<{
  amount: bigint | number | BigDecimal,
  precision?: number,
  reduceBigNumber?: boolean,
}>()

function transformToExpView() {
  const locale = i18n.global.t('NUMBER_FORMAT_LOCALE');
  if (props.reduceBigNumber) {
    return reduceBigNumber(locale, props.amount, props.precision || 4);
  }
  return formatBigNumber(locale, typeof props.amount === 'bigint' ? props.amount.toString() : props.amount.toFixed(props.precision || 4));
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
