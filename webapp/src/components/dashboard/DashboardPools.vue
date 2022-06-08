<template>
  <div class="container">
    <div class="left">
      <div class="top">Pools</div>
      <div class="info">
        <div >
          <div><div class="color-div" style="background-color:#fff1a9"></div> Community pool</div>
          <div style="font-weight: bold">
            {{ communityPool }} {{usePoolsStore().getCommunityPool.denom}}
          </div>
        </div>
        <div >
          <div><div class="color-div" style="background-color:#72bf44"></div> Strategic reverse pool</div>
          <div style="font-weight: bold">{{ strategicReversePool }} {{usePoolsStore().getStrategicReversePool.denom}}</div>
        </div>
        <div >
          <div><div class="color-div" style="background-color:#26697f"></div> Airdrop</div>
          <div style="font-weight: bold">{{ airdropPool }} {{usePoolsStore().getAirdropPool.denom}}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div id="chartdiv">
        <v-chart :option="option" autoresize />
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {computed, onMounted, ref} from "vue";
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import PoolsService from "@/services/pools.service";
import {usePoolsStore} from "@/store/pools.store";
import {useTokenomicsStore} from "@/store/tokenomics.store";


use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);
onMounted(() => {
  poolsService.getDataToStore();
})

const communityPool = computed(() => {
  return Number(usePoolsStore().getCommunityPool.amount);
});

const strategicReversePool = computed(() => {
  return Number(usePoolsStore().getStrategicReversePool.amount);
});

const airdropPool = computed(() => {
  return Number(usePoolsStore().getAirdropPool.amount);
});

const poolsService = new PoolsService();
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
.container {
  display: flex;
  flex-wrap: wrap;
  height: 250px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  .top {
    height: 15%;
    font-weight: bold;
  }
  .bottom{
    display: flex;
  }
  .left {
    width: 50%;
    .info {
      text-align: left;
      word-wrap: break-word;
      .color-div{
        width:20px;
        height:20px;
        float:left;
        border-radius: 50%;
      }
    }
  }
  .right{
    min-height: 200px;
    padding-top: 2%;
    width: 50%;
    height: 100%;
  }
}

#chartdiv {
  width: 100%;
  height: 100%;

  padding-top: 5px;
  margin: 0 auto;
  background: transparent url("@/assets/logo.png") no-repeat center ;
  background-size: 50px;
}

</style>
