<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointConnector.name }}</h3>
    </template>

    <template #content>
      <h3>Status: {{ chargePointConnector.status }}</h3>
      <h3>Identifier: {{ chargePointConnector.identifier }}</h3>
      <h3>Charge point id: {{ chargePointConnector.id}}</h3>
      <h3>Error code: {{ chargePointConnector.errorCode}}</h3>
      <Button @click="deleteChargePointConnector(cpId, chargePointConnector.identifier)">Delete</Button>
    </template>
  </Card>
</template>
<script setup lang="ts">
import {ChargePointConnector} from "@/ev/models/chargePointConnector";
import {useChargerStore} from "@/ev/store/owner.store";

const chargeStore = useChargerStore();

defineProps({
    chargePointConnector: {
      type: Object as () => ChargePointConnector,
      required: true
    },
    cpId: {
      type: String,
      required: true
    },
  }
);

const deleteChargePointConnector = (cpId: string, id: number) => {
  chargeStore.deleteChargePointConnector(cpId, id)
}
</script>
<style scoped lang="scss">

</style>
