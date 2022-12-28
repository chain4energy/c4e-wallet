<template>
  <div class="pools-tile">
    <div class="legend">
    <h5 style="font-weight: bold;">{{ $t("DASHBOARD_VIEW.POOLS") }}</h5>
    <div class="items">
        <div class="legend-item">
          <div class="dot" style="background: #72BF44"> </div>
          <div> {{ $t("DASHBOARD_VIEW.COMMUNITY_POOL") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getCommunityPool" :show-denom="true" style="font-weight: bold"/>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #E4E4E4"> </div>
          <div> {{ $t("DASHBOARD_VIEW.REMAINING_TOKENS") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getRemainingTokens" :show-denom="true" style="font-weight: bold"/>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #27697F"></div>
          <div> {{ $t("DASHBOARD_VIEW.STRATEGIC_REVERSE_POOL") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getStrategicReversePool" :show-denom="true" style="font-weight: bold"/>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #FFF1A9"></div>
          <div> {{ $t("DASHBOARD_VIEW.AIRDROP") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getAirdropPool" :show-denom="true" style="font-weight: bold"/>
        </div>
    </div>
    </div>
    <div style=" height: 100%; width:100% ;max-width:350px;margin-left: auto;
    margin-right: auto " ref="poolsRef">
      <ShadowedSvgChart id="poolschartdiv" >
        <v-chart :option="option" autoresize />
        <C4EIcon icon="c4e-circle" class="inside" :size="poolsRef.clientWidth/3"/>
      </ShadowedSvgChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import {computed, onMounted, ref, watch} from "vue";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import Icon from "../features/IconComponent.vue";
import {useTokensStore} from "@/store/tokens.store";
import { createDashboardPoolsChartData } from "@/charts/dashboard";
import ShadowedSvgChart from "../commons/ShadowedSvgChart.vue";
import C4EIcon from "../commons/C4EIcon.vue";
import CoinAmount from "../commons/CoinAmount.vue";
import { useConfigurationStore } from "@/store/configuration.store";
use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const tokensStore = useTokensStore();
const poolsRef = ref(0);
const communityPool = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getCommunityPool.amount);
});

const strategicReversePool = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getStrategicReversePool.amount);
});

const airdropPool = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getAirdropPool.amount);
});

const totalSupply = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalSupply.amount);
});

const remainingTokens = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getRemainingTokens.amount);
});

const option = computed(() => {
  return createDashboardPoolsChartData(remainingTokens.value, communityPool.value, strategicReversePool.value, airdropPool.value, totalSupply.value);
});


</script>

<style scoped lang="scss">
#poolschartdiv {
  width: 100%;
  height: 100%;
  // margin-bottom: -30px;
  // margin-left: -10px;
  // background: transparent url("@/assets/logo.png") no-repeat center ;
  // background-size: 50px;
position: relative;
  .inside{
    width: 40%;
      position: absolute;
      top: 50%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      margin:auto;
      text-align: center;
      vertical-align: middle;
      left: 0;
      right: 0;

    }

}

@media screen and (max-width: 1150px) {
  #poolschartdiv {
    height: 350px;
    width: 100%;
    align-self: center;

    .inside{
      width: 40%;
      position: absolute;
      top: 50%;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      margin:auto;
      text-align: center;
      vertical-align: middle;
      left: 0;
      right: 0;

    }
  }
}

.c4e-icon {
  color: #27697F;
}

</style>
