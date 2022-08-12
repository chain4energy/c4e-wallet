<template>
  <div class="amount">
    <slot name="logo-front"></slot>
    <div class="amount__amount">
      <div v-for="(items, index) in props.coins" :key="index">
        <p v-if="items.header">{{items.header}}</p>
        <CoinAmount :amount="items.amount" :precision="precision" :show-denom="showDenom" :reduce-big-number="reduceBigNumber"/>
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
import CoinAmount from "./CoinAmount.vue";

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
