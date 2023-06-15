<template>
  <div>
    <Dialog :visible="visible" @update:visible="emit('closeModal')" modal header="Payment" :baseZIndex="-100" :style="{ width: '80vw' }">
      <div>
        <InvestmentCalculator @onBuy="onBuyClick" :first-input-blocked="true" :first-input-default-value="Number(reservation.amount.amount)" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

import Dialog from "primevue/dialog";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation} from "@/store/publicSales.store";

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

const onBuyClick = () => {
  emit('confirm');
};

</script>

<style scoped lang="scss">

</style>
