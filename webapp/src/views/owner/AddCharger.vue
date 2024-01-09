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
    <div class="p-fluid">
      <h2>Charger Details</h2>
      <InputText v-model="chargerStore.createChargePointFromDict.id" placeholder="Charger ID"/>
      <InputText v-model="chargerStore.createChargePointFromDict.name" placeholder="Charger Name"/>
      <InputText v-model="chargerStore.createChargePointFromDict.identificationCode" placeholder="Identification Code"/>
    </div>
    <div class="p-fluid">
      <h2>Tariff Details</h2>
      <InputText v-model="createTariffForChargePoint.name" placeholder="Tariff Name"/>
      <Dropdown v-model="createTariffForChargePoint.currency"
                placeholder="Select country"
                :options="countryOptions"
                optionLabel="name"
                optionValue="currency" />
      <Dropdown v-model="createTariffForChargePoint.unit" placeholder="Select unit" :options="['Wh', 'kWh']"/>
      <InputText v-model="createTariffForChargePoint.unitCost" placeholder="Unit Cost"/>
    </div>

    <Button @click="createChargerFromDict()">Add charger</Button>
  </div>

</template>

<script setup lang="ts">
import {useOwnerStore} from "@/store/owner.store";
import ChargePointDictC from "@/components/ChargePointDictC.vue";
import {ChargePointDict} from "@/models/chargePointDict";
import {goTo_ChargePointView} from "@/router/goToRoute";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import {computed, ref} from "vue";
import {CreateTariffForChargePoint} from "@/models/createTariffForChargePoint";

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

const europeanCountries = [
  { name: 'Poland', currency: 'PLN' },
  { name: 'Germany', currency: 'EUR' },
  { name: 'France', currency: 'EUR' },
  { name: 'Spain', currency: 'EUR' },
  { name: 'Italy', currency: 'EUR' },
  { name: 'United Kingdom', currency: 'EUR' },
  { name: 'Switzerland', currency: 'EUR' },
  { name: 'Norway', currency: 'EUR' },
  { name: 'Sweden', currency: 'EUR' },
  { name: 'Denmark', currency: 'EUR' },
  { name: 'Greece', currency: 'EUR' },
  { name: 'Portugal', currency: 'EUR' },
  { name: 'Belgium', currency: 'EUR' },
  { name: 'Netherlands', currency: 'EUR' },
  { name: 'Austria', currency: 'EUR' },
  { name: 'Finland', currency: 'EUR' },
  { name: 'Ireland', currency: 'EUR' },
  { name: 'Czech Republic', currency: 'EUR' },
  { name: 'Hungary', currency: 'EUR' },
  { name: 'Romania', currency: 'EUR' },
];


const countryOptions = computed(() => {
  return europeanCountries.map(country => ({
    name: country.name,
    currency: country.currency
  }));
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
