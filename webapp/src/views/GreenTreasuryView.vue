<template>

  <div>
    <GreenTreasurySummary/>
  </div>

</template>

<script setup lang="ts">

import GreenTreasurySummary from "@/components/greentreasury/GreenTreasurySummary.vue";
import {onMounted, onUnmounted} from "vue";
import dataService from "@/services/data.service";

onMounted(() => {
  dataService.onGreenTreasurySelected();
});

onUnmounted(() => {
  dataService.onGreenTreasuryUnselected();
});

</script>

<style scoped lang="scss">
</style>
