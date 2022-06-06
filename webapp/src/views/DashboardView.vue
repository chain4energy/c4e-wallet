<template>
  <span>Dashboard View</span>
  <div class="dashboard">
    <dashboard-pools></dashboard-pools>
  </div>
  <div class="total-supply">
    <total-supply></total-supply>
  </div>
  <div class="latest-block">
    <latest-block></latest-block>
  </div>
  <div class="tokenomics">
    <tokenomics-dashboard></tokenomics-dashboard>
  </div>


</template>

<script setup lang="ts">

import DashboardPools from "@/components/dashboard/DashboardPools.vue";
import TotalSupply from "@/components/dashboard/TotalSupply.vue";
import LatestBlock from "@/components/dashboard/LatestBlock.vue";
import TokenomicsDashboard from "@/components/dashboard/TokenomicsDashboard.vue";
</script>

<style scoped lang="scss">

.dashboard{
  max-width: 450px;
  width: 100%;
  margin: auto;

}
.total-supply {
  max-width: 210px;
  margin: auto;
}
.latest-block{
  max-width: 210px;
  margin: auto;
}
.tokenomics {
  max-width: 550px;
  width: 100%;
  margin: auto;
}
</style>
