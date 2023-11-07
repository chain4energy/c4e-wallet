<template>
  <div class="about">
    <h1>Charger Id:{{chargerId}}</h1>
  </div>
  <div>
    <p>Email:</p>
    <InputText v-model="login" type="text"/>
  </div>
  <div>
    <p>AccessCode:</p>
    <InputText v-model="accessCode" type="text"/>
  </div>
  <div>
    <Button
      @click="createSession"
      class="airDropTotal-btn">
      {{ $t('INFO_PAGE.BUTTON') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {onMounted, ref} from "vue";
import apiFactory from "@/api/factory.api";
import {LoginAuthRequest} from "@/models/evServiceCommons";

const route = useRoute()

const chargerId = ref();
const login = ref();
const accessCode = ref();

onMounted(()=>{

  console.log( route.params.chargerId);
  console.log( route.query.tot);
  if(route.params.chargerId) {
    chargerId.value = route.params.chargerId;
  } else {
    //TODO: chargerId not found
  }
})

function createSession() {
  const evServiceApi = apiFactory.evServiceApi();
  const request:LoginAuthRequest = {accessCode: accessCode.value, login: login.value, resource:chargerId.value };
   let promise = evServiceApi.evLoginEmailAndLoginData(request, true);
  promise.then(jwt=>{
    console.log(jwt);
  })
}



</script>

<style scoped lang="scss">

</style>
