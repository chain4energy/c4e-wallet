<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointConnector.name }}</h3>
    </template>

    <template #content>
      <h3>Status: {{ chargePointConnector.status }}</h3>
      <h3>Identifier: {{ chargePointConnector.identifier }}</h3>
      <h3 v-if="chargePointConnector.errorCode">Error code: {{ chargePointConnector.errorCode}}</h3>

      <QrcodeVue :value="getQrCode()" size="200" :render-as="'svg'"></QrcodeVue>
    </template>
  </Card>
</template>
<script setup lang="ts">
import {ChargePointConnector} from "@/ev/models/chargePointConnector";
import {useOwnerStore} from "@/ev/store/owner.store";
import QrcodeVue from "qrcode.vue";

const chargeStore = useOwnerStore();

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

const getQrCode = () => {
  return chargeStore.getQrCode();
}

</script>
<style scoped lang="scss">

</style>
