<template>

  <Checkbox v-model="useInterval" :binary="true"/>
  <label for="useInterval" class="ml-2"> turn on interval </label>
  <p>session: {{JSON.stringify(evStore.getSessionInfo)}}</p>

  <ChargingSessionWaiteForConnectAndStart  v-if="evStore.getSessionInfo?.state ==SessionState.WAIT_FOR_PLUG_INSERT || evStore.getSessionInfo?.state ==SessionState.READY_TO_START" :sessionInfo="evStore.getSessionInfo"/>
  <ChargingSessionProgress  v-if="evStore.getSessionInfo?.state ==SessionState.CHARGING" :sessionInfo="evStore.getSessionInfo"/>
  <ChargingSessionSummary  v-if="evStore.getSessionInfo?.state ==SessionState.FINAL" :sessionInfo="evStore.getSessionInfo" />
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useEvStore} from "@/ev/store/ev.store";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";
import ChargingSessionWaiteForConnectAndStart from "@/ev/views/chargingSession/ChargingSessionWaiteForConnectAndStart.vue";
import {SessionState} from "@/ev/models/sessionInfo";
import ChargingSessionProgress from "@/ev/views/chargingSession/ChargingSessionProgress.vue";
import ChargingSessionSummary from "@/ev/views/chargingSession/ChargingSessionSummary.vue";
import Checkbox from "primevue/checkbox";

const errorStr = ref("");

const router = useRouter()
const evStore = useEvStore();
let interval :any;
const useInterval = ref(true)

onMounted(()=>{
  evStore.fetchSessionInfo();
  startInterval();
})

function  startInterval(){
  interval = setInterval(() => {evStore.fetchSessionInfo(false)}, 1000);
}

watch(useInterval,(newValue, oldValue)=>{
  if(newValue){
    startInterval();
  }else{
    clearInterval(interval);
  }
})


onUnmounted(()=>{
  clearInterval(interval);
})

function onSuccess(){
  console.log("onSuccess");
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}
</script>


<style scoped lang="scss">

</style>
