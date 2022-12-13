<template>
  <div ref="percentage" class="percentageBar">
    <canvas></canvas>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const props = defineProps<{
  amount: number,
  started: boolean,
  ended: boolean,
}>();

const percentage = ref();

function initPercents() {
  const canvas = percentage.value.children[0];
  let width = percentage.value.offsetWidth;
  let height = percentage.value.offsetHeight;
  const amount = props.amount;
  const ctx = canvas.getContext("2d");


  function outputsize() {
    width = percentage.value.offsetWidth;
    height = percentage.value.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#000000';


    if (amount < 10 && props.started) {
      ctx.font = "15px sans-serif";
      ctx.fillText(`Progress ${amount.toFixed(2)}`, 20, 15);
      ctx.globalCompositeOperation='destination-over';
      let grd = ctx.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(0, '#861010');
      grd.addColorStop(0.2, "#FFF1A9");
      ctx.fillStyle = grd;
    } else if (amount >= 10 && amount < 50 && props.started) {
      ctx.font = "15px sans-serif";
      ctx.fillText(`Progress ${amount.toFixed(2)}`, 20, 15);
      ctx.globalCompositeOperation='destination-over';
      let grd = ctx.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(1, "#FFF1A9");
      grd.addColorStop(0, "#FDDB2A");
      ctx.fillStyle = grd;
    } else if (amount >= 50 && amount < 80 && props.started) {
      ctx.font = "15px sans-serif";
      ctx.fillText(`Progress ${amount.toFixed(2)}`, 20, 15);
      ctx.globalCompositeOperation='destination-over';
      let grd = ctx.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(1, "#FDDB2A");
      grd.addColorStop(0, "#72bf44");
      ctx.fillStyle = grd;
    } else if (amount >= 80 && props.started) {
      ctx.font = "15px sans-serif";
      ctx.fillText(`Progress ${amount.toFixed(2)}`, 20, 15);
      ctx.globalCompositeOperation='destination-over';
      let grd = ctx.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(1, "#72bf44");
      grd.addColorStop(0, "#2AFD88");
      ctx.fillStyle = grd;
    } else if(!props.started){
      ctx.font = "15px sans-serif";
      ctx.fillText(`Waiting to start campaign`, 20, 15);
      ctx.globalCompositeOperation='destination-over';
      ctx.fillStyle = '#9A9B9C';
    }
    ctx.roundRect(0, 0, (amount / 100) * width, 20, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle='#9A9B9C';
    ctx.roundRect(0, 0,  width, 20, 5);
    ctx.stroke();
    ctx.fill();
  }
  ctx.globalCompositeOperation='destination-over';
  ctx.beginPath();
  ctx.roundRect(0, 0, (amount / 100) * width, height, 40);
  ctx.fill();
  new ResizeObserver(outputsize).observe(percentage.value);
}

onMounted(() => {
  initPercents();
});

</script>

<style scoped>

.percentageBar {
  width: 100%;
  height: 25px;
}
</style>
