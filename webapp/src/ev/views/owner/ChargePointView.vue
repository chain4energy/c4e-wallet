<template>
  <div v-if="!chargeStore.selectedChargePoint">
    <h1>No selected charge point</h1>
  </div>
  <div v-if="chargeStore.selectedChargePoint">
    <Card>
      <template #title>
        <h3>Name: {{ chargeStore.selectedChargePoint.name }}</h3>
      </template>

      <template #content>
        <div style="background: green; color: white">
          <h3>Status: {{ chargeStore.selectedChargePoint.status }}</h3>
          <h3>Integration type: {{ chargeStore.selectedChargePoint.integrationType }}</h3>
          <h3>Charge point id: {{ chargeStore.selectedChargePoint.id }}</h3>
          <h3>Connectors number: {{ chargeStore.selectedChargePoint.chargePointConnectors?.length }}</h3>
          <Button @click="deleteChargePoint(chargeStore.selectedChargePoint.id)">Delete</Button>
          <Button @click="changeChargePointActiveState()">
          <span v-if="chargeStore.selectedChargePoint.active">
            Disable
          </span>
            <span v-if="!chargeStore.selectedChargePoint.active">
            Enable
          </span>
          </Button>

          <div v-for="connector in chargeStore.selectedChargePoint.chargePointConnectors" :key="connector.name">
            <ChargePointConnectorC :cp-id="chargeStore.selectedChargePoint.id"
                                   :chargePointConnector="connector"/>
          </div>
          <TariffC :tariff="currentTariff" v-if="currentTariff" tg-id=""/>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/ev/store/owner.store";
import {computed} from "vue";
import TariffC from "@/ev/components/TariffC.vue";
import ChargePointConnectorC from "@/ev/components/ChargePointConnectorC.vue";
import {goTo_EvOwnerDashboardView} from "@/ev/router/goToRoute";

const chargeStore = useOwnerStore();

const currentTariff = computed(() => {
  const cpId = chargeStore.selectedChargePoint?.id;
  return cpId ? chargeStore.getTariffForChargePoint(cpId) : null;
});

const changeChargePointActiveState = () => {
  if (!chargeStore.selectedChargePoint) return console.error("No charge point selected");
  const chargePointChangeActiveState = {
    active: !chargeStore.selectedChargePoint.active
  }
  chargeStore.changeChargePointActiveState(chargeStore.selectedChargePoint.id, chargePointChangeActiveState)
}

const deleteChargePoint = (id: string | undefined) => {
  if (id) {
    chargeStore.deleteChargePoint(id, true, goTo_EvOwnerDashboardView);
  }
}
</script>

<style scoped lang="scss">
/* Your styles here */
</style>
