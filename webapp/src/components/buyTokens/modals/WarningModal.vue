<template>
  <div>
    <Dialog :visible="visible" @update:visible="emit('closeModal')" modal header="Warning" :baseZIndex="-100" :style="{ width: '600px' }">
      <div class="warning_container ">
        <img class="icon" src="@/assets/svg/warning-triangle.svg">
        <div class="text">
          When using this payment option, remember that tokens must be sent from the <b>{{sourceAddress}}</b> address. If you make a payment from a different address, the payment will not be accepted.
        </div>
      </div>
      <div class="buttons">
        <Button
          style="width: 180px"
          class="p-button p-component secondary"
          @click="emit('closeModal')">Cancel</Button>
        <Button
          style="width: 180px"
          class="p-button p-component secondary"
          @click="emit('confirm')">Continue</Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

import Dialog from "primevue/dialog";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation} from "@/store/publicSales.store";
import {computed} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useConfigurationStore} from "@/store/configuration.store";
import {AddressType} from "@/components/buyTokens/modals/AddressType";

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(["closeModal", 'confirm']);
const sourceAddress = computed(() => {
  return useUserServiceStore().ethereumAddress;
});
</script>

<style scoped lang="scss">

.warning_container {
  color: black;
  font-weight:400;
  display: flex;

  padding: 20px;

  font-size: 1.15em;
  .icon {
    width: 100px;
  }
  .text {
    margin-left: 15px;
    margin-right: 10px;
  }
}
.buttons {
  display: flex;
  justify-content: center;
}
</style>
