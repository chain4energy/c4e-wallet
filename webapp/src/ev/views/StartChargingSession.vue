<template>
  <h1>Podepnij ładowarkę do auta</h1>
  <img style="height: 100px" src="https://evocharge.com/wp-content/uploads/2021/02/GettyImages-1184969192-1.jpg" />

<!--  <StartStopButton buttonText="Start<br />Charging<br />" :onClick="startChargingSession" />-->

  <Button @click="startChargingSession()">Start</Button>
  <Button @click="stopChargingSession()">Stop</Button>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useEvStore} from "@/store/ev.store";

const router = useRouter()
const evStore = useEvStore();
function startChargingSession() {
  //router.push({ name: 'ev_ChargingSession' })
  evStore.startCharging(true, ()=>{
    console.log("success")}, ()=>{
    console.log("failed")});
}

function stopChargingSession() {
  //router.push({ name: 'ev_ChargingSession' })
  evStore.stopCharging(true, ()=>{
    console.log("success")}, ()=>{
    console.log("failed")});
}
</script>


<style scoped lang="scss">

</style>
