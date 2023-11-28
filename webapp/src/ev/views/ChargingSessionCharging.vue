<template>
  <Card class="content">
    <template #title>Pobrana energia +12 kWh.</template>
    <template #content>
      <h3>Zapłacona kwota 12PLN</h3>
      <h4>Pobrania energia: 25 kWh</h4>
    </template>

    <StartStopButton buttonText="Stop<br />Charging<br />" :onClick="finishCharging" />
  </Card>
</template>

<script setup lang="ts">
import {SessionInfo} from "@/ev/models/sessionInfo";
import StartStopButton from "@/ev/views/StartStopButton.vue";
import {useRouter} from "vue-router";

defineProps({
    sessionInfo: {
      type: Object as () => SessionInfo,
      required: true
    }
  }
);

const router = useRouter()

function finishCharging() {
  console.log('123')
  // router.push({ name: 'ev_ChargingSession' })
}

</script>

<style scoped lang="scss">

</style>
