<template>
  <Card class="w-full border-lime-600 border-2 shadow-lg shadow-black/50">
    <template #title>
      <h3 class="font-[Audiowide]">{{ chargePoint.name }}</h3>
    </template>

    <template #content>
      <div style="background: green; color: white">
        <span>{{chargerDetails.name}}</span>
        <h3>Status: {{ chargePoint.status }}</h3>
        <h3>Integration type: {{ chargePoint.integrationType }}</h3>
        <h3>Charge point id: {{ chargePoint.id }}</h3>
        <h3>Connectors number: {{ chargePoint.chargePointConnectors?.length }}</h3>
        <Button @click="deleteChargePoint()">Delete</Button>
        <Button @click="changeChargePointActiveState()">
          <span v-if="chargePoint.active">
            Disable
          </span>
          <span v-if="!chargePoint.active">
            Enable
          </span>
        </Button>
        <Button @click="navigateToChargePoint()">Open</Button>
        <TariffC :tariff="currentTariff" v-if="currentTariff"/>
        <h3 v-if="!currentTariff">No active tariffs found</h3>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {ChargePoint} from "@/models/chargePoint";
import {useOwnerStore} from "@/store/owner.store";
import {computed} from "vue";
import TariffC from "@/components/TariffC.vue";
import {goTo_ChargePointView, goTo_EvOwnerDashboardView} from "@/router/goToRoute";

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
};

const currentTariff = computed(() => chargeStore.getTariffForChargePoint(props.chargePoint.id));

const deleteChargePoint = () => {
  chargeStore.deleteChargePoint(props.chargePoint.id, true, goTo_EvOwnerDashboardView);
};

const changeChargePointActiveState = () => {
  const chargePointChangeActiveState = {
    active: !props.chargePoint.active
  };
  chargeStore.changeChargePointActiveState(props.chargePoint.id, chargePointChangeActiveState);
};

const chargerDetails = computed(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === props.chargePoint?.chargePointDictId);
})
</script>

<style scoped lang="scss">

</style>
