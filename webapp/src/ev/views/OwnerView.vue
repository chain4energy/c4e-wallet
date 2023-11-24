<template>
  <div class="about">
    <h1>Your chargers</h1>
  </div>
  <div>
    <div v-for="charger in chargerStore.getChargePoints" :key="charger.id">
      <h2>Name: {{charger.name}}</h2>
      <h2>Integration type: {{charger.integrationType}}</h2>
      <h2>Status: {{charger.status}}</h2>


    </div>
  </div>

  <Button @click="addCharger()">Add new charger</Button>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useChargerStore} from "@/store/chargers.store";
import {onMounted} from "vue";

const router = useRouter()
const chargerStore = useChargerStore();


const addCharger = () => {
  router.push('/ev/addCharger')
}

onMounted(async () => {
  await chargerStore.fetchAllChargeStoreData();
})

</script>
<style lang="scss" scoped>


</style>
<style>

</style>
