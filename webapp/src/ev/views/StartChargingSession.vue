<template>
  <h1>Podepnij ładowarkę do auta</h1>
  <img style="height: 100px" src="https://evocharge.com/wp-content/uploads/2021/02/GettyImages-1184969192-1.jpg" />

<!--  <StartStopButton buttonText="Start<br />Charging<br />" :onClick="startChargingSession" />-->

  <Button @click="startChargingSession()">Start</Button>
  <Button @click="stopChargingSession()">Stop</Button>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useEvStore} from "@/store/ev.store";
import {ref} from "vue";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/ev/evServiceCommons";

const errorStr = ref("");

const router = useRouter()
const evStore = useEvStore();
function startChargingSession() {
  //router.push({ name: 'ev_ChargingSession' })
  evStore.startCharging(true, onSuccess, onError);
}

function stopChargingSession() {
  //router.push({ name: 'ev_ChargingSession' })
  evStore.stopCharging(true, onSuccess, onError);
}

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
