<template>
  <div class="w-full h-full flex items-center justify-center relative">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full max-h-full p-2 sm:p-5 flex flex-col justify-between items-center">
      <div class="w-full">
        <BackCloseBar/>
        <h3 v-if="!chargerStore.selectedChargePointDict" class="font-[Audiowide] text-black text-4xl w-full text-center -mt-5 mb-5">{{$t('HEADERS.ADD_CHARGER')}}</h3>
      </div>
      <ScrollerWrapper v-if="!chargerStore.selectedChargePointDict">
        <div class="border-2 rounded-xl p-2 border-lime-600 shadow-lg shadow-gray-500 cursor-pointer" v-for="chargePointDict in chargerStore.getChargePointDicts" :key="chargePointDict.name">
          <ChargerTypeDetails :charger-details="chargePointDict" @click="selectChargePointDict(chargePointDict)"/>
        </div>
      </ScrollerWrapper>
      <div class="-mt-8" v-else>
        <ChargerTypeDetails :charger-details="chargerStore.selectedChargePointDict"/>
        <div v-if="chargerStore.selectedChargePointDict">
          <div>
            <span class="flex justify-center items-center w-full">
    <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
              <InputText v-model="chargerStore.createChargePointFromDict.id" placeholder="Charger ID" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
            </span>
            <span class="flex justify-center items-center w-full">
    <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
              <InputText v-model="chargerStore.createChargePointFromDict.name" placeholder="Charger Name" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
            </span>
            <span class="flex justify-center items-center w-full">
    <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
              <InputText v-model="chargerStore.createChargePointFromDict.identificationCode" placeholder="Identification Code" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
            </span>
          </div>
          <div class="w-[70%] mx-auto">
            <Dropdown v-model="createTariffForChargePoint.currency" :options="currencies" optionLabel="name" placeholder="Select currency" class="w-full border-b-2 my-4">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex justify-between">
              <span class="flex flex-inline">
<!--                <IconComponent name="Coins" class="text-lime-600 mr-2"/> -->
                {{$t('COMMON.CURRENCY')}}
              </span>
                  <span>{{slotProps.value}}</span>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
            </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center text-right justify-end">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
          <span class="flex justify-center items-center w-full">
    <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
              <InputText v-model="createTariffForChargePoint.unitCost" placeholder="Price per 1kWh" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
          </span>
          <span class="flex justify-center items-center w-full">
    <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
              <InputText v-model="createTariffForChargePoint.name" placeholder="Tariff Name" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
          </span>
        </div>
      </div>
      <div class="w-full flex flex-inline gap-4 justify-center mt-4">
        <Button class="min-w-[50px] rounded-xl py-3 text-center text-lg font-semibold text-white flex justify-center bg-lime-600 shadow-lg shadow-gray-500" @click="selectChargePointDict(null)" v-if="chargerStore.selectedChargePointDict">
          <IconComponent name="Undo2"/>
        </Button>
        <div  v-if="chargerStore.selectedChargePointDict">
          <NextButton text="Add charger" icon="Plus" @clicked="createChargerFromDict()"/>
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
  currency: "PLN",
  name: "",
  unit: "kWh",
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

const currencies = ['PLN', 'EUR'];

const createChargerFromDict = async () => {
  await chargerStore.createChargePointFromDictFn(true);
  if (chargerStore.selectedChargePoint) {
    await chargerStore.createTariffForChargePoint(chargerStore.selectedChargePoint.id, createTariffForChargePoint.value, true, goTo_ChargePointView);
  }
};
</script>


<style scoped lang="scss">

</style>
