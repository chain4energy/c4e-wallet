<template>
  <h2>Add new charger</h2>

  <div v-if="!selectedChargePointDict">
    <div class="selectCharger" v-for="chargePointDict in chargerStore.getChargePointDicts" :key="chargePointDict.name">
      <h2>Select charger type</h2>
      <ChargePointDictC :charge-point-dict="chargePointDict"/>
      <Button @click="selectChargePointDict(chargePointDict)">Select</Button>
    </div>
  </div>

  <div class="selectCharger" v-if="selectedChargePointDict">
    <ChargePointDictC :charge-point-dict="selectedChargePointDict"/>
    <h1 style="color: red">Selected</h1>
  </div>

  <div v-if="selectChargePointDict">
    <h2>Select tariff group</h2>
    <div class="selectCharger" v-for="tariffGroup in chargerStore.getTariffGroups" :key="tariffGroup.name">
      <TariffGroupC :tariff-group="tariffGroup"/>
      <Button @click="selectedTariffGroup = tariffGroup">Select</Button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {useChargerStore} from "@/store/chargers.store";
import {ref} from "vue";
import ChargePointDictC from "@/ev/components/ChargePointDictC.vue";
import TariffGroupC from "@/ev/components/TariffGroupC.vue";

const chargerStore = useChargerStore();
let selectedChargePointDict = ref()
let selectedTariffGroup = ref()

const selectChargePointDict = (chargePointDict: any) => {
  selectedChargePointDict.value = chargePointDict
}
</script>


<style scoped lang="scss">
.selectCharger {
  background: #0A6BDD;
  padding: 40px;
  border-radius: 20px;
}
</style>
