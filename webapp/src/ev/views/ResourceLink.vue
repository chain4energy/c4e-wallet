<template>
  <InputText v-model="pathForm.path" placeholder="Path to decode"/>
  <Button label="Decode path" @click="mockDecodePath()"/>
  <div v-if="evStore.getSessionPath">Sesison path: {{ evStore.getSessionPath }}</div>
  <div v-if="evStore.getResourceCode">Resource code: {{ evStore.getResourceCode }}</div>
  <Button label="Login with resource" @click="loginWithResource()"/>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {onMounted, ref} from "vue";
import {useEvStore} from "@/store/ev.store";

const route = useRoute()
const evStore = useEvStore();
const router = useRouter()

const pathForm = ref({
  path: '',
});

onMounted(async () => {
  // fetchAllData()
  // TODO: for now only fetch ev auth resource data for testing
  console.log(route.params.context);
  const pathToDecoder = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + pathToDecoder);
  await evStore.getEvAuthResource(pathToDecoder)
})

function mockDecodePath() {
  console.log("mockDecodePath")
  const pathToDecoder = createLinkFromPathParams(pathForm.value.path);
  console.log(pathToDecoder)
  evStore.getEvAuthResource(pathToDecoder);
}

function loginWithResource() {
  evStore.loginWithResource(true, () => router.push('/ev/sessionInfo'))
}

function fetchAllData() {
  console.log(route.params.context);
  const pathToDecoder = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + pathToDecoder);
  evStore.getEvAuthResource(pathToDecoder)
  loginWithResource()
}

function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

</script>

<style scoped lang="scss">

</style>
