<template>
  <div :id="id" >
    <defs>
      <filter id="inset-shadow">
        <feColorMatrix type="matrix" values="0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 10 0 0">
        </feColorMatrix>
        <feGaussianBlur stdDeviation="3"></feGaussianBlur>
        <feComposite operator="in" in2="SourceGraphic"></feComposite>
        <feDiffuseLighting surfaceScale="200" diffuseConstant="1" kernelUnitLength="1" lighting-color="white" result="lightmap">
          <fePointLight x="10" y="0" z="100"></fePointLight>
        </feDiffuseLighting>
        <feGaussianBlur stdDeviation="10"></feGaussianBlur>
        <feColorMatrix type="luminanceToAlpha"></feColorMatrix>
        <feComposite operator="in" in2="SourceGraphic"></feComposite>
        <feComposite operator="over" in2="SourceGraphic"></feComposite>
      </filter>
    </defs>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  id: string
}>();

onMounted(() => {
  addShadow();

});

function isSafari() {
  return navigator.vendor && navigator.vendor.indexOf('Apple') > -1;
}

async function addShadow() {
  const chartElement = document.getElementById(props.id);
  if (chartElement) {
    const defs = chartElement.getElementsByTagName("defs").item(0);
    if (defs) {
      chartElement.removeChild(defs);
    }
    const svg = chartElement.getElementsByTagName("x-vue-echarts").item(0)?.getElementsByTagName("div").item(0)?.getElementsByTagName("svg").item(0);
    const isSvg: boolean = svg !== null;
    if (isSafari() || !isSvg) {
      return;
    }
    const svgElem = svg as SVGElement;
    svgElem.innerHTML = defs?.outerHTML + svgElem.innerHTML;
    svgElem.setAttribute('filter', 'url(#inset-shadow)');
  }
}

</script>
