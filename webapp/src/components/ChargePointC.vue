<template>
  <Card class="w-full border-lime-600 border-2 shadow-lg shadow-black/50 cursor-pointer hover:shadow-black/70 hover:shadow-xl transition text-black" @click="navigateToChargePoint()">
    <template #title>
      <h3 class="font-[Audiowide] w-full text-center text-xl sm:text-3xl">{{ chargePoint.name }}</h3>
    </template>
    <template #content>
      <div class="flex flex-inline items-center flex-wrap p-0">
        <div class="flex flex-col flex-1 min-w-[200px] font-medium sm:text-lg mb-2 font-[Roboto]">
          <span>Model - {{chargerDetails.name}}</span>
          <span>Connector - {{$t('PLUG_TYPES.' + chargerDetails.plugType)}}</span>
          <span>Status - <span :class="getStatusColor(status)">{{ $t('CHARGE_POINT_STATUS.' + status) }}</span></span>
        </div>
        <div class="w-1/4 min-w-[120px] flex justify-center items-center mx-auto">
          <!-- TODO: Icon from chargePoint data --->
          <img src="@/assets/images/habu2.jpg" class="w-full" alt="HABU icon"/>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {ChargePoint, ChargePointStatusType} from "@/models/chargePoint";
import {useOwnerStore} from "@/store/owner.store";
import {computed, onMounted, ref} from "vue";
import TariffC from "@/components/TariffC.vue";
import {goTo_ChargePointView, goTo_EvOwnerDashboardView} from "@/router/goToRoute";
import {ChargePointDict} from "@/models/chargePointDict";
import {useEvStore} from "@/store/ev.store";
import {ChargePointEvseStatusResponse} from "@/models/chargePointEvse";
import {AvailabilityEnum, getAvailability} from "@/utils/getAvailability";

const chargeStore = useOwnerStore();

const props = defineProps<{chargePoint: ChargePoint}>();

const status = ref<AvailabilityEnum>();

onMounted(() => {
  useEvStore().fetchConnectorLiveStatus(props.chargePoint.chargePointEvses[0]?.url).then(r => {
      status.value = getAvailability(r);
  });
});

const navigateToChargePoint = () => {
  chargeStore.selectedChargePoint = props.chargePoint;
  goTo_ChargePointView();
};

const chargerDetails = computed<ChargePointDict>(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === props.chargePoint?.chargePointDictId);
});

const getStatusColor = (status: AvailabilityEnum | undefined) => {
  switch (status) {
    case AvailabilityEnum.AVAILABLE: return 'text-lime-600';
    case AvailabilityEnum.CHARGING: return 'text-gold-600';
    default: return 'text-zinc-600';
  }
};

</script>

<style scoped lang="scss">
</style>
