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

    <div class="p-fluid">
      <InputText v-model="createTariffForChargePoint.name" placeholder="Tariff Name"/>
      <Dropdown v-model="createTariffForChargePoint.currency" placeholder="Select currency" :options="['PLN', 'EUR']"/>
      <Dropdown v-model="createTariffForChargePoint.unit" placeholder="Select unit" :options="['Wh', 'kWh']"/>
      <InputText v-model="createTariffForChargePoint.unitCost" placeholder="Unit Cost"/>
      <Calendar v-model="createTariffForChargePoint.startDate" placeholder="Start Date"/>
      <Calendar v-model="createTariffForChargePoint.endDate" placeholder="End Date"/>
    </div>

    <Button @click="createChargerFromDict()">Add charger</Button>
  </div>

  <div v-if="chargerStore.selectedChargePointDict">
    <Button @click="goTo_AddTariffForChargePointView()">Add new tariff</Button>
  </div>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/ev/store/owner.store";
import ChargePointDictC from "@/ev/components/ChargePointDictC.vue";
import TariffGroupC from "@/ev/components/TariffGroupC.vue";
import {ChargePointDict} from "@/ev/models/chargePointDict";
import {TariffGroup} from "@/ev/models/tariffGroup";
import {
  goTo_AddTariffForChargePointView,
  goTo_AddTariffGroupView, goTo_ChargePointView,
  goTo_EvOwnerDashboardView
} from "@/ev/router/goToRoute";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import {ref} from "vue";
import {CreateTariffForChargePoint} from "@/ev/models/createTariffForChargePoint";

const chargerStore = useOwnerStore();

const selectChargePointDict = (chargePointDict: ChargePointDict) => {
  chargerStore.selectedChargePointDict = chargePointDict
}

const createTariffForChargePoint = ref<CreateTariffForChargePoint>({
  accountId: undefined,
  currency: "",
  name: "",
  unit: "",
  unitCost: "",
});

const createChargerFromDict = async () => {
  await chargerStore.createChargePointFromDictFn(true)
  if (chargerStore.selectedChargePoint) {
    await chargerStore.createTariffForChargePoint(chargerStore.selectedChargePoint.id, createTariffForChargePoint.value, true, goTo_ChargePointView)
  }
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
