<template>
  <h1>Payment rejected</h1>
  <Button @click="navigateToChoosePaymentMethod()">Navigate back to choose payment method page</Button>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";

const router = useRouter()
function navigateToChoosePaymentMethod() {
  router.push({ name: 'ev_ChoosePaymentMethod' })
}
</script>


<style scoped lang="scss">

</style>
