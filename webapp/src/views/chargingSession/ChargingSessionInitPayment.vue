<template>
  <span class="font-[Audiowide] text-lime-600 text-4xl text-center">{{chargePoint?.name}}</span>
  <div class="w-full flex flex-inline justify-evenly">
    <div class="w-[30%] text-center flex flex-col justify-between">
      <Type2SVG class="max-w-[100px] mx-auto"/>
      <p class="font-[Audiowide] mt-2 text-xl">{{charger?.maxChargingPower}} kW</p>
    </div>
    <div class="text-center flex flex-col justify-between">
      <span class="font-[SevenSegment] text-[90px] -mt-5 text-lime-600">{{ Number(tariff?.unitCost).toFixed(2) }}</span>
      <p class="font-[Audiowide] mt-2 text-xl">{{tariff?.currency}}/{{tariff?.unit}}</p>
    </div>
  </div>
  <div class="flex flex-col items-center">
    <p class="mb-5">{{$t('HEADERS.PAYMENT_NOTE')}}</p>
    <div class="w-[95%] sm:w-[80%] mx-auto my-2 p-2 font-semibold flex flex-inline justify-center items-center text-xl"
    >
      <div class="w-[150px] text-right">
        <span class="font-[SevenSegment] text-[80px] mr-1 font-normal">{{amount}}</span>
        <span>{{tariff?.currency}}</span>
      </div>
      <div class="border-t-2 border-black w-[30px] h-[1px] mx-4 transition-all duration-300"/>
      <div class="w-[150px] text-left">
        <span class="font-[SevenSegment] text-[80px] mr-1 font-normal">{{ (amount / Number(tariff?.unitCost)).toFixed(1) }}</span>
        <span>{{tariff?.unit}}</span>
      </div>
    </div>
  </div>
  <NextButton :text="$t('COMMON.PAY')" icon='Coins' @click="initPayment()"/>
</template>

<script setup lang="ts">
import Type2SVG from "@/components/svg/Type2SVG.vue";
import {computed, onBeforeMount, onMounted} from "vue";
import {useOwnerStore} from "@/store/owner.store";
import {useEvChargePointEvseStore} from "@/store/evChargePointEvse.store";
import {Tariff} from "@/models/tariff";
import {ChargePointDict} from "@/models/chargePointDict";
import {ChargePoint} from "@/models/chargePoint";
import NextButton from "@/components/NextButton.vue";

const emit = defineEmits(['initPayment']);

const props = defineProps({
  amount: {
    type: String ,
    required: true
  },
  currency: {
    type: String ,
    required: true
  },
});
function initPayment() {
  emit('initPayment');
}

onBeforeMount(async () => {
  await useOwnerStore().fetchChargePointDicts(true);

});

const chargePoint = computed<ChargePoint | undefined>(() => {
  return useEvChargePointEvseStore().getChargePoint;
});

const charger = computed<ChargePointDict>(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === chargePoint.value?.chargePointDictId);
});

const tariff = computed<Tariff>(() => {
  return chargePoint.value?.tariffGroup.tariffs.find(el => el.currency === props.currency);
});

</script>

<style scoped lang="scss">

</style>
