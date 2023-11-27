<template>
<!--all tariff data-->
  <Card>
    <template #title>
      <h3>Name: {{ tariff.name }}</h3>
    </template>
    <template #content>
      <h3>Active: {{ tariff.active }}</h3>
      <h3>Currency: {{ tariff.currency }}</h3>
      <h3>Unit const: {{ tariff.unitCost }}</h3>
      <h3>Start date: {{ tariff.startDate }}</h3>
      <h3>End date: {{ tariff.endDate }}</h3>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {Tariff} from "@/models/ev/tariff";

defineProps({
    tariff: {
      type: Object as () => Tariff,
      required: true
    }
  }
);
</script>


<style scoped lang="scss">

</style>
