<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePoint?.name }}</h3>
    </template>

    <template #content>
      <div style="background: green; color: white">
        <p>Status: {{ chargePoint?.status }}</p>
        <p>Integration type: {{ chargePoint?.integrationType }}</p>
        <p>Charge point id: {{ chargePoint?.id }}</p>
        <p>Connectors number: {{ chargePoint?.chargePointConnectors?.length }}</p>
        <div v-for="connector in chargePoint?.chargePointConnectors" :key="connector.id">
          <charge-point-connector-c-new :charge-point-connector="connector"/>
        </div>
        <div v-if="chargePoint?.tariffGroup">
          <tarrif-group-c-new :tariff-group="chargePoint.tariffGroup"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">

import {ChargePoint} from "@/models/chargePoint";
import ChargePointConnectorCNew from "@/components/ChargePointConnectorC-New.vue";
import TarrifGroupCNew from "@/components/TariffGroupC-New.vue";

const props = defineProps({
    chargePoint: {
      type: Object as () => ChargePoint,
      required: true
    }
  }
);

</script>

<style scoped lang="scss">

</style>
