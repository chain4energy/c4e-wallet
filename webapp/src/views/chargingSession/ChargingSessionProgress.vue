<template>
  <h1>Current session proggers</h1>
  <p>State {{props.sessionInfo.state}}</p>
  <div v-if="props.sessionInfo?.state!=SessionState.WAIT_FOR_STARTED">
    <p>Energia pobrana {{props.sessionInfo.energyConsumed}} kWh</p>
    <p>Aktualna wartość {{props.sessionInfo.cost}} PLN</p>
    <p>Czas rozpoczęcia ładowania {{props.sessionInfo.startTime}}</p>
  </div>
  <Button v-if="props.sessionInfo?.state==SessionState.CHARGING" @click="stopChargingSession()">Stop charging</Button>
  <p v-if="props.sessionInfo?.state==SessionState.STOPPING">Czekanie na zatrzymanie ładowania</p>
  <p v-if="props.sessionInfo?.state==SessionState.WAIT_FOR_STARTED">Czekanie na rozpoczęcie ładowania</p>
</template>

<script setup lang="ts">

import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {PropType} from "vue/dist/vue";

const emit = defineEmits(['stopCharging']);

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
function stopChargingSession() {
  emit('stopCharging');
}

</script>

<style scoped lang="scss">

</style>
