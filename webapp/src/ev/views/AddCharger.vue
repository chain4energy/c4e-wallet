<template>
  <h2>Add new charger</h2>

  <div v-if="!chargerStore.selectedChargePointDict">
    <div class="selectCharger" v-for="chargePointDict in chargerStore.getChargePointDicts" :key="chargePointDict.name">
      <h2>Select charger type</h2>
      <ChargePointDictC :charge-point-dict="chargePointDict"/>
      <Button @click="selectChargePointDict(chargePointDict)">Select</Button>
    </div>
  </div>

  <div class="selectCharger" v-if="chargerStore.selectedChargePointDict">
    <ChargePointDictC :charge-point-dict="chargerStore.selectedChargePointDict"/>
    <h1 style="color: red">Selected</h1>
  </div>

  <div v-if="chargerStore.selectedChargePointDict">
    <h2>Charger Details</h2>
    <InputText v-model="chargerStore.createChargePointFromDict.id" placeholder="Charger ID"/>
    <InputText v-model="chargerStore.createChargePointFromDict.name" placeholder="Charger Name"/>
    <InputText v-model="chargerStore.createChargePointFromDict.identificationCode" placeholder="Identification Code"/>
    <Button @click="createChargerFromDict()">Add charger</Button>
  </div>

  <div v-if="chargerStore.selectedChargePointDict">
    <div v-if="chargerStore.getTariffGroups?.length === 0">
      <h2>No tariff groups found</h2>
    </div>
    <div v-if="chargerStore.getTariffGroups?.length > 0">
      <h2>Select tariff group</h2>
      <div class="selectCharger" v-for="tariffGroup in chargerStore.getTariffGroups" :key="tariffGroup.name">
        <TariffGroupC :tariff-group="tariffGroup"/>
        <Button @click="selectTariffGroup(tariffGroup)" v-if="chargerStore.selectedTariffGroup?.id !== tariffGroup.id">
          Select
        </Button>
        <Button class="selected" @click="selectTariffGroup(tariffGroup)"
                v-if="chargerStore.selectedTariffGroup?.id === tariffGroup.id">Selected
        </Button>
      </div>
    </div>
    <Button @click="addNewTariffGroup()">Add new tariff group</Button>
  </div>


</template>

<script setup lang="ts">
import {useChargerStore} from "@/store/chargers.store";
import ChargePointDictC from "@/ev/components/ChargePointDictC.vue";
import TariffGroupC from "@/ev/components/TariffGroupC.vue";
import {ChargePointDict} from "@/models/ev/chargePointDict";
import {TariffGroup} from "@/models/ev/tariffGroup";
import {useRouter} from "vue-router";

const chargerStore = useChargerStore();
const router = useRouter()

const selectChargePointDict = (chargePointDict: ChargePointDict) => {
  chargerStore.selectedChargePointDict = chargePointDict
}

const selectTariffGroup = (tariffGroup: TariffGroup) => {
  chargerStore.selectedTariffGroup = tariffGroup
}

const addNewTariffGroup = () => {
  router.push('/ev/addTariffGroup');
}

const createChargerFromDict = () => {
  chargerStore.createChargePointFromDictFn(true, () => {
    router.push("/ev/owner");
  })
};
</script>


<style scoped lang="scss">
.selectCharger {
  background: #0A6BDD;
  padding: 40px;
  border-radius: 20px;
}

.selected {
  color: green;
  transform: scale(1.1)
}
</style>
