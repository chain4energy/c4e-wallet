<template>
  <div v-if="pageState==State.INIT" class="w-full h-full">
    <charge-point-c-new :charge-point="evChargePointConnectorStore.chargePoint as ChargePoint" @next="goToAmountSelector"/>
  </div>
  <AmountSelector v-if="pageState==State.AMOUNT_SELECTOR" @next="goToProvideEmail" :tariff="selectedTariff" @back="goToPointSelector"/>
  <ProvideEmail v-if="pageState==State.PROVIDE_EMAIL" @onEmilProvided="emilProvided"></ProvideEmail>
  <CheckEmail v-if="pageState==State.CHECK_EMAIL" :provided-email="providedEmail"></CheckEmail>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref} from "vue";
import {useRouter} from "vue-router";
import ChargePointCNew from "@/components/ChargePointC-New.vue";
import {ChargePoint, ChargePointStatusType} from "@/models/chargePoint";
import {useEvChargePointConnectorStore} from "@/store/evChargePointConnector.store";
import {clearAuthTokens} from "axios-jwt";
import {useToast} from "vue-toastification";
import ProvideEmail from "@/views/chargingPointConnector/ProvideEmail.vue";
import CheckEmail from "@/views/chargingPointConnector/CheckEmail.vue";
import AmountSelector from "@/views/chargingPointConnector/AmountSelector.vue";
import {Tariff} from "@/models/tariff";

const evChargePointConnectorStore = useEvChargePointConnectorStore();
const router = useRouter();
const toast = useToast();

enum State {
  NONE,
  INIT,
  AMOUNT_SELECTOR,
  PROVIDE_EMAIL,
  CHECK_EMAIL
}

const props = defineProps({
  context: {
    type:  Object as PropType<Array<string>> ,
    required: false
  },
});

const pageState = ref(State.NONE);
const providedEmail= ref('');

onMounted(() => {
  if (evChargePointConnectorStore.getChargePointConnectorUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}});
  } else {
    clearAuthTokens();
    evChargePointConnectorStore.fetchChargePointConnectorAll(true, ()=>{pageState.value = State.INIT;});
  }
});

const showButton_Next = computed(() => {
  return evChargePointConnectorStore.chargePoint && (evChargePointConnectorStore.chargePoint.status == ChargePointStatusType.AVAILABLE || evChargePointConnectorStore.chargePoint.status == ChargePointStatusType.PREPARING);
});

function goToPointSelector() {
  console.log("next step -> goToStart");
  // router.push('/ev/startCharging');
  pageState.value = State.INIT;
}

function goToProvideEmail() {
  console.log("next step -> goToProvideEmail");
  // router.push('/ev/startCharging');
  pageState.value = State.PROVIDE_EMAIL;
}

function goToAmountSelector(tariff: Tariff) {
  console.log("next step -> goToAmountSelector");
  selectedTariff.value = tariff;
  // router.push('/ev/startCharging');
  pageState.value = State.AMOUNT_SELECTOR;
}

function emilProvided(email:string){
  console.log("next step -> goToCheckEmail");
  if (email) {
    providedEmail.value = email;
    pageState.value = State.CHECK_EMAIL;
    evChargePointConnectorStore.prepareSession(email, true, onSuccessPrepareSession, onErrorPrepareSession);
    console.log("send request to backend -> start charging");
  }
}

function onSuccessPrepareSession(){
  toast.success("We send email to you");
    //
}

function onErrorPrepareSession(){
  //
}

const selectedTariff = ref<Tariff>({} as Tariff);

</script>

<style scoped lang="scss">
</style>
