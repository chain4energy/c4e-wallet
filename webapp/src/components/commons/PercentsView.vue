<template>
<div v-if="amount">{{ amount }} %</div>
</template>

<script setup lang="ts">

import { BigDecimal } from "@/models/store/big.decimal";
import { Coin, DecCoin } from "@/models/store/common";
import { computed } from "vue";

const props = defineProps<{
  amount: bigint | number | BigDecimal | Coin | DecCoin | undefined ,
  precision: number
}>();

const amount = computed(() => {
    if (typeof props.amount === 'number') {
      if (isNaN(props.amount)) {
        return Number.NaN.toString();
      }
      return (props.amount * 100).toFixed(props.precision || 2);
    } else {
      return (Number(props.amount) * 100).toFixed(props.precision || 2);
    }
})
</script>

<style scoped>

</style>
