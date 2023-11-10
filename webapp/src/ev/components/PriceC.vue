<template>
  <Card>
    <template #title> Price</template>
    <template #content>
      <p>Cena za 1 kWh</p>
      <p>{{priceInfo.pricePerKwh}}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {PriceInfo} from "@/models/ev/chargerInfo";
  defineProps<{
    priceInfo?: PriceInfo
  }>()
</script>

<style scoped lang="scss">

</style>
