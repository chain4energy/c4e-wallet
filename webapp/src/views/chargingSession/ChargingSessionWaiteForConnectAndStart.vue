<template>
  <div class="flex flex-col items-center">
    <span class="font-[Audiowide] text-lime-600 text-4xl text-center">{{$t('HEADERS.CONNECT')}}</span>
    <span class="font-[Audiowide] text-4xl text-center text-black">{{$t('HEADERS.TO_CAR')}}</span>
  </div>

  <!--  <Button @click="connect()">Connect charger (simulation)</Button>-->
<!--  <Button @click="startChargingSession()" :disabled="evStore.getSessionInfo?.state!=SessionState.READY_TO_START ">Start charging</Button>-->
  <ChargerAnimationSVG/>
<div/>
</template>

<script setup lang="ts">

import {SessionInfo} from "@/models/sessionInfo";
import {PropType, ref} from "vue";
import ChargerAnimationSVG from '@/components/svg/ChargerAnimationSVG.vue';

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});

const connected = ref(false);

function connect(){
  connected.value = true;

}

</script>

<style scoped lang="scss">

</style>
