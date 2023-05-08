<template>
  <div class="info">
    <PublicSaleInfo />
    <InvestmentCalculator :rate="currency"/>
  </div>
</template>

<script lang="ts" setup>

import PublicSaleInfo from "@/components/buyTokens/PublicSaleInfo.vue";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import { usePublicSalesStore } from "@/store/publicSales.store";
import { computed } from "vue";
const publicSalesStore = usePublicSalesStore();
publicSalesStore.setParts();
publicSalesStore.setTotal();
publicSalesStore.setCurrentPrice();
const currency = computed(() => {
  return publicSalesStore.getC4eToUSDC;
});
</script>

<style scoped>
.info{
  padding: 25px 54px;
}

</style>
