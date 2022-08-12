<template>
   <div class="pools-tile">
    <div class="legend">
      <h5 style="font-weight: bold;">{{ $t("DASHBOARD_VIEW.TOKENOMICS") }}</h5>
      <div class="items">
        <div class="legend-item">
          <div class="dot" style="background: #27697F"> </div>
          <div> {{ $t("DASHBOARD_VIEW.BOUNDED") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getTotalBonded" :show-denom="true" style="font-weight: bold"/>
<!-- 
          <div >
            {{ bounded }}
          </div> -->
          <div class="dot"></div>
          <div>
            <PercentsView :amount="boundedPercentage" :precision="2"></PercentsView>
          </div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #fff1a9"></div>
          <div> {{ $t("DASHBOARD_VIEW.UNBOUNDED") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getTotalUnbonded" :show-denom="true" style="font-weight: bold"/>

          <!-- <div style="font-weight: bold">{{unBounded }}
          </div> -->
          <div class="dot"></div>
          <div>
            <PercentsView :amount="unboundedPercentage" :precision="2"></PercentsView>
          </div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #72bf44"></div>
          <div> {{ $t("DASHBOARD_VIEW.UNBOUNDING") }}</div>
          <Icon name="ArrowRight" />
          <CoinAmount :amount="tokensStore.getTotalUnbonding" :show-denom="true" style="font-weight: bold"/>
          <div class="dot"></div>
          <div>
            <PercentsView :amount="unboundingPercentage" :precision="2"></PercentsView>
          </div>
          <!-- <div style="font-weight: bold">{{ unBounding }}
          </div> -->
        </div>
      </div>
    </div>
      <ShadowedSvgChart id="tokenchartdiv">
        <v-chart :option="option" autoresize/>
      </ShadowedSvgChart>

  </div>
</template>

<script setup lang="ts">

import { computed } from "vue";
import {useTokensStore} from "@/store/tokens.store";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { createTokenomicsChartData } from "@/charts/dashboard";
import ShadowedSvgChart from "../commons/ShadowedSvgChart.vue";
import CoinAmount from "../commons/CoinAmount.vue";
import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal } from "@/models/store/big.decimal";
import PercentsView from "@/components/commons/PercentsView.vue";

use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const tokensStore = useTokensStore();

const boundedPercentage = computed(() => {
  return tokensStore.getBoundedPercentage;
});
const unboundedPercentage = computed(() => {
  return tokensStore.getUnboundedPercentage;
});

const unboundingPercentage = computed(() => {
  return tokensStore.getUnboundingPercentage;
});

const bounded = computed((): number | BigDecimal => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalBonded);
});

const unBounded = computed((): number | BigDecimal => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalUnbonded);
});

const unBounding = computed((): number | BigDecimal => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalUnbonding);
});

const totalSupply = computed((): number | BigDecimal => {
  return useConfigurationStore().config.getConvertedAmount(tokensStore.getTotalSupply.amount);
});

const option = computed(() => {
  return createTokenomicsChartData(bounded.value, unBounded.value, unBounding.value, totalSupply.value)
})

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

@media screen and (min-width: 951px) {

}

#tokenchartdiv {
  width: 100%;
  height: 100%;
  overflow: visible;
  margin-right: 70px;
  margin-left: -50px;

    // margin-left: -300px;
}

@media screen and (max-width: 1150px) {
  #tokenchartdiv {
    height: 350px;
    align-self: center;
    margin-right: 0px;
    margin-left: 0px;
  }
}
</style>
