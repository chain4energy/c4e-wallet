<template>
  <span>Dashboard View</span>
  <div class="dashboard">
    <dashboard-pools></dashboard-pools>
  </div>
  <div class="tokenomics">
    <tokenomics-dashboard></tokenomics-dashboard>
  </div>
  <div class="active-validators">
    <active-validators></active-validators>
  </div>
  <div class="active-validators">
    <average-block-time></average-block-time>
  </div>
  <div class="total-supply">
    <total-supply></total-supply>
  </div>
  <div class="latest-block">
    <latest-block></latest-block>
  </div>
  <div class="max-supply">
    <max-supply />
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

</script>

<style scoped lang="scss">

.dashboard{
  max-width: 450px;
  width: 100%;
  margin: auto auto 30px;

}
.active-validators{
  max-width: 210px;
  margin: auto auto 30px;
}
.total-supply {
  max-width: 210px;
  margin: auto auto 30px;
}
.latest-block{
  max-width: 210px;
  margin: auto auto 30px;
}
.tokenomics {
  max-width: 550px;
  width: 100%;
  margin: auto auto 30px;
}
.max-supply {
  width: 227px;
  height: 90px;
  margin: auto auto 30px;
}
</style>
