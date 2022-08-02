<template>
   <div class="pools-tile">
    <div class="legend">
      <h5 style="font-weight: bold; margin-bottom: 10px;">{{ $t("DASHBOARD_VIEW.TOKENOMICS") }}</h5>
        <div class="legend-item">
          <div class="dot" style="background: #27697F"> </div>
          <div> {{ $t("DASHBOARD_VIEW.BOUNDED") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">
            {{ bounded }}
          </div>
          <div class="dot"></div>
          <div>{{ boundedPercentage }}%</div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #fff1a9"></div>
          <div> {{ $t("DASHBOARD_VIEW.UNBOUNDED") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">{{unBounded }}
          </div>
          <div class="dot"></div>
          <div>{{ unboundedPercentage }}%</div>
        </div>
        <div class="legend-item">
          <div class="dot" style="background: #72bf44"></div>
          <div> {{ $t("DASHBOARD_VIEW.UNBOUNDED") }}</div>
          <Icon name="ArrowRight" />
          <div style="font-weight: bold">{{ unBounding }}
          </div>
        </div>
    </div>
      <div id="chartdiv">
        <v-chart :option="option" autoresize />
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
  return tokensStore.getUnboundingPercentage();
});

const bounded = computed((): string => {
  return tokensStore.getStakingPool.getBondedTokensViewAmount();
});

const unBounded = computed((): string => {
  return tokensStore.getTotalUnbondedViewAmount();
});

const unBounding = computed((): string => {
  return tokensStore.getStakingPool.getNotBondedTokensViewAmount();
});

const totalSupply = computed((): string => {
  return tokensStore.getTotalSupply.getViewAmount();
});

const option = ref( {

  legend: {
    orient: 'vertical',
    left: 10,
  },
  series: [
    {
      width: '150%',
      height: '130%',
      startAngle: 180,
      endAngle: 360,
      top: '20%',
      left: '-5%',
      type: 'pie',
      radius: ['50%', '90%'],
      center: ['50%', '43%'],
      avoidLabelOverlap: true,
      label: {
        show: false,
        color: '#000',
        fontSize: '80',
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {value: bounded ,
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: '#27697F'
            }
          }},
        {value: unBounded,   itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: '#fff1a9'
            }
          }},
        {value: unBounding,   itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: '#72bf44'
            }
          }},
        {
          value: totalSupply,
          name: null,
          itemStyle:{opacity:0},
          tooltip:{show:false }
        }
      ]
    }
  ],} );
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

#chartdiv {
  width: 100%;
  height: 100%;
  overflow: visible;
  margin-right: 70px;
    margin-left: -300px;
}
</style>
