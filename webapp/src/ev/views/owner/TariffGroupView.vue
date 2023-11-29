<template>
  <div v-if="chargerStore.getTariffGroups?.length === 0">
    <h2>No tariff groups found</h2>
  </div>
  <div v-if="chargerStore.getTariffGroups?.length > 0">
    <div class="selectCharger" v-for="tariffGroup in chargerStore.getTariffGroups" :key="tariffGroup.name">
      <TariffGroupC :tariff-group="tariffGroup"/>
    </div>
  </div>
  <Button @click="goTo_AddTariffGroupView()">Add new tariff group</Button>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/ev/store/owner.store";
import TariffGroupC from "@/ev/components/TariffGroupC.vue";
import {goTo_AddTariffGroupView} from "@/ev/router/goToRoute";

const chargerStore = useOwnerStore();

</script>


<style scoped lang="scss">

</style>
