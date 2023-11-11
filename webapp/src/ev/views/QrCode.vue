<template>
<!--  TODO: add form to insert charge point info data-->
  <chargerInfoC :charger-info="evStore.getChargerInfo"></chargerInfoC>
  <priceC :price-info="priceInfo"></priceC>
  <Button v-if="evStore.getChargerInfo?.status === ChargerStatus.AVAILABLE" @click="startCharging()">
    Start charging
  </Button>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import {onMounted} from "vue";
import PriceC from "@/ev/components/PriceC.vue";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {ChargerStatus, PriceInfo} from "@/models/ev/chargerInfo";
import {useEvStore} from "@/store/ev.store";

const route = useRoute()
const evStore = useEvStore();

onMounted(async () => {
  console.log(route.params.context);
  const qrCodePath = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + qrCodePath);
  await evStore.getQrCodeInfo(qrCodePath)
  // TODO: add charge point and connector info here for testing purposes
  await evStore.getChargePointInfo()
})

function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

const priceInfo: PriceInfo = {
  pricePerKwh: '123'
}

const startCharging = async () => {
  await evStore.startChargingSession()
}

</script>

<style scoped lang="scss">

</style>
