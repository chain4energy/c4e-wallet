<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePoint.name }}</h3>
    </template>

    <template #content>
      <div style="background: green; color: white" @click="navigateToChargePoint()">
        <h3>Status: {{ chargePoint.status }}</h3>
        <h3>Integration type: {{ chargePoint.integrationType }}</h3>
        <h3>Charge point id: {{ chargePoint.id }}</h3>
        <h3>Connectors number: {{ chargePoint.chargePointConnectors?.length }}</h3>
        <Button @click="deleteChargePoint(chargePoint.id)">Delete</Button>
        <Button @click="navigateToChargePoint()">Open</Button>
        <TariffC :tariff="currentTariff" v-if="currentTariff"/>
        <h3 v-if="!currentTariff">No active tariffs found</h3>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {ChargePoint} from "@/ev/models/chargePoint";
import {useOwnerStore} from "@/ev/store/owner.store";
import {computed} from "vue";
import TariffC from "@/ev/components/TariffC.vue";
import {goTo_ChargePointView, goTo_EvOwnerDashboardView} from "@/ev/router/goToRoute";

const chargeStore = useOwnerStore();

const props = defineProps({
    chargePoint: {
      type: Object as () => ChargePoint,
      required: true
    }
  }
);

const navigateToChargePoint = () => {
  chargeStore.selectedChargePoint = props.chargePoint;
  goTo_ChargePointView();
}

const currentTariff = computed(() => chargeStore.getTariffForChargePoint(props.chargePoint.id));

const deleteChargePoint = (id: string) => {
  chargeStore.deleteChargePoint(id, true, goTo_EvOwnerDashboardView)
}
</script>

<style scoped lang="scss">

</style>
