<template>
  <Card v-if="hide">
    <template #title>
      <h3>Name: {{ chargePoint?.name }}</h3>
    </template>

    <template #content>
      <div style="background: green; color: white">
        <p>Status: {{ chargePoint?.status }}</p>
        <p>Integration type: {{ chargePoint?.integrationType }}</p>
        <p>Charge point id: {{ chargePoint?.id }}</p>
        <p>Connectors number: {{ chargePoint?.chargePointConnectors?.length }}</p>
        <div v-for="connector in chargePoint?.chargePointConnectors" :key="connector.id">
          <charge-point-connector-c-new :charge-point-connector="connector"/>
        </div>
        <div v-if="chargePoint?.tariffGroup">
          <tarrif-group-c-new :tariff-group="chargePoint.tariffGroup"/>
        </div>
      </div>
    </template>
  </Card>
  <button class="absolute top-0 left-0 m-4 border-2 bg-gray-100" @click = "hide = !hide">Hide/Show</button>

  <div class="w-full h-full flex items-center justify-center">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] h-full p-2 sm:p-5 flex flex-col justify-between">
      <div class="flex flex-inline justify-between items-center">
        <div class="w-1/4">
          <C4ELogoSVG/>
        </div>
        <p class="font-[Audiowide]">{{ chargePoint?.name }}</p>
      </div>
      <div class="w-full sm:w-[70%] mx-auto">
        <CarSVG/>
      </div>
      <div class="w-full flex flex-inline justify-evenly">
        <div class="w-[30%] text-center flex flex-col justify-between">
          <Type2SVG class="max-w-[100px] mx-auto"/>
          <p class="font-[Audiowide] mt-2 text-xl">{{charger?.maxChargingPower}} kW</p>
        </div>
        <div class="text-center flex flex-col justify-between">
          <span class="font-[SevenSegment] text-[90px] -mt-5 text-lime-600">{{ Number(selectedTariff.unitCost).toFixed(2) }}</span>
          <p class="font-[Audiowide] mt-2 text-xl">{{selectedTariff.currency}}/{{selectedTariff.unit}}</p>

        </div>
      </div>
      <div class="flex flex-col w-full mx-auto">
        <Dropdown v-model="selectedLocale" :options="locales" optionLabel="name" placeholder="Select language" class="w-full border-b-2 my-4" @change="setLocale">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex justify-between">
              <span class="flex flex-inline"><IconComponent name="Globe" class="text-lime-600 mr-2"/> {{$t('COMMON.LANGUAGE')}}</span>
              <span>{{locales.find(el => el.file === slotProps.value).name}}</span>
            </div>
            <span v-else>
            {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center text-right justify-end">
              <div>{{ slotProps.option.name }}</div>
              <div class="ml-2">
                <country-flag :country='slotProps.option.flagCode'/>
              </div>
            </div>
          </template>
        </Dropdown>
        <Dropdown v-model="selectedCurrency" :options="currencies" optionLabel="name" placeholder="Select currency" class="w-full border-b-2 my-4">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex justify-between">
              <span class="flex flex-inline"><IconComponent name="Coins" class="text-lime-600 mr-2"/> {{$t('COMMON.CURRENCY')}}</span>
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
      <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center" @click="emit('next', selectedTariff)"><IconComponent name="PlayCircle" class="mr-3"/>Start</Button>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ChargePoint} from "@/models/chargePoint";
import ChargePointConnectorCNew from "@/components/ChargePointConnectorC-New.vue";
import TarrifGroupCNew from "@/components/TariffGroupC-New.vue";
import C4ELogoSVG from "@/components/svg/C4ELogoSVG.vue";
import CarSVG from "@/components/svg/CarSVG.vue";
import IconComponent from "@/components/features/IconComponent.vue";
import {computed, onMounted, ref} from "vue";
import { getSupportedLocales } from '@/utils/supported-locales';
import { Locale, useI18n } from 'vue-i18n';
import CountryFlag from 'vue-country-flag-next'; // https://www.npmjs.com/package/vue-country-flag-next
import { reactive } from 'vue';
import { changeTitle } from '@/utils/title-changer';
import Type2SVG from "@/components/svg/Type2SVG.vue";
import {Tariff} from "@/models/tariff";
import {useOwnerStore} from "@/store/owner.store";

const locales = reactive(getSupportedLocales());
const dropdown = ref(false);
const i18n = useI18n();

const emit = defineEmits(['next'])

const setLocale = () => {
  if (selectedLocale.value.file) {
    i18n.locale.value = selectedLocale.value.file;
  }
  changeTitle();
};

const props = defineProps({
    chargePoint: {
      type: Object as () => ChargePoint,
      required: true
    }
  }
);

onMounted(() => {
  useOwnerStore().fetchChargePointDicts();
})

const currencies = computed(() => {
  return props.chargePoint?.tariffGroup.tariffs.map(el => el.currency)
});

const selectedCurrency = ref(currencies.value[0])

const selectedLocale = ref(i18n.locale);

const hide = ref<boolean>(false);

const selectedTariff = computed((): Tariff => {
  return props.chargePoint?.tariffGroup.tariffs?.find(el => el.currency === selectedCurrency.value);
});

const charger = computed(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === props.chargePoint?.chargePointDictId);
})

</script>

<style scoped lang="scss">

</style>
