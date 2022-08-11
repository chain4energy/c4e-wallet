<template>
  <div class="amount">
    <slot name="logo-front"></slot>
    <div class="amount__amount">
      <div v-for="(items, index) in props.coins" :key="index">
        <p v-if="items.header">{{items.header}}</p>
        <div style="display: flex">
          <p>{{transformToExpView(viewedAmount(items.amount))}}</p>
          <p v-if="showDenom">{{useConfigurationStore().config.getViewDenom()}}</p>
        </div>
      </div>
    </div>
    <slot name="logo-back"></slot>
  </div>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import { computed, ref } from "vue";
import { Coin, DecCoin } from "@/models/store/common";

const props = defineProps<{
  coins:[
    {
      header: string | undefined,
      amount: bigint | number | BigDecimal | Coin | DecCoin,
    }
  ]
  precision: number,
  reduceBigNumber: boolean,
  showDenom: boolean,
}>()

function viewedAmount(amount: bigint | number | BigDecimal ) {
  return useConfigurationStore().config.getViewAmount(
    amount || 0,
    props.precision || 4,
    props.reduceBigNumber || false);
}

function transformToExpView(amount: bigint | number | BigDecimal | Coin | DecCoin) {
  let internationalNumberFormat;
  if(props.reduceBigNumber){
    internationalNumberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: props.precision, notation: "compact",
      compactDisplay: "short"});
  } else {
    internationalNumberFormat = new Intl.NumberFormat("en-US", {minimumFractionDigits: props.precision});
  }

  const thousands =  internationalNumberFormat.format(amount);
  return thousands;
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
