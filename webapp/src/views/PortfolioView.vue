<template>

  <div>
    <PortfolioSummary/>
    <PortfolioVesting/>
  </div>

</template>

<script setup lang="ts">

import PortfolioSummary from "@/components/portfolio/PortfolioSummary.vue";
import PortfolioVesting from "@/components/portfolio/PortfolioVesting.vue";
import {onMounted} from "vue";
import {usePublicSalesStore} from "@/store/publicSales.store";

const publicSalesStore = usePublicSalesStore();

onMounted(() => {
  publicSalesStore.fetchRoundInfo();
});

</script>

<style scoped lang="scss">

</style>
