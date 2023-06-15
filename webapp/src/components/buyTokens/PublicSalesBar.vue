<template>
  <div class="publicSalesBar">
    <div class="publicSalesBar__helper">
      <div>0%</div>
      <div v-if="totalPercentToShow > 5" :style="{transform: `translateX(${mark}${totalPercents.toFixed(0)}px)`}">{{ totalPercentToShow}}% </div>
      <div>100%</div>
    </div>
    <canvas class="publicSalesBar__canvas" ref="tokens"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Coin } from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { parts } from "@/store/publicSales.store";
interface Bar{
  amount: Coin,
  color: string
}

const amount = defineProps<{
  total: Coin,
  values: parts,
}>();

const tokens =ref();
const ctx = ref();
const totalPercents = ref(0);
const totalPercentToShow = ref(0);
const point = ref();
const mark = ref('');
function initCanvas() {
  tokens.value.width = tokens.value.offsetWidth;
  tokens.value.height = tokens.value.offsetHeight;
  ctx.value = tokens.value.getContext("2d");
  const denom = amount.total.denom;
  const total = useConfigurationStore().config.getConvertedAmount(amount.total.amount, denom);
  const solvedPercents = (Number(useConfigurationStore().config.getConvertedAmount(amount.values.sold.amount, denom))/Number(total)) * 100;
  const reservedPercents = (Number(useConfigurationStore().config.getConvertedAmount(amount.values.reserved.amount, denom))/Number(total)) * 100;
  const totalInPer = Number(reservedPercents) + Number(solvedPercents);
  const posNeg = Math.sign(50 - totalInPer);
  totalPercentToShow.value = Number(totalInPer.toFixed(2));
  switch (posNeg){
    case 1: mark.value = '-'; totalPercents.value = (tokens.value.width/100) * (50 - totalInPer);
    break;
    case -1:
      mark.value = '';
      totalPercents.value = (tokens.value.width/100) * (totalInPer - 50);
    break;
    default: totalPercents.value = 0;
  }

  let solvedBar = new Path2D();
  ctx.value.fillStyle = '#81CF1F';
  solvedBar.rect(0, 0, (tokens.value.width/100) * solvedPercents, tokens.value.height);
  ctx.value.fill(solvedBar, 'evenodd');

  let solvedBarText = tokens.value.getContext("2d");
  ctx.value.fillStyle = '#FFFFFF';
  solvedBarText.font = "16px Arial";
  ctx.value.globalCompositeOperation = 'source-over';
  const text = `${Number(useConfigurationStore().config.getConvertedAmount(amount.values.sold.amount, denom)).toString()} C4E`;
  const textWidth = ctx.value.measureText(text ).width;
  ctx.value.fillText(
    text,
    ((tokens.value.width/100) * solvedPercents)/1.7- textWidth,
    (tokens.value.height/2) +(16/3)
  );

  let reservedBar = new Path2D();
  ctx.value.fillStyle = '#CAE7FF';
  reservedBar.rect((tokens.value.width/100) * solvedPercents, 0, (tokens.value.width/100) * reservedPercents, tokens.value.height);
  ctx.value.fill(reservedBar, 'evenodd');

  let reservedBarText = tokens.value.getContext("2d");
  ctx.value.fillStyle = '#000000';
  reservedBarText.font = "16px Arial";
  ctx.value.globalCompositeOperation = 'source-over';
  const text2 = `${Number(useConfigurationStore().config.getConvertedAmount(amount.values.reserved.amount, denom)).toString()} C4E`
  const text2Width = ctx.value.measureText(text2 ).width;
  ctx.value.fillText(
    text2,
    ((tokens.value.width/100) * solvedPercents) + (((tokens.value.width/100) * reservedPercents)/1.2)- text2Width,
    (tokens.value.height/2) +(16/3)
  );


  let restBarText = tokens.value.getContext("2d");
  ctx.value.fillStyle = '#000000';
  restBarText.font = "16px Arial";
  ctx.value.globalCompositeOperation = 'source-over';
  const textRest = `${Number(useConfigurationStore().config.getConvertedAmount(amount.total.amount, denom)) - (Number(useConfigurationStore().config.getConvertedAmount(amount.values.sold.amount, denom)) + Number(useConfigurationStore().config.getConvertedAmount(amount.values.reserved.amount, denom)))} C4E`;
  const text3Width = ctx.value.measureText(textRest ).width;
  ctx.value.fillText(
    textRest,
    ((tokens.value.width/100) * solvedPercents) + (((tokens.value.width/100) * reservedPercents))+ text3Width,
    (tokens.value.height/2) +(16/3)
  );
 }



onMounted(() => {
  initCanvas();
  new ResizeObserver(onResize).observe(tokens.value);
});

function onResize() {
  if(tokens.value?.offsetWidth){
    tokens.value.width = tokens.value.offsetWidth;
    tokens.value.height = tokens.value.offsetHeight;
    initCanvas();
  }
}
</script>

<style scoped lang="scss">

.publicSalesBar {
  width: 100%;
  height: 23px;
  margin: 0 0 15px 0;

  canvas{
    border-radius: 3px;
    background-color: #ffffff;
    width: 100%;
    height: 23px;
  }
  &__helper{
    width: 100%;
    font-family: 'Inter',sans-serif;
    font-style: normal;
    display: flex;
    justify-content: space-between;
    color: white;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
  }
  &__status{
     z-index: 2;
     color: white;
     top: 0;
  }
}
</style>
