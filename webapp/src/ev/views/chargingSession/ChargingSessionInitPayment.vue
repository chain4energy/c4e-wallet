<template>
  <h1>Payment process</h1>
  <p>Informacja:</p>
  <p>Pobierzemy z twojego konta:{{amount}}{{currency}}</p>
  <Button @click="initPayment()">Init payment</Button>
</template>

<script setup lang="ts">
const emit = defineEmits(['initPayment']);

const props = defineProps({
  amount: {
    type: String ,
    required: true
  },
  currency: {
    type: String ,
    required: true
  },
});
function initPayment() {
  emit('initPayment');
}

</script>

<style scoped lang="scss">

</style>
