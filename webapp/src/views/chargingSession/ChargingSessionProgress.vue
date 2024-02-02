<template>
  <div v-if="sessionInfo?.state === SessionState.READY_TO_START && timer" class="w-full h-full flex flex-col justify-evenly">
    <div class="flex flex-col items-center">
      <span class="font-[Audiowide] text-lime-600 text-4xl text-center">{{$t('HEADERS.CONNECT')}}</span>
      <span class="font-[Audiowide] text-4xl text-center text-black">{{$t('HEADERS.TO_CAR')}}</span>
    </div>

    <!--  <Button @click="connect()">Connect charger (simulation)</Button>-->
    <!--  <Button @click="startChargingSession()" :disabled="evStore.getSessionInfo?.state!=SessionState.READY_TO_START ">Start charging</Button>-->
    <div class="w-[313px] mx-auto">
      <ChargerPluggedSVG/>
    </div>
    <div class="flex flex-inline items-center justify-center">
      <TickSVG size="50"/>
      <span class="font-[Audiowide] text-2xl ml-4">Connected successfully</span>
    </div>
  </div>
  <div v-else class="w-full h-full flex flex-col justify-evenly items-center">
    <h1 class="font-[Audiowide] text-3xl sm:text-4xl text-center text-black">{{sessionInfo?.state === SessionState.READY_TO_START ? $t('HEADERS.PRESS_START') : $t('HEADERS.CHARGING')}}</h1>
    <CarSVG class="max-w-[450px] min-w-[230px] w-full -ml-10">
      <ChargerSVG :percent="percent" class="absolute w-1/2 bottom-2 -right-8 sm:-right-11"/>
    </CarSVG>
    <div class="w-full flex flex-inline flex-wrap justify-between font-[Audiowide]">
      <span>{{percent.toFixed(0)}}%</span>
      <span>LIMIT {{Number(sessionInfo.reservationAmount).toFixed(0)}} {{sessionInfo.currency}}</span>
      <ProgressBar :value="percent" class="w-full max-h-2" :mode="sessionInfo?.state === SessionState.WAIT_FOR_STARTED ? 'indeterminate' : 'determinate'" :pt="{value: 'bg-lime-600'}">{{}}</ProgressBar>
    </div>
    <div class="flex flex-inline justify-center gap-10 w-full flex-wrap">
      <div class="flex flex-inline items-center min-w-[140px]" v-if="sessionInfo?.chargingStartTime">
        <IconComponent name="Timer" class="mr-4 text-lime-600"/>
        <div class="flex flex-col items-center" :class="sessionInfo?.state === SessionState.WAIT_FOR_STARTED || sessionInfo?.state === SessionState.READY_TO_START ? 'text-gray-400' : ''">
          <span>{{$t('HEADERS.START_TIME')}}</span>
          <span class="font-[Audiowide]">{{new Date(sessionInfo.chargingStartTime).getHours()}}:{{new Date(sessionInfo.chargingStartTime).getMinutes()}}</span>
        </div>
      </div>
      <div class="flex flex-inline items-center min-w-[140px]">
        <IconComponent name="BatteryCharging" class="mr-4 text-lime-600"/>
        <div class="flex flex-col items-center" :class="sessionInfo?.state === SessionState.WAIT_FOR_STARTED || sessionInfo?.state === SessionState.READY_TO_START ? 'text-gray-400' : ''">
          <span>{{$t('HEADERS.ENERGY')}}</span>
          <span class="font-[Audiowide]">{{(Number(sessionInfo.energyWh)/1000).toFixed(1)}} kWh</span>
        </div>
      </div>
      <div class="flex flex-inline items-center min-w-[140px]">
        <IconComponent name="Zap" class="mr-4 text-lime-600"/>
        <div class="flex flex-col items-center" :class="sessionInfo?.state === SessionState.WAIT_FOR_STARTED || sessionInfo?.state === SessionState.READY_TO_START ? 'text-gray-400' : ''">
          <span>{{$t('HEADERS.POWER')}}</span>
          <span class="font-[Audiowide]">{{((Number(sessionInfo.energyWh))/((new Date() - new Date(sessionInfo.chargingStartTime))/3600)).toFixed(1)}} kW</span>
        </div>
      </div>
      <div class="flex flex-inline items-center min-w-[140px]">
        <IconComponent name="Coins" class="mr-4 text-lime-600"/>
        <div class="flex flex-col items-center" :class="sessionInfo?.state === SessionState.WAIT_FOR_STARTED || sessionInfo?.state === SessionState.READY_TO_START ? 'text-gray-400' : ''">
          <span>{{$t('HEADERS.COST')}}</span>
          <span class="font-[Audiowide]">{{(Number(sessionInfo.cost)).toFixed(2)}} {{sessionInfo.currency}}</span>
        </div>
      </div>
    </div>
    <NextButton text="Start charging" icon="Power" @click="startChargingSession()" :disabled="sessionInfo?.state === SessionState.WAIT_FOR_STARTED" v-if="sessionInfo?.state === SessionState.READY_TO_START || sessionInfo?.state === SessionState.WAIT_FOR_STARTED"/>
    <NextButton text="Stop charging" color="bg-red-600" @click="stopChargingSession()" icon="Power" :disabled="sessionInfo.state === SessionState.STOPPING || stopping" v-else/>
  </div>
</template>

<script setup lang="ts">

import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {PropType} from "vue/dist/vue";
import {useEvChargingSessionStore} from "@/store/evChargingSession.store";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import ChargerPluggedSVG from "@/components/svg/ChargerPluggedSVG.vue";
import TickSVG from "@/components/svg/TickSVG.vue";
import {computed, onMounted, ref} from "vue";
import ChargerSVG from "@/components/svg/ChargerSVG.vue";
import CarSVG from "@/components/svg/CarSVG.vue";
import NextButton from "@/components/NextButton.vue";
import ProgressBar from "primevue/progressbar";
import IconComponent from "@/components/features/IconComponent.vue";

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['stopCharging']);

const chargingSessionStore = useEvChargingSessionStore();
const stopping = ref<boolean>(false);
const timer = ref<number>(4);

const percent = computed (() => {
  return (props.sessionInfo?.cost/props.amount * 100);
});

const startTimer = () => {
  const timerInterval = 1000; // 1 second interval

  const countdown = setInterval(() => {
    if (timer.value >= 1) {
      timer.value -= 1;
    } else {
      clearInterval(countdown);
      console.log("Timer reached 0 seconds");
    }
  }, timerInterval);
};
onMounted(startTimer);

function stopChargingSession() {
  stopping.value = true;
  emit('stopCharging');
}

function startChargingSession() {
  chargingSessionStore.startCharging(true, onSuccess, onError);
}
function onSuccess(){
  console.log("onSuccess");
}

function onError(defaultErrorHandler: () => void, error:ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message);
}
</script>

<style scoped lang="scss">

</style>
