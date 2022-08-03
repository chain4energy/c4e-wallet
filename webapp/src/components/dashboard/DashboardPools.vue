<template>
  <div class="pools-tile">
    <div class="legend">
    <h5 style="font-weight: bold;">{{ $t("DASHBOARD_VIEW.POOLS") }}</h5>
    <div class="items">
        <div class="legend-item">
          <div class="dot" style="background: #fff1a9"> </div>
          <div> {{ $t("DASHBOARD_VIEW.COMMUNITY_POOL") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">
            {{ communityPool }} {{tokensStore.getCommunityPool.getViewDenom()}}
          </div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #72bf44"></div>
          <div> {{ $t("DASHBOARD_VIEW.STRATEGIC_REVERSE_POOL") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">{{ strategicReversePool }} {{ tokensStore.getStrategicReversePool.getViewDenom() }}
          </div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #26697f"></div>
          <div> {{ $t("DASHBOARD_VIEW.AIRDROP") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">{{ airdropPool }} {{ tokensStore.getAirdropPool.getViewDenom() }}
          </div>
        </div>
    </div>
    </div>
      <div id="chartdiv">
        <v-chart :option="option" autoresize />
    </div>


  </div>

</template>

<script setup lang="ts">
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {computed, onBeforeMount, ref} from "vue";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import Icon from "../features/IconComponent.vue";
import {useTokensStore} from "@/store/tokens.store";
import { createDashboardPoolsChartData } from "@/charts/dashboard";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const tokensStore = useTokensStore();
// onBeforeMount(() => {
//   tokensStore.fetchPools();
// });

const communityPool = computed(() => {
  return tokensStore.getCommunityPool.getViewAmount();
});

const strategicReversePool = computed(() => {
  return tokensStore.getStrategicReversePool.getViewAmount();
});

const airdropPool = computed(() => {
  return tokensStore.getAirdropPool.getViewAmount();
});

const option = computed(() => {
  return createDashboardPoolsChartData(communityPool.value, strategicReversePool.value, airdropPool.value);
})

</script>

<style scoped lang="scss">
#chartdiv {
  width: 80%;
  // margin-bottom: -30px;
  // margin-left: -10px;
  background: transparent url("@/assets/logo.png") no-repeat center ;
  background-size: 50px;
}

@media screen and (max-width: 1150px) {
  #chartdiv {
    height: 350px;
    align-self: center;
  }
}

</style>
