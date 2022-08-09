<template>
<div>
  {{amount}}
</div>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import { computed } from "vue";

//let coins: Readonly<{ amount: bigint | number | BigDecimal; precision: number; reduceBigNumber: boolean; origDenom; default; "1" }>;
const coins = defineProps<{
  amount: bigint | number | BigDecimal,
  precision: number,
  reduceBigNumber: boolean,
  origDenom: string,
  showDenom: boolean,
}>();

const amount = computed(() => {
  return useConfigurationStore().config.getViewAmount(coins.amount,
    coins.precision || 4,
    coins.reduceBigNumber || false,
    coins.origDenom || 'c4e');
})



</script>

<style scoped>

</style>
