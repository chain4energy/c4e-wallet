<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointConnector?.name }}</h3>
    </template>
    <template #content>
      <p>Active: {{chargePointConnector?.active}}</p>
      <p>ErrorCode: {{chargePointConnector?.errorCode}}</p>
      <p>Status: {{chargePointConnector?.status}}</p>
    </template>
  </Card>
</template>
<script setup lang="ts">

import {onMounted} from "vue";
import {useEvStore} from "@/ev/store/ev.store";
import {getChargePointUrlFromChargerPointConnectorUrl} from "@/ev/services/utils";
import {ChargePointConnector} from "@/ev/models/chargePointConnector";

const evStore = useEvStore();

const props = defineProps({
    chargePointConnector: {
      type:  Object as () => ChargePointConnector,
      required: true
    },
    showQrCode: {
      type: Boolean,
      default: false
    },
  }
);

// onMounted(() => {
//
// });

</script>
<style scoped lang="scss">

</style>
