<template>
<!--  <div class="card flex justify-content-center">-->
<!--    <div class="flex flex-column gap-3">-->
<!--      <div v-for="category in categories" :key="category.key" class="flex align-items-center">-->
<!--        <RadioButton v-model="chargePointForm.chargePointId" :inputId="category.key" name="dynamic" :value="category.value" />-->
<!--        <label :for="category.key" class="ml-2">{{ category.name }}</label>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <form>-->
<!--    <InputText v-model="qrCodeInfoForm.qrCodeInfoPath" placeholder="QR Code Info Path"/>-->
<!--    <Button label="Get QR Code Info" @click="submitQrCodeInfo()"/>-->
<!--    <Button label="Fetch Connector from QR Code Info Path" @click="fetchConnectorInfo()"/>-->
<!--  </form>-->
<!--  <form style="margin-bottom: 25px;">-->
<!--    <InputText v-model="chargePointForm.chargePointId" placeholder="Charge Point ID"/>-->
<!--    <InputText v-model="chargePointForm.connectorId" placeholder="Connector ID" type="number"/>-->
<!--    <Button @click="submitChargePointInfo()" label="Fetch Charge Point Info"/>-->
<!--  </form>-->

  <chargerInfoC v-if="chargePointInfo" :charge-point-info="chargePointInfo"></chargerInfoC>
  <div >
    <p>Connector live status - {{evStore.connectorStatus}}</p>
  </div>
  <priceC :price-info="priceInfo"></priceC>
  <div v-if="chargePointInfo">
    <Button v-if="chargePointInfo?.status === ChargerStatus.AVAILABLE" @click="next()">
      Next
    </Button>
  </div>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>
<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {computed, onMounted, ref} from "vue";
import PriceC from "@/ev/components/PriceC.vue";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {ChargerStatus, PriceInfo} from "@/ev/models/chargerInfo";
import {useEvStore} from "@/ev/store/ev.store";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";

const errorStr = ref("");

const router = useRouter()
const route = useRoute()
const evStore = useEvStore();

const props = defineProps({
  context: {
    type: String ,
    required: false
  },
});


onMounted(()=>{
  console.log("context!!! -> " + JSON.stringify(props.context ));
  evStore.fetchQrCodeInfo( createLinkFromPathParams(props.context as unknown as string[]), true, fetchChargerPointInfo, undefined);
})

function fetchChargerPointInfo(){
  evStore.fetchChargePointInfo();
  evStore.fetchChargePointConnectorLiveStatus();
}

const selectedCategory = ref('Production');

const categories = ref([
  { name: 'DG - EVGC011221225GK0453', key: 'DG', value: 'EVGC011221225GK0453' },
  { name: 'PB - EVGC011221225GK0508', key: 'M', value: 'EVGC011221225GK0508' }
]);

const chargePointForm = ref({
  chargePointId: 'oko',
  connectorId: '1'
});

const path = computed(() => '/v0.1/charge_point/' + chargePointForm.value.chargePointId + '/connector/1');

const qrCodeInfoForm = ref({
  qrCodeInfoPath:path
});

const chargePointInfo = computed(() => evStore.getChargePointInfo);

const submitChargePointInfo = async () => {
  submitQrCodeInfo();
  await evStore.mockFetchChargePointInfo(chargePointForm.value.chargePointId, parseInt(chargePointForm.value.connectorId), true,()=>{
    console.log("success")}, onError);
};

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

const submitQrCodeInfo = () => {
  // evStore.mockGetQrCodeInfo(qrCodeInfoForm.value.qrCodeInfoPath);
};

const fetchConnectorInfo = async () => {
  await evStore.fetchChargePointInfo();
};

function next(){
  if(chargePointInfo.value?.status === ChargerStatus.AVAILABLE) {
    console.log("next step -> start charging")
    router.push('/ev/startCharging');
  }
}

// async function fetchAllData() {
//   console.log(route.params.context);
//   const qrCodePath = createLinkFromPathParams(route.params.context);
//   console.log("pathToDecoder:" + qrCodePath);
//   // await evStore.getQrCodeInfo(qrCodePath)
//   await fetchConnectorInfo()
// }

function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

const priceInfo: PriceInfo = {
  pricePerKwh: '123'
}

</script>

<style scoped lang="scss">

</style>
