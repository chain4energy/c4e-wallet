<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePoint.name }}</h3>
    </template>

    <template #content>
      <div style="background: green; color: white">
        <h3>Status: {{ chargePoint.status }}</h3>
        <h3>Integration type: {{ chargePoint.integrationType }}</h3>
        <h3>Charge point id: {{ chargePoint.id }}</h3>
        <h3>Connectors number: {{ chargePoint.chargePointConnectors?.length }}</h3>
        <Button @click="deleteChargePoint(chargePoint.id)">Delete</Button>
        <div v-for="connector in chargePoint.chargePointConnectors" :key="connector.name">
          <ChargePointConnectorC :cp-id="chargePoint.id" :chargePointConnector="connector"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {ChargePoint} from "@/ev/models/chargePoint";
import ChargePointConnectorC from "@/ev/components/ChargePointConnectorC.vue";
import {useChargerStore} from "@/ev/store/owner.store";

const chargeStore = useChargerStore();

defineProps({
    chargePoint: {
      type: Object as () => ChargePoint,
      required: true
    }
  }
);

const deleteChargePoint = (id: string) => {
  chargeStore.deleteChargePoint(id)
}
</script>

<style scoped lang="scss">

</style>
