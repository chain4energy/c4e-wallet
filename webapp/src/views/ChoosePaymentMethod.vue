<template>
  <h1>Informacje</h1>

  <h3>Przed rozpoczęciem płatnego ładowania zostanie pobrana przedpłata w wysokości 50PLN</h3>
  <Button @click="navigateToPrzelewy24Confirmation()">Przelewy 24</Button>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";

const router = useRouter();

function navigateToPrzelewy24Confirmation() {
  router.push({ name: 'ev_MockPayment' });
  // router.push({ name: 'przelewy24-confirmation' })
}

</script>


<style scoped lang="scss">

</style>
