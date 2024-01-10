<template>
  <Checkbox v-model="useInterval" :binary="true"/>
  <label for="useInterval" class="ml-2"> turn on interval </label>
  <ChargingSessionInitPayment v-if="chargingSessionStore.getSessionInfo?.state == SessionState.CREATED" @initPayment="initPayment" amount="50" currency="PLN"></ChargingSessionInitPayment>
  <ChargingSessionWaitForPayment v-if="chargingSessionStore.getSessionInfo?.state == SessionState.WAIT_FOR_RESERVATION_CONFIRMATION"
                                 :sessionInfo="chargingSessionStore.getSessionInfo"></ChargingSessionWaitForPayment>
  <ChargingSessionWaiteForConnectAndStart
    v-if="chargingSessionStore.getSessionInfo?.state == SessionState.WAIT_FOR_PLUG_INSERT
    || chargingSessionStore.getSessionInfo?.state == SessionState.READY_TO_START"
    :sessionInfo="chargingSessionStore.getSessionInfo"/>
  <ChargingSessionProgress v-if="chargingSessionStore.getSessionInfo?.state == SessionState.CHARGING
  || chargingSessionStore.getSessionInfo?.state == SessionState.STOPPING
  || chargingSessionStore.getSessionInfo?.state == SessionState.WAIT_FOR_STARTED"
                           :sessionInfo="chargingSessionStore.getSessionInfo"
                           @stop-charging="stopCharging"/>
  <ChargingSessionSummary v-if="chargingSessionStore.getSessionInfo?.state == SessionState.FINAL
  || chargingSessionStore.getSessionInfo?.state == SessionState.FINALIZE_ACCOUNTING" :sessionInfo="chargingSessionStore.getSessionInfo"/>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, onUnmounted, PropType, ref, watch} from "vue";
import ChargingSessionWaiteForConnectAndStart from "@/views/chargingSession/ChargingSessionWaiteForConnectAndStart.vue";
import { SessionState} from "@/models/sessionInfo";
import ChargingSessionProgress from "@/views/chargingSession/ChargingSessionProgress.vue";
import ChargingSessionSummary from "@/views/chargingSession/ChargingSessionSummary.vue";
import Checkbox from "primevue/checkbox";
import {useEvChargingSessionStore} from "@/store/evChargingSession.store";
import {useEvChargePointConnectorStore} from "@/store/evChargePointConnector.store";
import {getChargePointConnectorUrlFromChargerPointConnectorSessionUrl} from "@/services/utils";
import {clearAuthTokens} from "axios-jwt/src/tokensUtils";
import ChargingSessionInitPayment from "@/views/chargingSession/ChargingSessionInitPayment.vue";
import ChargingSessionWaitForPayment from "@/views/chargingSession/ChargingSessionWaitForPayment.vue";
import { useSessionStorage } from "@vueuse/core";

const router = useRouter();
const chargingSessionStore = useEvChargingSessionStore();
const chargePointConnectorStore = useEvChargePointConnectorStore();
const useInterval = ref(true);

let interval = 0;

const props = defineProps({
  context: {
    type: Object as PropType<Array<string>> ,
    required: false
  },
});

onMounted(() => {
  if (chargingSessionStore.getChargingSessionUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}});
  } else {
    //check if tokens are ok
    clearAuthTokens();
    chargingSessionStore.loginWithResource(true, onSuccessLoginToSession);
  }
});

onUnmounted(() => {
  stopInterval();
});

watch(useInterval, (newValue, oldValue) => {
  if (newValue) {
    startInterval();
  } else {
    stopInterval();
  }
});
function onSuccessLoginToSession() {
  chargePointConnectorStore.chargePointConnectorUrl = getChargePointConnectorUrlFromChargerPointConnectorSessionUrl(chargingSessionStore.getChargingSessionUrl);
  chargePointConnectorStore.fetchChargePointConnectorAll();
  chargingSessionStore.fetchSessionInfo().then(()=> {
    if (chargingSessionStore.getSessionInfo?.state == SessionState.FINAL) {
      stopInterval();
    } else {
      startInterval();
    }
  });
}

function startInterval() {
  if (interval == 0) {
    interval = window.setInterval(() => {
      chargingSessionStore.fetchSessionInfo(false).then(
        () => {
          if (chargingSessionStore.getSessionInfo?.state == SessionState.FINAL) {
            stopInterval();
          }
        }
      );
    }, 1000);
  } else {
    console.log("startInterval interval != 0");
  }
}

function stopInterval(){
  clearInterval(interval);
  interval= 0;
  useInterval.value = false;
}



function stopCharging() {
  chargingSessionStore.stopCharging();
}

function initPayment(){
  const context = useSessionStorage("context", props.context );
  context.value = props.context;
  stopInterval();
  chargingSessionStore.initPayment({ amount:'500', currency: 'PLN'}, true, (paymentUrl)=>{
    console.log("Redirect to " + paymentUrl);
    window.location.href=paymentUrl;
  });
}

</script>

<style scoped lang="scss">

</style>
