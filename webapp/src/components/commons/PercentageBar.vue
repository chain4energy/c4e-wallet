<template>
  <div ref="percentage" class="percentageBar">
    <canvas class="percentageBar__canvas" ref="canva"></canvas>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref } from "vue";
import {CampainStatus} from "@/models/airdrop/airdrop";
import {useI18n} from "vue-i18n";

const i18n = useI18n();
const props = defineProps<{
  amount: number | null,
  status: CampainStatus;
  timeToPass? : string;
}>();

const percentage = ref();
const canva =ref();
const ctx = ref();

function initCanvas() {
  ctx.value = canva.value.getContext("2d");
  onResize();
  changeStatus();
  new ResizeObserver(onResize).observe(percentage.value);
}

function onResize() {
  if(canva.value?.offsetWidth){
    canva.value.width = canva.value.offsetWidth;
    canva.value.height = percentage.value.offsetHeight;
    changeStatus();
  }
}
function changeStatus(){
  let text;
  let fontStyle = '#002C50';
  let backgroundColor;
  let progress;
  switch (props.status){
    case CampainStatus.Future: text = `${props.timeToPass}`;
      backgroundColor = '#9A9B9C';
      ctx.value.rect(0, 0, canva.value.width, canva.value.height);
      progress = false;
      break;
    case CampainStatus.Past:
      text = i18n.t('AIRDROP.CAMPAIGN_PASSED');
      ctx.value.rect(0, 0, canva.value.width, canva.value.height);
      backgroundColor = '#9A9B9C';
      progress = false;
      break;
    case CampainStatus.Now: text = props.amount;
      backgroundColor = changeProgress();
      text = `${props.timeToPass}`;
      progress = true;
      ctx.value.rect(0, 0, (canva.value.width /100) * props.amount , canva.value.height);
      break;
    default: text = '';
      break;
  }
  const fontsize = 14;
  ctx.value.font = `${fontsize}px sans-serif`;
  const textWidth = ctx.value.measureText(text ).width;
  const widthOfBar = ((canva.value.width /100) * props.amount) - textWidth/2;
  if(progress && widthOfBar > textWidth){
    ctx.value.fillStyle = fontStyle;
    ctx.value.fillText(text,  textWidth/2, canva.value.height/2 + (fontsize/3));
  } else if(progress && widthOfBar < textWidth) {
    fontStyle = '#000000';
    ctx.value.fillStyle = fontStyle;
    ctx.value.fillText(text,  textWidth/2, canva.value.height/2 + (fontsize/3));
  } else {
    ctx.value.fillStyle = fontStyle;
    ctx.value.fillText(text, (canva.value.width/2) - textWidth/2, canva.value.height/2 + (fontsize/3));
  }



  ctx.value.globalCompositeOperation='destination-over';
  ctx.value.fillStyle = backgroundColor;
  ctx.value.fill();
}

function changeProgress(){
  let background;
  if(props.amount <= 10){
    background = ctx.value.createLinearGradient(0, 0, canva.value.width, 0);
    background.addColorStop(0, '#ec0a1f');
    background.addColorStop(1, "#d95e00");
  } else if (props.amount <= 40 && props.amount > 10){
    background = ctx.value.createLinearGradient(0, 0, canva.value.width, 0);
    background.addColorStop(0, "#d95e00");
    background.addColorStop(1, "#bd8800");
  } else if (props.amount <= 70 && props.amount > 40){
    background = ctx.value.createLinearGradient(0, 0, canva.value.width, 0);
    background.addColorStop(0, "#bd8800");
    background.addColorStop(1, "#9aa700");
  }else if (props.amount > 70){
    background = ctx.value.createLinearGradient(0, 0, canva.value.width, 0);
    background.addColorStop(0, "#9aa700");
    background.addColorStop(1, "#72bf44");
  }
  return background;
}

onMounted(() => {
  initCanvas();
});

</script>

<style scoped lang="scss">

.percentageBar {
  width: 100%;
  height: 25px;
  margin: 0 0 15px 0;

  canvas{
    border-radius: 3px;
    background-color: #ffffff;
    width: 100%;
    height: 25px;
  }
  &__status{
    z-index: 2;
    color: white;
    top: 0;
  }
}
</style>
