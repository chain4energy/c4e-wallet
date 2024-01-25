<template>
  <Card class="w-full border-lime-600 border-2 shadow-lg shadow-black/50 cursor-pointer hover:shadow-black/70 hover:shadow-xl transition text-black" @click="navigateToChargePoint()">
    <template #title>
      <h3 class="font-[Audiowide] w-full text-center text-xl sm:text-3xl">{{ chargePoint.name }}</h3>
    </template>
    <template #content>
      <div class="flex flex-inline items-center flex-wrap p-0">
        <div class="flex flex-col flex-1 min-w-[200px] font-[Audiowide] sm:text-lg mb-2">
          <span>Model - {{chargerDetails.name}}</span>
          <span>Connector - {{$t('PLUG_TYPES.' + chargerDetails.plugType)}}</span>
          <span>Status - <span :class="getStatusColor(chargePoint.status)">{{ $t('CHARGE_POINT_STATUS.' + chargePoint.status.toUpperCase()) }}</span></span>
          <div v-if="hide">
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
            <TariffC :tariff="currentTariff" v-if="currentTariff"/>
            <h3 v-if="!currentTariff">No active tariffs found</h3>
          </div>
        </div>
        <div class="w-1/4 min-w-[120px] flex justify-center items-center mx-auto">
          <!-- TODO: Icon from chargePoint data --->
          <img src="@/assets/images/HABU.png" class="w-full" alt="HABU icon"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {ChargePoint, ChargePointStatusType} from "@/models/chargePoint";
import {useOwnerStore} from "@/store/owner.store";
import {computed} from "vue";
import TariffC from "@/components/TariffC.vue";
import {goTo_ChargePointView, goTo_EvOwnerDashboardView} from "@/router/goToRoute";
import {ChargePointDict} from "@/models/chargePointDict";

const chargeStore = useOwnerStore();

const props = defineProps<{chargePoint: ChargePoint, hide?: boolean}>();

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

const chargerDetails = computed<ChargePointDict>(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === props.chargePoint?.chargePointDictId);
});

const getStatusColor = (status: ChargePointStatusType) => {
  switch (status) {
    case ChargePointStatusType.AVAILABLE: return 'text-lime-600';
    case ChargePointStatusType.PREPARING: return 'text-gold-600';
    case ChargePointStatusType.Created: return 'text-blue-600';
    case ChargePointStatusType.UNKNOWN: return 'text-zinc-600';

  }
};

</script>

<style scoped lang="scss">
</style>
