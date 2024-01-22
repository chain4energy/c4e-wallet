<template>
  <div class="w-full h-full flex items-center justify-center relative">
    <button @click="hide=!hide" class="border-1 bg-gray-200 z-20 absolute top-0 left-0">DEV - Details</button>
    <div v-if="!chargeStore.selectedChargePoint">
      <h1>No selected charge point</h1>
    </div>
    <div v-else class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full max-h-full p-2 sm:p-5 flex flex-col justify-between items-center">
      <div class="w-full">
        <BackCloseBar/>
      </div>
      <ChargerTypeDetails :charger-details="chargerDetails" class="w-3/4 mx-auto"/>
      <div v-if="connector?.url" >
        <h3 class="font-[Audiowide] mt-3 text-2xl sm:text-3xl w-full text-center">{{ chargeStore.getSelectedChargePoint.name }}</h3>
        <a :href="connector.url" class="hover:bg-lime-600/50 transition block p-3 rounded-xl">
          <QrcodeVue :value="connector.url" size="200" :render-as="'svg'" />
        </a>
        <!--          <img-->
        <!--            class="qrcode__image"-->
        <!--            src="@/assets/svg/C4E.svg"-->
        <!--            alt="C4E logo"-->
        <!--          />-->
      </div>
      <div class="text-center flex flex-inline justify-center items-center" v-if="tariff">
        <span class="font-[SevenSegment] text-[70px] text-lime-600">{{ Number(tariff.unitCost).toFixed(2) }}</span>
        <p class="font-[Audiowide] ml-2 mt-2 text-2xl">{{tariff.currency}}/{{tariff.unit}}</p>
      </div>
      <div v-if="hide">
        <h3>Status: {{ chargeStore.selectedChargePoint.status }}</h3>
        <h3>Integration type: {{ chargeStore.selectedChargePoint.integrationType }}</h3>
        <h3>Charge point id: {{ chargeStore.selectedChargePoint.id }}</h3>
        <h3>Connectors number: {{ chargeStore.selectedChargePoint.chargePointConnectors?.length }}</h3>
        <Button @click="deleteChargePoint(chargeStore.selectedChargePoint.id)">Delete</Button>
        <Button @click="changeChargePointActiveState()">
          <span v-if="chargeStore.selectedChargePoint.active">
            Disable
          </span>
          <span v-if="!chargeStore.selectedChargePoint.active">
            Enable
          </span>
        </Button>
        <div v-for="connector in chargeStore.selectedChargePoint.chargePointConnectors" :key="connector.name">
          <ChargePointConnectorC :cp-id="chargeStore.selectedChargePoint.id" :chargePointConnector="connector"/>
        </div>
        <TariffC :tariff="currentTariff" v-if="currentTariff" tg-id=""/>
      </div>
      <div class="w-3/4 flex flex-inline gap-4 justify-center">
        <Button class="min-w-[50px] rounded-xl py-3 text-center text-lg font-semibold text-white flex justify-center bg-lime-600 shadow-lg shadow-gray-500">
          <IconComponent name="FilePenLine"/>
        </Button>
        <div>
          <NextButton text="Download QR"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/store/owner.store";
import {computed, onMounted, ref} from "vue";
import TariffC from "@/components/TariffC.vue";
import ChargePointConnectorC from "@/components/ChargePointConnectorC.vue";
import {goTo_EvOwnerDashboardView} from "@/router/goToRoute";
import ChargerTypeDetails from "@/components/ChargerTypeDetails.vue";
import {ChargePointDict} from "@/models/chargePointDict";
import BackCloseBar from "@/components/BackCloseBar.vue";
import QrcodeVue from "qrcode.vue";
import {ChargePointConnector} from "@/models/chargePointConnector";
import {Tariff} from "@/models/tariff";
import NextButton from "@/components/NextButton.vue";
import IconComponent from "@/components/features/IconComponent.vue";

const chargeStore = useOwnerStore();
const hide = ref<boolean>(false);
const currency = ref<string>('PLN');

const tariff = computed<Tariff | undefined>(() => {
  return chargeStore.getSelectedChargePoint?.tariffGroup.tariffs.find(t => t.currency === currency.value);
})

const currentTariff = computed(() => {
  const cpId = chargeStore.getSelectedChargePoint?.id;
  return cpId ? chargeStore.getTariffForChargePoint(cpId) : null;
});

const changeChargePointActiveState = () => {
  if (!chargeStore.selectedChargePoint) return console.error("No charge point selected");
  const chargePointChangeActiveState = {
    active: !chargeStore.selectedChargePoint.active
  };
  chargeStore.changeChargePointActiveState(chargeStore.selectedChargePoint.id, chargePointChangeActiveState);
};

const deleteChargePoint = (id: string | undefined) => {
  if (id) {
    chargeStore.deleteChargePoint(id, true, goTo_EvOwnerDashboardView);
  }
};

const chargerDetails = computed<ChargePointDict>(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === chargeStore.getSelectedChargePoint?.chargePointDictId);
});

const connector = computed<ChargePointConnector | undefined>(() => {
  return chargeStore.getSelectedChargePoint?.chargePointConnectors?.[0];
});

onMounted(() => {
  if (connector.value && !connector.value?.url) {
    chargeStore.getQrCode(connector.value.chargePointId, connector.value.identifier);
  }
});
</script>

<style scoped lang="scss">
/* Your styles here */
</style>
