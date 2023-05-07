<template>
  <div class="info">
    <PublicSaleInfo />
    <InvestmentCalculator />
  </div>
</template>

<script lang="ts" setup>

import PublicSaleInfo from "@/components/buyTokens/PublicSaleInfo.vue";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
</script>

<style scoped>
.info{
  padding: 25px 54px;
}

</style>
