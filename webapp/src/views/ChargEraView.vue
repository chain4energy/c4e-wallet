<template>

  <div>
    <ChargEraSummary/>
  </div>

</template>

<script setup lang="ts">

import ChargEraSummary from "@/components/chargera/ChargEraSummary.vue";
import {onMounted, onUnmounted} from "vue";
import dataService from "@/services/data.service";

onMounted(() => {
  dataService.onChargEraSelected();
});

onUnmounted(() => {
  dataService.onChargEraUnselected();
});

</script>

<style scoped lang="scss">
</style>
