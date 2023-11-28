<template>
  <Card>
    <template #title>
      <h3>Tariff name: {{ tariff.name }}</h3>
    </template>
    <template #content>
      <h3>Active: {{ tariff.active }}</h3>
      <h3>Currency: {{ tariff.currency }}</h3>
      <h3>Unit const: {{ tariff.unitCost }}</h3>
      <h3>Start date: {{ tariff.startDate }}</h3>
      <h3>End date: {{ tariff.endDate }}</h3>
      <Button @click="deleteTariff(tgId, tariff.id)">Delete</Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {Tariff} from "@/ev/models/tariff";
import {useChargerStore} from "@/ev/store/owner.store";

const chargerStore = useChargerStore();
defineProps({
    tariff: {
      type: Object as () => Tariff,
      required: true
    },
    tgId: {
      type: Number,
      required: true
    },
  }
);

const deleteTariff = (tgId: number, id: number) => {
  chargerStore.deleteTariff(tgId, id)
}
</script>


<style scoped lang="scss">

</style>
