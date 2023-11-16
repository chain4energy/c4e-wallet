<template>
  <h1>Podepnij ładowarkę do auta</h1>
  <img style="height: 100px" src="https://evocharge.com/wp-content/uploads/2021/02/GettyImages-1184969192-1.jpg" />

  <StartStopButton buttonText="Start<br />Charging<br />" :onClick="startChargingSession" />
</template>

<script setup lang="ts">
import StartStopButton from "@/ev/views/StartStopButton.vue";
import {useRouter} from "vue-router";

const router = useRouter()

function startChargingSession() {
  console.log('123')
  router.push({ name: 'ev_ChargingSession' })
}
</script>


<style scoped lang="scss">

</style>
