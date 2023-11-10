<template>
  <p>
    Location: {{ chargerInfo.location }}
  </p>
  <Card class="content">
    <template #title> Simple Card</template>
    <template #content>
      <p>{{ chargerInfo.name }}</p>
      <p>{{ chargerInfo.connectorType }}</p>
      <p>{{ chargerInfo.availability }}</p>
      <p>{{ chargerInfo.status }}</p>
      <Tag icon="pi pi-check" :value="ChargerStatus[chargerInfo?.status]" severity="success"/>
    </template>
  </Card>
</template>


<script setup lang="ts">
import {ChargerInfo, ChargerStatus} from "@/models/ev/chargerInfo";

defineProps<{
  chargerInfo?: ChargerInfo
}>()
</script>

<style scoped lang="scss">
.content {
  fill: rgba(153, 232, 14, 0.50);
  filter: drop-shadow(0px 0px 32px rgba(112, 112, 112, 0.50));
}

</style>
