<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointConnector.name }}</h3>
    </template>

    <template #content>
      <h3>Status: {{ chargePointConnector.status }}</h3>
      <h3>Identifier: {{ chargePointConnector.identifier }}</h3>
      <h3 v-if="chargePointConnector.errorCode">Error code: {{ chargePointConnector.errorCode}}</h3>
      <div v-if="chargePointConnector.qrCodeLink">
        <a :href="chargePointConnector.qrCodeLink">{{chargePointConnector.qrCodeLink}}</a>
        <QrcodeVue :value="chargePointConnector.qrCodeLink" size="200" :render-as="'svg'"></QrcodeVue>
      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">
import {ChargePointConnector} from "@/ev/models/chargePointConnector";
import {useOwnerStore} from "@/ev/store/owner.store";
import QrcodeVue from "qrcode.vue";
import {onMounted} from "vue";

const chargeStore = useOwnerStore();

const props = defineProps({
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

onMounted(() => {
  if (!props.chargePointConnector.qrCodeLink) {
    chargeStore.getQrCode(props.chargePointConnector?.chargePointId, props.chargePointConnector?.identifier);
  }
});

</script>
<style scoped lang="scss">

</style>
