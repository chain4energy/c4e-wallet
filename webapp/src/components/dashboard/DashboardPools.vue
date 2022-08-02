<template>
  <div class="pools-tile">
    <div class="legend">
      <h5 style="font-weight: bold; margin-bottom: 10px;">{{ $t("DASHBOARD_VIEW.POOLS") }}</h5>
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

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  
  series: [{
    width: '90%',
    height: '90%',
    center: ['55%', '50%'],
    name: 'Pools',
    type: 'pie',
    radius: ['50%', '100%'],
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffsetX: 10,
      shadowOffsetY: 10
    },
// -------~~~~~~~~~~~~~~~~~~~~~~~~~~

    markPoint: {
      tooltip: { show: false },
      label: {
        show: true,
        formatter: '{b}',
        color: 'black',
        fontSize: 20,
      },
      data: [{
        name: 'Total 10%',
        value: '-',
        symbol: 'circle',
        itemStyle: { color: 'transparent' },
        x: '50%',
        y: '50%',
      }],
    },

// -------~~~~~~~~~~~~~~~~~~~~~~~~~~

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
    data: [{
      value: communityPool,
      name: 'Community pool',
      itemStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: '#fff1a9'
        }
      }
    },
      {
        value: strategicReversePool,
        name: 'Strategic reverse pool',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: '#72bf44'
          }
        }
      },
      {
        value: airdropPool,
        name: 'Airdrop',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: '#26697f'
          }
        }
      }
    ]
  }]
} );
</script>

<style scoped lang="scss">
#chartdiv {
  width: 80%;
  margin-bottom: -30px;
  margin-left: -10px;
  background: transparent url("@/assets/logo.png") no-repeat center ;
  background-size: 50px;
}

</style>
