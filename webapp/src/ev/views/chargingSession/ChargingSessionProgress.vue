<template>
  <h1>Current session proggers</h1>
  <p>Energia pobrana {{props.sessionInfo.energyConsumed}} kWh</p>
  <p>Aktualna wartość {{props.sessionInfo.cost}} PLN</p>
  <p>Czas rozpoczęcia ładowania {{props.sessionInfo.startTime}}</p>
  <Button @click="stopChargingSession()">Stop charging</Button>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>

<script setup lang="ts">
import {useEvStore} from "@/ev/store/ev.store";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";
import {SessionInfo, SessionState} from "@/ev/models/sessionInfo";
import {onMounted, onUnmounted, ref} from "vue";
import {PropType} from "vue/dist/vue";

const evStore = useEvStore();
const errorStr = ref("");
let interval :any;

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
function stopChargingSession() {
  evStore.stopCharging(true, onSuccess, onError);
}

function onSuccess(){
  console.log("onSuccess");
  evStore.setSessionInfoState(SessionState.FINISHED)
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

function  startInterval(){
  interval = setInterval(() => {
    if(evStore.sessionInfo) {
      evStore.sessionInfo.cost = evStore.sessionInfo.cost + 1;
      evStore.sessionInfo.energyConsumed = evStore.sessionInfo.energyConsumed + 0.5;
    }
  }, 1000);
}
onMounted(()=>{
  startInterval();
})

onUnmounted(()=>{
  clearInterval(interval);
})

</script>

<style scoped lang="scss">

</style>
