<template>
  <h1>Podepnij ładowarkę do auta</h1>
  <Button @click="connect()">Connect charger (simulation)</Button>
  <Button @click="startChargingSession()" :disabled="!connected">Start charging</Button>

  <div style="color: red">
    {{errorStr}}
  </div>
</template>

<script setup lang="ts">

import {useEvStore} from "@/ev/store/ev.store";
import {SessionInfo, SessionState} from "@/ev/models/sessionInfo";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";
import {PropType, ref} from "vue";
const evStore = useEvStore();
const errorStr = ref("");
const connected = ref(false);

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
function startChargingSession() {
  //router.push({ name: 'ev_ChargingSession' })
  evStore.startCharging(true, onSuccess, onError);
  evStore.setSessionInfoState(SessionState.STARTED);
}

function onSuccess(){
  console.log("onSuccess");
  evStore.setSessionInfoState(SessionState.STARTED)
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

function connect(){
  connected.value = true

}


</script>

<style scoped lang="scss">

</style>
