<template>
  <div class="container">
    <div class="top">
      <span style="font-weight:bold;">{{ $t("DASHBOARD_VIEW.TOKENOMICS") }}</span>
    </div>
    <div class="main-content">
      <div class="left">
        <div class="info">{{ bounded }}</div>
        <div><div class="color-div me-2" style="background-color:#26697f"></div>{{ $t("DASHBOARD_VIEW.BOUNDED") }}</div>
        <div>{{ boundedPercentage }}%</div>
      </div>
      <div class="middle">
        <div class="info">{{ unBounded }}</div>
        <div><div class="color-div me-2" style="background-color:#fff1a9"></div>{{ $t("DASHBOARD_VIEW.UNBOUNDED") }}</div>
        <div>{{unboundedPercentage}}%</div>
      </div>
      <div id="chartdiv">
        <div>
          <v-chart :option="option" autoresize />
        </div>
      </div>
    </div>
    <div class="bottom">
      <div><div class="color-div me-2" style="background-color:#27697F"></div>{{ $t("DASHBOARD_VIEW.BOUNDED") }}</div>
      <div><div class="color-div me-2" style="background-color:#fff1a9"></div>{{ $t("DASHBOARD_VIEW.UNBOUNDED") }}</div>
      <div><div class="color-div me-2" style="background-color:#72bf44"></div>{{ $t("DASHBOARD_VIEW.UNBOUNDING") }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">

import {computed, onBeforeMount, ref} from "vue";
import {useTokensStore} from "@/store/tokens.store";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { createTokenomicsChartData } from "@/charts/dashboard";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const tokensStore = useTokensStore();

// onBeforeMount(() => {
//   tokensStore.fetchStakingPool();
// });

const boundedPercentage = computed(() => {
  return tokensStore.getBoundedPercentage();
});
const unboundedPercentage = computed(() => {
  return tokensStore.getUnboundedPercentage();
});

const unboundingPercentage = computed(() => {
  return tokensStore.getUnboundingPercentage()
});

const bounded = computed((): string => {
  return tokensStore.getStakingPool.getBondedTokensViewAmount();
});

const unBounded = computed((): string => {
  return tokensStore.getTotalUnbondedViewAmount()
});

const unBounding = computed((): string => {
  return tokensStore.getStakingPool.getNotBondedTokensViewAmount();
});

const totalSupply = computed((): string => {
  return tokensStore.getTotalSupply.getViewAmount();
});

const option = computed(() => {
  return createTokenomicsChartData(bounded.value, unBounded.value, unBounding.value, totalSupply.value)
})

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.color-div{
  width:20px;
  height:20px;
  float:left;
  border-radius: 50%;
}
.container {

  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;
  height: 250px;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  max-width: 550px;
  margin: auto auto 30px;
  .info {
    font-weight:bold;
  }
  .top {
    height: 15%;
    text-align: left;
    padding-left: 30px;
  }
  .main-content {
    height: 70%;
    display: flex;
    flex-wrap: wrap;
    div {
      padding-left: 10px;
    }
    .left {
      width: 25%;
      text-align: left;
    }
    .middle {
      width: 25%;
      text-align: left;
    }
    #chartdiv {
      width: 50%;
      height: 100%;
      overflow: hidden;
      div {
        padding-bottom: 30px;
        height: 200%;
      }
    }
  }
  .bottom {
    display: flex;
    flex-direction: row;
    height: 15%;
    div {
      padding-left: 8px;
    }
  }

}

@media only screen and (max-width: 500px) {

  .container{
    overflow: hidden;
    height:fit-content;
    .top {
      height: 40px;
    }
    .main-content{
      height: 250px;
      .left,
      .middle{
        order: 0;
        flex: 0 50%;
      }
      #chartdiv {
        flex: 1 100%;

      }
    }
    .bottom {
      display: flex;
      margin-top: 50px;
    }
    #chartdiv {
      top:0px;
      width: 50%;
      height: 150px;
      overflow: hidden;
      div {
        padding-bottom: 30px;
        height: 100%;
      }
    }
  }


}


</style>
