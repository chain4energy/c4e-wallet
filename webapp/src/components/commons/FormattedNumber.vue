<template>
    <span>{{transformToExpView()}}</span>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import { Coin, DecCoin } from "@/models/store/common";
import i18n from "@/plugins/i18n";
import { formatBigNumber, reduceBigNumber } from "@/utils/locale-number-formatter";

const props = defineProps<{
  amount: bigint | number | BigDecimal,
  precision?: number,
  reduceBigNumber?: boolean,
}>()

function retrieveConvertedAmount(): number | BigDecimal {
  if (props.amount instanceof Coin || props.amount instanceof DecCoin) {
    return useConfigurationStore().config.getConvertedAmount(props.amount.amount, props.amount.denom);
  } else {
    return useConfigurationStore().config.getConvertedAmount(props.amount);
  }
}

// function viewedAmount(): string {
//   return useConfigurationStore().config.getViewAmount(
//     retrieveAmount() || 0,
//     props.precision || 4,
//     props.reduceBigNumber || false);
// }

function transformToExpView() {
  // const amountStr = viewedAmount();
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
