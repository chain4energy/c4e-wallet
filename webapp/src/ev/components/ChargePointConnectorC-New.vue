<template>
  <Card>
    <template #title>
      <h3>Name: {{ evStore.getChargePointInfo?.name }}</h3>
    </template>
    <template #content>
      <h3>Active: {{evStore.getChargePointInfo?.active}}</h3>
      <h3>IdentificationCode: {{ evStore.getChargePointInfo?.identificationCode}}</h3>
      <h3>IntegrationType: {{ evStore.getChargePointInfo?.integrationType}}</h3>
      <h3>IntegrationVersion: {{ evStore.getChargePointInfo?.integrationVersion}}</h3>
      <h3>TariffGroupId: {{ evStore.getChargePointInfo?.tariffGroupId}}</h3>
      <h3>ErrorCode: {{ evStore.getChargePointInfo?.errorCode}}</h3>
      <h3>Connector Status: {{ evStore.getConnectorLiveStatus }}</h3>
    </template>
  </Card>
</template>
<script setup lang="ts">

import {onMounted} from "vue";
import {useEvStore} from "@/ev/store/ev.store";
import {getChargerPointUrlFromChargerPointConnectorUrl} from "@/ev/services/utils";

const evStore = useEvStore();

const props = defineProps({
    chargePointConnectorUrl: {
      type: String,
      required: true
    },
    showQrCode: {
      type: Boolean,
      default: false
    },
  }
);

onMounted(() => {
  if(props.chargePointConnectorUrl != "") {
    evStore.fetchChargePointConnectorLiveStatus(props.chargePointConnectorUrl);
    evStore.fetchChargePointInfo(getChargerPointUrlFromChargerPointConnectorUrl(props.chargePointConnectorUrl));
  }
});

</script>
<style scoped lang="scss">

</style>
