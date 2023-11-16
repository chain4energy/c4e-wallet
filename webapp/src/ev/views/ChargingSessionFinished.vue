<template>
  <Card class="content">
    <template #title>Zakończono ładowanie.</template>
    <template #content>
      <h3>Zapłacona kwota 12PLN</h3>
      <h4>Pobrania energia: 25 kWh</h4>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {SessionInfo} from "@/models/ev/sessionInfo";

defineProps({
    sessionInfo: {
      type: Object as () => SessionInfo,
      required: true
    }
  }
);

</script>

<style scoped lang="scss">

</style>
