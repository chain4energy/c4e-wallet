<template>
  <InputText v-model="pathForm.path" placeholder="Path to decode"/>
  <Button label="Decode path" @click="mockDecodePath()"/>

  <Button label="Login with resource" @click="loginWithResource()"/>

  <sessionInfoC v-if="sessionInfo" :session-info="sessionInfo"></sessionInfoC>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed, onMounted, ref} from "vue";
import {useEvStore} from "@/store/ev.store";
import SessionInfoC from "@/ev/components/SessionInfoC.vue";

const route = useRoute()
const evStore = useEvStore();

const pathForm = ref({
  path: 'oko',
});

const sessionInfo = computed(() => evStore.getSessionInfo);

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
  evStore.getEvAuthResource(pathForm.value.path);
}

function loginWithResource() {
  evStore.loginWithResource()
}

function fetchAllData() {
  console.log(route.params.context);
  const pathToDecoder = createLinkFromPathParams(route.params.context);
  console.log("pathToDecoder:" + pathToDecoder);
  evStore.getEvAuthResource(pathToDecoder)
  evStore.loginWithResource()
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
