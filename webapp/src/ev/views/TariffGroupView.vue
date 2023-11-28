<template>
  <div v-if="chargerStore.getTariffGroups?.length === 0">
    <h2>No tariff groups found</h2>
  </div>
  <div v-if="chargerStore.getTariffGroups?.length > 0">
    <div class="selectCharger" v-for="tariffGroup in chargerStore.getTariffGroups" :key="tariffGroup.name">
      <TariffGroupC :tariff-group="tariffGroup"/>
    </div>
  </div>
  <Button @click="addNewTariffGroup()">Add new tariff group</Button>
</template>

<script setup lang="ts">
import {useChargerStore} from "@/ev/store/owner.store";
import TariffGroupC from "@/ev/components/TariffGroupC.vue";
import {useRouter} from "vue-router";

const chargerStore = useChargerStore();
const router = useRouter()
const addNewTariffGroup = () => {
  router.push('/ev/addTariffGroup');
}

</script>


<style scoped lang="scss">

</style>
