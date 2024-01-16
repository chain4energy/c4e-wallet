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
  <div v-else>
    <h1>Current session proggers</h1>
    <p>State {{props.sessionInfo.state}}</p>
    <div v-if="props.sessionInfo?.state!=SessionState.WAIT_FOR_STARTED">
      <p>Energia pobrana {{props.sessionInfo.energyConsumed}} kWh</p>
      <p>Aktualna wartość {{props.sessionInfo.cost}} PLN</p>
      <p>Czas rozpoczęcia ładowania {{props.sessionInfo.startTime}}</p>
    </div>
    <Button v-if="props.sessionInfo?.state==SessionState.CHARGING" @click="stopChargingSession()">Stop charging</Button>
    <Button @click="startChargingSession()" :disabled="props.sessionInfo?.state!=SessionState.READY_TO_START ">Start charging</Button>

    <p v-if="props.sessionInfo?.state==SessionState.STOPPING">Czekanie na zatrzymanie ładowania</p>
    <p v-if="props.sessionInfo?.state==SessionState.WAIT_FOR_STARTED">Czekanie na rozpoczęcie ładowania</p>
  </div>
</template>

<script setup lang="ts">

import {SessionInfo, SessionState} from "@/models/sessionInfo";
import {PropType} from "vue/dist/vue";
import {useEvChargingSessionStore} from "@/store/evChargingSession.store";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";
import ChargerPluggedSVG from "@/components/svg/ChargerPluggedSVG.vue"
import IconComponent from "@/components/features/IconComponent.vue";
import TickSVG from "@/components/svg/TickSVG.vue";
import {boolean} from "yup";
import {onMounted, ref} from "vue";

const emit = defineEmits(['stopCharging']);
const chargingSessionStore = useEvChargingSessionStore();


const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
function stopChargingSession() {
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

const timer = ref<number>(3);

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

</script>

<style scoped lang="scss">

</style>
