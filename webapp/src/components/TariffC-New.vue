<template>
  <Card>
    <template #title>
      <h3>Tariff name: {{ tariff.name }}</h3>
    </template>
    <template #content>
      <h3>Active: {{ tariff.active }}</h3>
      <h3>Currency: {{ tariff.currency }}</h3>
      <h3>Unit const: {{ tariff.unitCost }}</h3>
      <h3 v-if="tariff.startDate">Start date: {{ tariff.startDate }}</h3>
      <h3  v-if="tariff.endDate">End date: {{ tariff.endDate }}</h3>
      <Button @click="updateTariff(tariff.tariffGroupId, tariff.id)">Update</Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {Tariff} from "@/models/tariff";
import {useOwnerStore} from "@/store/owner.store";
import {goTo_UpdateTariffView} from "@/router/goToRoute";

const chargerStore = useOwnerStore();
defineProps({
    tariff: {
      type: Object as () => Tariff,
      required: true
    },
  }
);

const updateTariff = (tariffGroupId: number, tariffId: number) => {
  chargerStore.selectedTariff = chargerStore.selectedTariff = chargerStore.tariffGroups.find(tg => tg.id === tariffGroupId)?.tariffs.find(t => t.id === tariffId) as Tariff;
  goTo_UpdateTariffView();
}

const deleteTariff = (tgId: number, id: number) => {
  chargerStore.deleteTariff(tgId, id)
}
</script>


<style scoped lang="scss">

</style>
