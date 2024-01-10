<template>
  <h1 v-if="chargingSessionStore.getSessionInfo?.state==SessionState.WAIT_FOR_PLUG_INSERT ">Podepnij ładowarkę do auta</h1>
<!--  <Button @click="connect()">Connect charger (simulation)</Button>-->
<!--  <Button @click="startChargingSession()" :disabled="evStore.getSessionInfo?.state!=SessionState.READY_TO_START ">Start charging</Button>-->
  <Button @click="startChargingSession()" :disabled="chargingSessionStore.getSessionInfo?.state!=SessionState.READY_TO_START ">Start charging</Button>
  <ChargerAnimationSVG/>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>

<script setup lang="ts">

import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {ErrorData} from "@/api/base.api";
import {PropType, ref} from "vue";
import {useEvChargingSessionStore} from "@/store/evChargingSession.store";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import ChargerAnimationSVG from '@/components/svg/ChargerAnimationSVG.vue';

const chargingSessionStore = useEvChargingSessionStore();
const errorStr = ref("");
const connected = ref(false);

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
function startChargingSession() {
  chargingSessionStore.startCharging(true, onSuccess, onError);
}

function onSuccess(){
  console.log("onSuccess");
}

function onError(defaultErrorHandler: () => void, error:ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message);
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

function connect(){
  connected.value = true;

}


</script>

<style scoped lang="scss">

</style>
