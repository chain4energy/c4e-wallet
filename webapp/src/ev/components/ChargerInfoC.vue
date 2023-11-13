<template>
  <Card class="content">
    <template #title>Charge point: {{ chargePointInfo?.chargePointId }}, Charge point connector: {{
        chargePointInfo?.name
      }}
    </template>
    <template #content>
      <p>Status: {{ chargePointInfo?.status }}</p>
      <p>Charge point id: {{ chargePointInfo?.chargePointId }}</p>
      <Tag icon="pi pi-check" :value="ChargerStatus[chargePointInfo?.active]" severity="success"/>
      <div>
        <Button v-if="chargePointInfo?.status === ChargerStatus.AVAILABLE" @click="nextStep()">
          Next
        </Button>
      </div>
    </template>
  </Card>
</template>


<script setup lang="ts">
import {ChargePointInfo, ChargerStatus} from "@/models/ev/chargerInfo";

defineProps({
  chargePointInfo: {
    type: Object as () => ChargePointInfo,
    required: true
  }}
 );

const nextStep = async () => {
  // TODO: implement route
}
</script>

<style scoped lang="scss">
.content {
  fill: rgba(153, 232, 14, 0.50);
  filter: drop-shadow(0px 0px 32px rgba(112, 112, 112, 0.50));
}
</style>
