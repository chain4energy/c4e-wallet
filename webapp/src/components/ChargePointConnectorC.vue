<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointConnector.name }}</h3>
    </template>

    <template #content>
      <h3>Status: {{ chargePointConnector.status }}</h3>
      <h3>Identifier: {{ chargePointConnector.identifier }}</h3>
      <h3 v-if="chargePointConnector.errorCode">Error code: {{ chargePointConnector.errorCode}}</h3>
      <div v-if="chargePointConnector.url">
        <a :href="chargePointConnector.url">LINK</a>
        <div class="qrcode">
          <QrcodeVue :value="chargePointConnector.url" size="200" :render-as="'svg'"></QrcodeVue>
<!--          <img-->
<!--            class="qrcode__image"-->
<!--            src="@/assets/svg/C4E.svg"-->
<!--            alt="C4E logo"-->
<!--          />-->
        </div>

      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">
import {ChargePointConnector} from "@/models/chargePointConnector";
import {useOwnerStore} from "@/store/owner.store";
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
.qrcode {
  display: inline-block;
  font-size: 0;
  margin-bottom: 0;
  position: relative;
}

.qrcode__image {
  background-color: #fff;
  border: 0.25rem solid #fff;
  border-radius: 10px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  height: 30%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
}
</style>
