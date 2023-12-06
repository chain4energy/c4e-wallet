<template>
  <Card>
    <template #title>
      <h3>Tariff group name: {{ tariffGroup.name }}</h3>
    </template>

    <template #content>
      <p>Active: {{ tariffGroup.active }}</p>
      <p>Number of tariffs: {{ tariffGroup.tariffs.length }}</p>
<!--      <div v-for="tariff in tariffGroup.tariffs"  :key="tariff.name">-->
<!--        <TariffC :tariff="tariff"  :tg-id="tariffGroup.id"/>-->
<!--      </div>-->
      <DataTable :value="tariffGroup.tariffs" tableStyle="min-width: 50rem">
        <Column field="name" header="Name"></Column>
        <Column field="unit" header="Unit"></Column>
        <Column field="unitCost" header="UnitCost"></Column>
        <Column field="currency" header="Currency"></Column>
        <Column field="active" header="Active"></Column>
        <Column field="startDate" header="StartDate"></Column>
        <Column field="endDate" header="EdDate"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import {TariffGroup} from "@/ev/models/tariffGroup";
import TariffC from "@/ev/components/TariffC.vue";
import {useOwnerStore} from "@/ev/store/owner.store";


const chargerStore = useOwnerStore();

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
