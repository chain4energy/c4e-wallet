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
import {RouteParams, useRoute} from 'vue-router'
import {onMounted, ref} from "vue";
import apiFactory from "@/api/factory.api";
import {LoginAuthRequest} from "@/models/ev/evServiceCommons";
import PriceC from "@/ev/components/PriceC.vue";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {ChargerInfo, ChargerStatus, ConnectorType, PriceInfo} from "@/models/ev/chargerInfo";

const route = useRoute()

// const chargerId = ref();
// const login = ref();
// const accessCode = ref();

onMounted(()=>{

  console.log( route.params.context);

  //TODO: decode link
  const pathToDecoder = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + pathToDecoder);
  // apiFactory.evServiceApi().evDecodeLink(pathToDecoder, true).then(response=>{
  //   return response;
  // todo: get charger info
  // });
})

function createLinkFromPathParams(params: string | string[]) : string{
  if(Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

const chargerInfo : ChargerInfo= {
  location:'',
  name:'',
  connectorType:ConnectorType.TYPE2,
  availability:"asdasd",
  status:  ChargerStatus.AVAILABLE
}

const priceInfo : PriceInfo= {
  pricePerKwh : '123'
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
