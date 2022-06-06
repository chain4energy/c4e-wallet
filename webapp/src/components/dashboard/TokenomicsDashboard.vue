<template>
  <div class="container">
    <div class="top">
      <span style="font-weight:bold">Tokenomics</span>
    </div>
    <div class="main-content">
      <div>
        <div>{{ useTokenomicsStore().getTokenomics.bonded }}</div>
        <div><div class="color-div" style="background-color:#72bf44"></div>Bounded</div>
        <div>{{ boundedPercentage }}%</div>
      </div>
      <div>
        <div>{{ useTokenomicsStore().getTokenomics.unbonded }}</div>
        <div><div class="color-div" style="background-color:#fff1a9"></div>Unbounded</div>
        <div>{{unboundedPercentage}}%</div>
      </div>
      <div id="chartdiv">
        <v-chart :option="option" autoresize />
      </div>
    </div>
    <div class="bottom">
      <div>Bounded</div>
      <div>Unbounded</div>
      <div>Unbounding</div>
    </div>

  </div>
</template>

<script setup lang="ts">

import TokenomicsService from "@/services/tokenomics.service";
import {computed, onMounted, ref} from "vue";
import {useTokenomicsStore} from "@/store/tokenomics.store";
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

const tokenomicsService = new TokenomicsService();


onMounted(()=>{
  tokenomicsService.getDataToStore();
})

const boundedPercentage = computed(() => {
  let res:number = Number(useTokenomicsStore().getTokenomics.bonded) / ( Number(useTokenomicsStore().getTokenomics.bonded) +  Number(useTokenomicsStore().getTokenomics.unbonded))*100;
  return res.toFixed(2);
});
const unboundedPercentage = computed(() => {
  let res:number = Number(useTokenomicsStore().getTokenomics.unbonded) / ( Number(useTokenomicsStore().getTokenomics.bonded) +  Number(useTokenomicsStore().getTokenomics.unbonded))*100;
  return res.toFixed(2);
});


const option = ref( {

  legend: {
    orient: 'vertical',
    left: 10,
  },
  series: [
    {

      startAngle: 180,
      endAngle: 360,
      type: 'pie',
      radius: ['50%', '90%'],
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
        {value: useTokenomicsStore().getTokenomics.bonded ,   itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: '#26697f'
            }
          }},
        {value: useTokenomicsStore().getTokenomics.unbonded*100 ,   itemStyle: {
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
        {
          value: Number(useTokenomicsStore().getTokenomics.bonded) + Number(useTokenomicsStore().getTokenomics.unbonded),
          name: null,
          itemStyle:{opacity:0},
          tooltip:{show:false }
        }
      ]
    }
  ],} );
</script>

<style scoped lang="scss">
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

  .info {
    font-weight:bold;
  }
  .top {
    height: 15%;
  }
  .main-content {
    height: 70%;
    display: flex;
    div {
      padding-left: 10px;
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

#chartdiv {
  width: 250px;
  height: 250px;
  padding-bottom: 30px;
  padding-top: 10px;
}


</style>
