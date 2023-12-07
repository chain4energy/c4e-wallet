<template>
  <div v-if="pageState==State.INIT">
    <charge-point-c-new :charge-point="evChargePointConnectorStore.chargePoint as ChargePoint"/>
    <Button v-if="showButton_Next" @click="goToProvideEmail()">Next</Button>
  </div>
  <ProvideEmail v-if="pageState==State.PROVIDE_EMAIL" @onEmilProvided="emilProvided"></ProvideEmail>
  <CheckEmail v-if="pageState==State.CHECK_EMAIL" :provided-email="providedEmail"></CheckEmail>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import ChargePointCNew from "@/ev/components/ChargePointC-New.vue";
import {ChargePoint, ChargePointStatusType} from "@/ev/models/chargePoint";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";
import {clearAuthTokens} from "axios-jwt";
import {useToast} from "vue-toastification";
import ProvideEmail from "@/ev/views/chargingPointConnector/ProvideEmail.vue";
import CheckEmail from "@/ev/views/chargingPointConnector/CheckEmail.vue";

const evChargePointConnectorStore = useEvChargePointConnectorStore();
const router = useRouter();
const toast = useToast();

enum State {
  NONE,
  INIT,
  PROVIDE_EMAIL,
  CHECK_EMAIL
}

const props = defineProps({
  context: {
    type: String,
    required: false
  },
});

const pageState = ref(State.NONE)
const providedEmail= ref('');

onMounted(() => {
  if (evChargePointConnectorStore.getChargePointConnectorUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}})
  } else {
    clearAuthTokens();
    evChargePointConnectorStore.fetchChargePointConnectorAll(true, ()=>{pageState.value = State.INIT});
  }
});

const showButton_Next = computed(() => {
  return evChargePointConnectorStore.chargePoint && (evChargePointConnectorStore.chargePoint.status == ChargePointStatusType.AVAILABLE || evChargePointConnectorStore.chargePoint.status == ChargePointStatusType.PREPARING)
});

function goToProvideEmail() {
  console.log("next step -> goToProvideEmail")
  // router.push('/ev/startCharging');
  pageState.value = State.PROVIDE_EMAIL;
}

function emilProvided(email:string){
  console.log("next step -> goToCheckEmail")
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

</script>

<style scoped lang="scss">
</style>
