<template>

  <div>
    <PortfolioSummary/>
    <PortfolioVesting/>
  </div>

</template>

<script setup lang="ts">

import PortfolioSummary from "@/components/portfolio/PortfolioSummary.vue";
import PortfolioVesting from "@/components/portfolio/PortfolioVesting.vue";
import {onMounted, onUnmounted} from "vue";
import dataService from "@/services/data.service";

onMounted(() => {
  dataService.onPortfolioSelected();
});

onUnmounted(() => {
  dataService.onPortfolioUnselected();
});

</script>

<style scoped lang="scss">

</style>
