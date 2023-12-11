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
  <ChargingSessionSummary v-if="chargingSessionStore.getSessionInfo?.state == SessionState.FINAL" :sessionInfo="chargingSessionStore.getSessionInfo"/>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, onUnmounted, ref, watch} from "vue";
import ChargingSessionWaiteForConnectAndStart from "@/ev/views/chargingSession/ChargingSessionWaiteForConnectAndStart.vue";
import {SessionState} from "@/ev/models/sessionInfo";
import ChargingSessionProgress from "@/ev/views/chargingSession/ChargingSessionProgress.vue";
import ChargingSessionSummary from "@/ev/views/chargingSession/ChargingSessionSummary.vue";
import Checkbox from "primevue/checkbox";
import ChoosePaymentMethod from "@/ev/views/ChoosePaymentMethod.vue";
import {useEvChargingSessionStore} from "@/ev/store/evChargingSession.store";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";
import {getChargePointConnectorUrlFromChargerPointConnectorSessionUrl} from "@/ev/services/utils";
import {clearAuthTokens} from "axios-jwt/src/tokensUtils";
import ChargingSessionInitPayment from "@/ev/views/chargingSession/ChargingSessionInitPayment.vue";
import ChargingSessionWaitForPayment from "@/ev/views/chargingSession/ChargingSessionWaitForPayment.vue";

const router = useRouter()
const chargingSessionStore = useEvChargingSessionStore();
const chargePointConnectorStore = useEvChargePointConnectorStore();
const useInterval = ref(true);

let interval: any;

const props = defineProps({
  context: {
    type: String,
    required: false
  },
});

onMounted(() => {
  if (chargingSessionStore.getChargingSessionUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}})
  } else {
    clearAuthTokens();
    chargingSessionStore.loginWithResource(true, onSuccessLoginToSession)
  }
});

function onSuccessLoginToSession() {
  chargePointConnectorStore.chargePointConnectorUrl = getChargePointConnectorUrlFromChargerPointConnectorSessionUrl(chargingSessionStore.getChargingSessionUrl);
  chargePointConnectorStore.fetchChargePointConnectorAll();
  chargingSessionStore.fetchSessionInfo();
  if (chargingSessionStore.getSessionInfo?.state != SessionState.FINAL) {
    startInterval();
  }
}

function startInterval() {
  interval = setInterval(() => {
    chargingSessionStore.fetchSessionInfo(false)
  }, 1000);
}

watch(useInterval, (newValue, oldValue) => {
  if (newValue) {
    startInterval();
  } else {
    clearInterval(interval);
  }
})

onUnmounted(() => {
  clearInterval(interval);
})

function stopCharging() {
  chargingSessionStore.stopCharging();
}

function initPayment(){
  chargingSessionStore.initPayment({ amount:'500', currency: 'PLN'}, true, (paymentUrl)=>{
    console.log("Redirect to " + paymentUrl);
    window.location.href=paymentUrl;
  })
}

</script>

<style scoped lang="scss">

</style>
