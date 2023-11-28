<template>
  <Card>
    <template #title>
      <h3>Tariff group name: {{ tariffGroup.name }}</h3>
    </template>

    <template #content>
      <h3>Active: {{ tariffGroup.active }}</h3>
      <h3>Number of tariffs: {{ tariffGroup.tariffs.length }}</h3>
      <Button @click="deleteTariffGroup(tariffGroup.id)">Delete</Button>
      <div v-for="tariff in tariffGroup.tariffs"  :key="tariff.name">
        <TariffC :tariff="tariff"  :tg-id="tariffGroup.id"/>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {TariffGroup} from "@/ev/models/tariffGroup";
import TariffC from "@/ev/components/TariffC.vue";
import {useChargerStore} from "@/ev/store/owner.store";

const chargerStore = useChargerStore();

defineProps({
    tariffGroup: {
      type: Object as () => TariffGroup,
      required: true
    }
  }
);

const deleteTariffGroup = (id: number) => {
  chargerStore.deleteTariffGroup(id)
}
</script>

<style scoped lang="scss">

</style>
