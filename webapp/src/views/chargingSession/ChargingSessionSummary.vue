<template>
  <span class="font-[Audiowide] text-lime-600 text-4xl text-center">{{$t('HEADERS.SUMMARY')}}</span>
  <div class="w-full flex flex-inline justify-evenly">
    <div class="text-center flex flex-col justify-between">
      <span class="font-[SevenSegment] text-[90px] -mt-5 text-lime-600">{{ Number(sessionInfo.cost).toFixed(2) }}</span>
      <p class="font-[Audiowide] mt-2 text-xl">EUR</p>
    </div>
    <div class="text-center flex flex-col justify-between">
      <span class="font-[SevenSegment] text-[90px] -mt-5 text-lime-600">{{ Number(sessionInfo.energyConsumed).toFixed(2) }}</span>
      <p class="font-[Audiowide] mt-2 text-xl">kWh</p>
    </div>
  </div>
  <h3>See you soon!</h3>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {SessionInfo} from "@/models/sessionInfo";
import Type2SVG from "@/components/svg/Type2SVG.vue";

defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
</script>

<style scoped lang="scss">

</style>
