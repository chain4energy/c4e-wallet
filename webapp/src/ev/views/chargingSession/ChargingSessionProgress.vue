<template>
  <h1>Current session proggers</h1>
  <p>Energia pobrana {{props.sessionInfo.energyConsumed}} kWh</p>
  <p>Aktualna wartość {{props.sessionInfo.cost}} PLN</p>
  <p>Czas rozpoczęcia ładowania {{props.sessionInfo.startTime}}</p>
  <Button @click="stopChargingSession()">Stop charging</Button>
</template>

<script setup lang="ts">

import {SessionInfo} from "@/ev/models/sessionInfo";
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
