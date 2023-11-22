<template>
  <div v-if="evStore.getSessionInfo">
    <sessionInfoC v-if="evStore.getSessionInfo" :session-info="evStore.getSessionInfo"></sessionInfoC>
<!--    <ChargingSessionCharging v-if="evStore.getSessionInfo.state == SessionState.STARTED" :session-info="evStore.getSessionInfo"></ChargingSessionCharging>-->
<!--    <ChargingSessionFinished v-if="evStore.getSessionInfo.state == SessionState.FINISHED" :session-info="evStore.getSessionInfo"></ChargingSessionFinished>-->

    <ChargingSessionCharging :session-info="evStore.getSessionInfo"></ChargingSessionCharging>
<!--    <ChargingSessionFinished :session-info="evStore.getSessionInfo"></ChargingSessionFinished>-->
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useEvStore} from "@/store/ev.store";
import SessionInfoC from "@/ev/components/SessionInfoC.vue";
import ChargingSessionFinished from "@/ev/views/ChargingSessionFinished.vue";
import ChargingSessionCharging from "@/ev/views/ChargingSessionCharging.vue";
import {SessionState} from "@/models/ev/sessionInfo";

const evStore = useEvStore();

onMounted(async () => {
  await evStore.fetchSessionInfo()
})
</script>


<style scoped lang="scss">

</style>
