<template>
  <Card>
    <template #title>
      <h3>Name: {{ chargePointEvse.name }}</h3>
    </template>

    <template #content>
      <h3>Status: {{ chargePointEvse.status }}</h3>
      <h3>Identifier: {{ chargePointEvse.deviceId }}</h3>
      <h3 v-if="chargePointEvse.errorCode">Error code: {{ chargePointEvse.errorCode }}</h3>
      <div v-if="chargePointEvse.url">
        <a :href="chargePointEvse.qrCodeLink">{{ chargePointEvse.qrCodeLink }}</a>
        <div class="qrcode">
          <QrcodeVue :value="chargePointEvse.qrCodeLink" size="200" :render-as="'svg'"></QrcodeVue>
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
import {ChargePointEvses} from "@/models/chargePointEvses";
import {useOwnerStore} from "@/store/owner.store";
import QrcodeVue from "qrcode.vue";
import {onMounted} from "vue";

const chargeStore = useOwnerStore();

const props = defineProps({
    chargePointEvse: {
      type: Object as () => ChargePointEvses,
      required: true
    }
  }
);

onMounted(() => {
  if (!props.chargePointEvse.qrCodeLink) {
    chargeStore.getQrCode(props.chargePointEvse);
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
