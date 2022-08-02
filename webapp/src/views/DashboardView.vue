<template>
  <div class="container-fluid">
    <div class="dashboard-grid">
      <div class="inflation">
        <DashboardInflation />
      </div>
      <div class="stacking-apr">
        <StakingApr />
      </div>
      <div class="bonded-tokens">
        <bonded-tokens />
      </div>
      <div class="pools">
        <dashboard-pools />
      </div>
      <div class="tokenomics">
        <tokenomics-dashboard />
      </div>
      <div class="latest-block">
        <latest-block />
      </div>  
      <div class="circulating-supply">
        <CirculatingSupply />
      </div>
      
      <div class="validators">
        <active-validators />
      </div>
      <div class="total-supply">
        <total-supply />
      </div>
      <div class="max-supply">
        <max-supply />
      </div>
      <AverageBlockTime />
    </div>
  </div>

</template>

<script setup lang="ts">

import DashboardPools from "@/components/dashboard/DashboardPools.vue";
import BondedTokens from "@/components/dashboard/BondedTokens.vue";
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

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  box-sizing: border-box;

  .inflation { grid-area: 1 / 1 / 2 / 4; }
  .stacking-apr { grid-area: 1 / 4 / 2 / 7; }
  .bonded-tokens { grid-area: 1 / 7 / 2 / 11; }
  .pools { grid-area: 2 / 1 / 4 / 5; }
  .tokenomics { grid-area: 2 / 5 / 4 / 11; }
  .latest-block { grid-area: 4 / 1 / 5 / 3; }
  .circulating-supply { grid-area: 4 / 3 / 5 / 5; }
  .validators { grid-area: 4 / 5 / 5 / 7; }
  .total-supply { grid-area: 4 / 7 / 5 / 9; }
  .max-supply { grid-area: 4 / 9 / 5 / 11; }
  .blocks { grid-area: 5 / 1 / 7 / 6; }
  .transactions { grid-area: 5 / 6 / 7 / 11; }
}

@media screen and (max-width: 1150px) {
  .dashboard-grid {
    .inflation { grid-area: 1 / 1 / 2 / 4; }
    .stacking-apr { grid-area: 1 / 4 / 2 / 7; }
    .bonded-tokens { grid-area: 1 / 7 / 2 / 11; }
    .pools { grid-area: 2 / 1 / 4 / 11; }
    .tokenomics { grid-area: 4 / 1 / 6 / 11; }
    .latest-block { grid-area: 6 / 1 / 7 / 3; }
    .circulating-supply { grid-area: 6 / 3 / 7 / 5; }
    .validators { grid-area: 6 / 5 / 7 / 7; }
    .total-supply { grid-area: 6 / 7 / 7 / 9; }
    .max-supply { grid-area: 6 / 9 / 7 / 11; }
  }
}

@media screen and (max-width: 900px) {
  .dashboard-grid {
    display: flex;
    flex-direction: column;
  }
}
</style>
