<template>
  <Card>
    <template #title>
      <h3>Name: {{ tariffGroup.name }}</h3>
    </template>

    <template #content>
      <h3>Active: {{ tariffGroup.active }}</h3>
      <h3>Number of tariffs: {{ tariffGroup.tariffs.length }}</h3>

      <div v-for="tariff in tariffGroup.tariffs"  :key="tariff.name">
        <TariffC :tariff="tariff" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {TariffGroup} from "@/models/ev/tariffGroup";
import TariffC from "@/ev/components/TariffC.vue";

defineProps({
    tariffGroup: {
      type: Object as () => TariffGroup,
      required: true
    }
  }
);
</script>

<style scoped lang="scss">

</style>
