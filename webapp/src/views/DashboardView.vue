<template>
  <div class="container">
    <span>Dashboard View</span>

    <dashboard-pools />

    <tokenomics-dashboard />

    <active-validators />


    <total-supply />

    <latest-block />

    <max-supply />
    <CirculatingSupply />
    <DashboardInflation />
    <StakingApr />
  </div>

</template>

<script setup lang="ts">

import DashboardPools from "@/components/dashboard/DashboardPools.vue";
import TotalSupply from "@/components/dashboard/TotalSupply.vue";
import LatestBlock from "@/components/dashboard/LatestBlock.vue";
import TokenomicsDashboard from "@/components/dashboard/TokenomicsDashboard.vue";
import ActiveValidators from "@/components/dashboard/ActiveValidators.vue";
import AverageBlockTime from "@/components/dashboard/AverageBlockTime.vue";
import MaxSupply from "@/components/dashboard/MaxSupply.vue";
import CirculatingSupply from "@/components/dashboard/CirculatingSupply.vue";
import DashboardInflation from "@/components/dashboard/DashboardInflation.vue";
import StakingApr from "@/components/dashboard/StakingApr.vue";

</script>

<style scoped lang="scss">
.container {
  padding-bottom: 10px;
}

</style>
