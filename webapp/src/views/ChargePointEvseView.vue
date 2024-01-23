<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full p-2 sm:p-5 flex flex-col justify-between">
      <charge-point-c-new :charge-point="evChargePointEvseStore.chargePoint as ChargePoint" @next="goToAmountSelector" v-if="pageState==State.INIT"/>
      <AmountSelector v-if="pageState==State.AMOUNT_SELECTOR" @next="goToProvideEmail" :tariff="selectedTariff" @back="goToPointSelector"/>
      <ProvideEmail v-if="pageState==State.PROVIDE_EMAIL" @onEmilProvided="emilProvided" :price="selectedPrice" :tariff="selectedTariff" @back="goToAmountSelector"></ProvideEmail>
      <CheckEmail v-if="pageState==State.CHECK_EMAIL" :provided-email="providedEmail" @back="goToProvideEmail"></CheckEmail>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, PropType, ref} from "vue";
import {useRouter} from "vue-router";
import ChargePointCNew from "@/components/ChargePointC-New.vue";
import {ChargePoint, ChargePointStatusType} from "@/models/chargePoint";
import {useEvChargePointEvseStore} from "@/store/evChargePointEvse.store";
import {clearAuthTokens} from "axios-jwt";
import {useToast} from "vue-toastification";
import ProvideEmail from "@/views/chargingPointEvse/ProvideEmail.vue";
import CheckEmail from "@/views/chargingPointEvse/CheckEmail.vue";
import AmountSelector from "@/views/chargingPointEvse/AmountSelector.vue";
import {Tariff} from "@/models/tariff";

const evChargePointEvseStore = useEvChargePointEvseStore();
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
    type: Object as PropType<Array<string>>,
    required: false
  },
});

const pageState = ref(State.NONE);
const providedEmail = ref('');
const selectedTariff = ref<Tariff>({} as Tariff);
const selectedPrice = ref<number>(0);

onMounted(() => {
  if (evChargePointEvseStore.getChargePointEvseUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}});
  } else {
    clearAuthTokens();
    evChargePointEvseStore.fetchChargePointConnectorAll(true, () => {
      pageState.value = State.INIT;
    });
  }
});

const showButton_Next = computed(() => {
  return evChargePointEvseStore.chargePoint && (evChargePointEvseStore.chargePoint.status == ChargePointStatusType.AVAILABLE || evChargePointEvseStore.chargePoint.status == ChargePointStatusType.PREPARING);
});

function goToPointSelector() {
  console.log("next step -> goToStart");
  // router.push('/ev/startCharging');
  pageState.value = State.INIT;
}

function goToProvideEmail(price?: number) {
  console.log("next step -> goToProvideEmail");
  if (price) selectedPrice.value = price;
  // router.push('/ev/startCharging');
  pageState.value = State.PROVIDE_EMAIL;
}

function goToAmountSelector(tariff?: Tariff) {
  console.log("next step -> goToAmountSelector");
  if (tariff) {
    selectedTariff.value = tariff;
  }
  // router.push('/ev/startCharging');
  pageState.value = State.AMOUNT_SELECTOR;
}

function emilProvided(email: string) {
  console.log("next step -> goToCheckEmail");
  if (email) {
    providedEmail.value = email;
    pageState.value = State.CHECK_EMAIL;
    evChargePointEvseStore.prepareSession(email, String(selectedPrice.value), selectedTariff.value.currency, true, onSuccessPrepareSession);
    console.log("send request to backend -> start charging");
  }
}

function onSuccessPrepareSession() {
  toast.success("We send email to you");
}

</script>

<style scoped lang="scss">
</style>
