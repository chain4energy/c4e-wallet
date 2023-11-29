<template>
  <div class="about">
    <h1>Your chargers</h1>
  </div>
  <div>
    <div v-for="charger in chargerStore.getChargePoints" :key="charger.id">
      <ChargePointC :charge-point="charger"/>
    </div>
  </div>

  <Button @click="goTo_AddChargerView()">Add new charger</Button>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/ev/store/owner.store";
import {onMounted} from "vue";
import ChargePointC from "@/ev/components/ChargePointC.vue";
import {goTo_AddChargerView, goTo_TariffGroupsView} from "@/ev/router/goToRoute";

const chargerStore = useOwnerStore();

onMounted(async () => {
  await chargerStore.fetchAllChargeStoreData();
})

</script>
<style lang="scss" scoped>


</style>
<style>

</style>
