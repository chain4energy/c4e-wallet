<template>
  <div class="w-full h-full flex items-center justify-center relative">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full max-h-full p-2 sm:p-5 flex flex-col justify-between items-center">
      <div class="w-full">
        <BackCloseBar/>
        <h3 class="font-[Audiowide] text-black text-4xl w-full text-center -mt-5 mb-5">{{$t('HEADERS.ADD_CHARGER')}}</h3>
      </div>
      <ScrollerWrapper v-if="!chargerStore.selectedChargePointDict">
        <div class="border-2 rounded-xl p-2 border-lime-600 shadow-lg shadow-gray-500 cursor-pointer" v-for="chargePointDict in chargerStore.getChargePointDicts" :key="chargePointDict.name">
          <ChargerTypeDetails :charger-details="chargePointDict" @click="selectChargePointDict(chargePointDict)"/>
        </div>
      </ScrollerWrapper>
      <div class="selectCharger" v-else>
        <ChargerTypeDetails :charger-details="chargerStore.selectedChargePointDict"/>
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
      </div>
      <div class="w-full flex flex-inline gap-4 justify-center mt-4">
        <Button class="min-w-[50px] rounded-xl py-3 text-center text-lg font-semibold text-white flex justify-center bg-lime-600 shadow-lg shadow-gray-500" @click="selectChargePointDict(null)" v-if="chargerStore.selectedChargePointDict">
          <IconComponent name="Undo2"/>
        </Button>
        <div  v-if="chargerStore.selectedChargePointDict">
          <NextButton text="Add charger" icon="Plus"/>
        </div>
        <NextButton text="Back" icon="Undo2" @clicked="router.back()" v-else/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/store/owner.store";
import ChargePointDictC from "@/components/ChargePointDictC.vue";
import {ChargePointDict} from "@/models/chargePointDict";
import {goTo_AddChargerView, goTo_ChargePointView} from "@/router/goToRoute";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import {computed, ref} from "vue";
import {CreateTariffForChargePoint} from "@/models/createTariffForChargePoint";
import ChargerTypeDetails from "@/components/ChargerTypeDetails.vue";
import BackCloseBar from "@/components/BackCloseBar.vue";
import ScrollerWrapper from "@/components/ScrollerWrapper.vue";
import NextButton from "@/components/NextButton.vue";
import {useRouter} from "vue-router";
import IconComponent from "@/components/features/IconComponent.vue";

const chargerStore = useOwnerStore();
const router = useRouter();
const selectChargePointDict = (chargePointDict: ChargePointDict | null) => {
  chargerStore.selectedChargePointDict = chargePointDict;
};

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
  await chargerStore.createChargePointFromDictFn(true);
  if (chargerStore.selectedChargePoint) {
    await chargerStore.createTariffForChargePoint(chargerStore.selectedChargePoint.id, createTariffForChargePoint.value, true, goTo_ChargePointView);
  }
};
</script>


<style scoped lang="scss">

</style>
