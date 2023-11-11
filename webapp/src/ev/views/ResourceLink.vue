<template>

  <chargerInfoC :charger-info="chargerInfo">
  </chargerInfoC>
  <priceC :price-info="priceInfo">
  </priceC>

  <Button>
    Next
  </Button>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import {onMounted} from "vue";
import PriceC from "@/ev/components/PriceC.vue";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {ChargerInfo, ChargerStatus, ConnectorType, PriceInfo} from "@/models/ev/chargerInfo";
import {useEvStore} from "@/store/ev.store";

const route = useRoute()
const evStore = useEvStore();

onMounted(async () => {
  console.log(route.params.context);
  const pathToDecoder = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + pathToDecoder);
  await evStore.getEvAuthResource(pathToDecoder)
  await evStore.loginWithResource()

})

function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

const chargerInfo: ChargerInfo = {
  location: '',
  name: '',
  connectorType: ConnectorType.TYPE2,
  availability: "asdasd",
  status: ChargerStatus.AVAILABLE
}

const priceInfo: PriceInfo = {
  pricePerKwh: '123'
}

// function createSession() {
//   const evServiceApi = apiFactory.evServiceApi();
//   const request:LoginAuthRequest = {accessCode: accessCode.value, login: login.value, resource:chargerId.value };
//    let promise = evServiceApi.evLoginEmailAndLoginData(request, true);
//   promise.then(jwt=>{
//     console.log(jwt);
//   })
// }


</script>

<style scoped lang="scss">

</style>
