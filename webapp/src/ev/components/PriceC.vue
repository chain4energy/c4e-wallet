<template>
  <Card class="content">
    <template #title> Price</template>
    <template #content>
      <p>Cena za 1 kWh</p>
      <p>{{priceInfo.pricePerKwh}}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {PriceInfo} from "@/ev/models/chargerInfo";
  defineProps<{
    priceInfo?: PriceInfo
  }>()
</script>

<style scoped lang="scss">
.content {
  fill: rgba(153, 232, 14, 0.50);
  filter: drop-shadow(0px 0px 32px rgba(112, 112, 112, 0.50));
  margin-top: 25px;
}

</style>
