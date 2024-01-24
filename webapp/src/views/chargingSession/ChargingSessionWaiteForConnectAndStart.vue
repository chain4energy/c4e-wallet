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

import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {ErrorData} from "@/api/base.api";
import {PropType, ref} from "vue";
import {useEvChargingSessionStore} from "@/store/evChargingSession.store";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import ChargerAnimationSVG from '@/components/svg/ChargerAnimationSVG.vue';

const errorStr = ref("");
const connected = ref(false);

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});

function connect(){
  connected.value = true;

}

</script>

<style scoped lang="scss">

</style>
