<template>
  <div>
    <Dialog :visible="visible" @update:visible="emit('closeModal')" modal header="Payment" :baseZIndex="-100" :style="{ width: '80vw' }">
      <div>
        <InvestmentCalculator @onBuy="onBuyClick" :disable-stablecoin="sourceAddress == undefined" :first-input-blocked="true" :is-declaration="false"
                              :second-input-default-value="Number(reservation.leftToPay())" />
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

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  reservation: {
    type: TokenReservation,
    required: true
  }
});
const emit = defineEmits(["closeModal", 'confirm']);

const sourceAddress = computed(() => {
  return useUserServiceStore().ethereumAddress;
});
const onBuyClick = () => {
  emit('confirm');
};

</script>

<style scoped lang="scss">

</style>
