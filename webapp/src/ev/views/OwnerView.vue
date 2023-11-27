<template>
  <div class="about">
    <h1>Your chargers</h1>
  </div>
  <div>
    <div v-for="charger in chargerStore.getChargePoints" :key="charger.id">
      <ChargePointC :charge-point="charger"/>
    </div>
  </div>

  <Button @click="addCharger()">Add new charger</Button>
  <Button @click="showTariffGroups()">Tariffs</Button>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useChargerStore} from "@/store/chargers.store";
import {onMounted} from "vue";
import ChargePointC from "@/ev/components/ChargePointC.vue";

const router = useRouter()
const chargerStore = useChargerStore();


const addCharger = () => {
  router.push('/ev/addCharger')
}

onMounted(async () => {
  await chargerStore.fetchAllChargeStoreData();
})

const showTariffGroups = () => {
  router.push('/ev/tariffGroups')
}

</script>
<style lang="scss" scoped>


</style>
<style>

</style>
