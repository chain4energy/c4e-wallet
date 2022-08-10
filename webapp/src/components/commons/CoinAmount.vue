<template>
<div>
  {{amount}}
  <p v-if="coins.showDenom">{{coins.origDenom}}</p>
  {{coins.amount}}
</div>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import { computed, ref } from "vue";

const coins = defineProps<{
  amount: bigint | number | BigDecimal,
  precision: number,
  reduceBigNumber: boolean,
  origDenom: string,
  showDenom: boolean,
}>();

const amount = computed(() => {
  return useConfigurationStore().config.getViewAmount(
    coins.amount || 0,
    coins.precision || 4,
    coins.reduceBigNumber || false,
    coins.origDenom || 'c4e').toString();
});

const a = ref(useConfigurationStore().config.getViewAmount(
  coins.amount || 0,
  coins.precision || 4,
  coins.reduceBigNumber || false,
  coins.origDenom || 'c4e').toString());

</script>

<style scoped>

</style>
