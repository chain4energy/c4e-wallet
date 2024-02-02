<template>
  <div class="flex flex-inline justify-between items-center">
    <div class="w-1/4">
      <img v-svg-inline :src="require('@/assets/svg/C4ELogo.svg')" alt="C4ELogo.svg" />
    </div>
    <p class="font-[Audiowide]">{{ chargePoint?.name }}</p>
  </div>
  <div class="w-full sm:w-[70%] mx-auto">
    <CarSVG charger/>
    <h3 class="font-[Audiowide] text-center w-full mt-3">Kolorowa 12, 37-123 Kraków</h3>
  </div>
  <div class="w-full flex flex-inline justify-evenly">
    <div class="w-[30%] text-center flex flex-col justify-between">
      <div class="flex flex-1 items-center justify-center">
        <Type2SVG class="max-w-[60px] mx-auto pb-5"/>
      </div>
      <p class="font-[Audiowide] -mt-3 text-xl">{{charger?.maxChargingPower}} kW</p>
    </div>
    <div class="text-center flex flex-col justify-between">
      <div class="flex flex-1 items-center justify-center">
        <span class="font-[SevenSegment] text-[90px] -mt-5 text-lime-600">{{ Number(selectedTariff.unitCost).toFixed(2) }}</span>
      </div>
      <p class="font-[Audiowide] -mt-3 text-xl">{{selectedTariff.currency}}/{{selectedTariff.unit}}</p>
    </div>
  </div>
  <div class="flex flex-col w-full mx-auto my-2">
    <LangSelector/>
    <Dropdown v-model="selectedCurrency" :options="currencies" optionLabel="name" placeholder="Select currency" class="w-full border-b-2" :pt="{item: ({ props, state, context }) => ({
                          class: context.selected ? 'bg-lime-600/50 text-inherit' : context.focused ? 'bg-lime-600/30' : undefined})}">
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex justify-between">
          <span class="flex flex-inline">
  <!--               <IconComponent name="Coins" class="text-lime-600 mr-2"/> -->
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
  <InlineMessage severity="warn" v-if="status !== AvailabilityEnum.AVAILABLE">{{$t('HEADERS.CHARGER_UNAVAILABLE')}}</InlineMessage>
  <NextButton text="Start" icon="PlayCircle" @clicked="emit('next', selectedTariff)" v-else/>
</template>

<script setup lang="ts">

import {ChargePoint} from "@/models/chargePoint";
import CarSVG from "@/components/svg/CarSVG.vue";
import {computed, onMounted, ref} from "vue";
import Type2SVG from "@/components/svg/Type2SVG.vue";
import {Tariff} from "@/models/tariff";
import {useOwnerStore} from "@/store/owner.store";
import NextButton from "@/components/NextButton.vue";
import LangSelector from "@/components/features/LangSelector.vue";
import InlineMessage from "primevue/inlinemessage";
import {AvailabilityEnum, getAvailability} from "@/utils/getAvailability";
import {useEvStore} from "@/store/ev.store";

const emit = defineEmits(['next']);
const props = defineProps({
    chargePoint: {
      type: Object as () => ChargePoint,
      required: true
    }
  }
);
const status = ref<AvailabilityEnum>();

onMounted(() => {
  useOwnerStore().fetchChargePointDicts();
  useEvStore().fetchConnectorLiveStatus(props.chargePoint?.chargePointEvses[0]?.url).then(r => {
    status.value = getAvailability(r);
  });
});

const currencies = computed(() => {
  return props.chargePoint?.tariffGroup.tariffs.map(el => el.currency);
});

const selectedCurrency = ref(currencies.value[0]);

const selectedTariff = computed((): Tariff => {
  return props.chargePoint?.tariffGroup.tariffs?.find(el => el.currency === selectedCurrency.value);
});

const charger = computed(() => {
  return useOwnerStore().getChargePointDicts?.find(el => el.id === props.chargePoint?.chargePointDictId);
});

</script>

<style scoped lang="scss">

</style>
