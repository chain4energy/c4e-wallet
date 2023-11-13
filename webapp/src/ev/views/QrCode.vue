<template>
  <form>
    <InputText v-model="qrCodeInfoForm.qrCodeInfoPath" placeholder="QR Code Info Path"/>
    <Button label="Get QR Code Info" @click="submitQrCodeInfo()"/>
    <Button label="Fetch Connector from QR Code Info Path" @click="fetchConnectorInfo()"/>
  </form>
  <form style="margin-bottom: 25px;">
    <InputText v-model="chargePointForm.chargePointId" placeholder="Charge Point ID"/>
    <InputText v-model="chargePointForm.connectorId" placeholder="Connector ID" type="number"/>
    <Button @click="submitChargePointInfo()" label="Fetch Charge Point Info"/>
  </form>

  <chargerInfoC v-if="evStore.getChargePointInfo" :charge-point-info="evStore.getChargePointInfo"></chargerInfoC>
  <priceC :price-info="priceInfo"></priceC>
</template>
<script setup lang="ts">
import {useRoute} from 'vue-router'
import {onMounted, ref} from "vue";
import PriceC from "@/ev/components/PriceC.vue";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {PriceInfo} from "@/models/ev/chargerInfo";
import {useEvStore} from "@/store/ev.store";

const route = useRoute()
const evStore = useEvStore();

const chargePointForm = ref({
  chargePointId: 'oko',
  connectorId: '1'
});

const qrCodeInfoForm = ref({
  qrCodeInfoPath: '/v0.1/charge_point/oko/connector/1'
});



const submitChargePointInfo = async () => {
  await evStore.mockFetchChargePointInfo(chargePointForm.value.chargePointId, parseInt(chargePointForm.value.connectorId));
};

const submitQrCodeInfo = () => {
  evStore.mockGetQrCodeInfo(qrCodeInfoForm.value.qrCodeInfoPath);
};

const fetchConnectorInfo = async () => {
  await evStore.fetchChargePointInfo();
};

async function fetchAllData() {
  console.log(route.params.context);
  const qrCodePath = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + qrCodePath);
  await evStore.getQrCodeInfo(qrCodePath)
  await fetchConnectorInfo()
}

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

</script>

<style scoped lang="scss">

</style>
