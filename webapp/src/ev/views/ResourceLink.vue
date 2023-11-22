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
  path: 'hydrogenium/eyJ0eXBlIjoiYXV0aC1yZXNvdXJjZS1saW5rIiwidmVyc2lvbiI6InYwLjEiLCJwYXJhbXMiOnsicmVzb3VyY2UiOnsidHlwZSI6ImNoYXJnaW5nLXNlc3Npb24iLCJ2ZXJzaW9uIjoiMC4xIiwicGFyYW1zIjp7ImNoYXJnZVBvaW50Ijoib2tvIiwiY29ubmVjdG9yIjoiMSIsInNlc3Npb24iOiJhZGN4bHAxNXJpZmU2ckRZcSJ9fSwicmVzb3VyY2VDb2RlIjoiZXlKc2IyZHBiaUk2SW1SaGQybGtMbXR5ZFd0QWIzWnZieTV3YkNJc0ltRmpZMlZ6YzBOdlpHVWlPaUp0TW1GdlRYbE5NbE5xZDAxNWNrMDFaMmhHZFVWbWNWcFJibEJpWkU1TVpTSXNJbkpsYzI5MWNtTmxJam9pZTF3aWRIbHdaVndpT2x3aVkyaGhjbWRwYm1jdGMyVnpjMmx2Ymx3aUxGd2lkbVZ5YzJsdmJsd2lPbHdpTUM0eFhDSXNYQ0p3WVhKaGJYTmNJanA3WENKamFHRnlaMlZRYjJsdWRGd2lPbHdpYjJ0dlhDSXNYQ0pqYjI1dVpXTjBiM0pjSWpwY0lqRmNJaXhjSW5ObGMzTnBiMjVjSWpwY0ltRmtZM2hzY0RFMWNtbG1aVFp5UkZseFhDSjlmU0o5Q2c9PSJ9fQ==',
});

onMounted(async () => {
  pathForm.value.path = createLinkFromPathParams(route.params.context as string);
  fetchAllData()
  mockDecodePath();
  // TODO: for now only fetch ev auth resource data for testing
  // console.log(route.params.context);
  // const pathToDecoder = createLinkFromPathParams(route.params.context);
  // console.log("pathToDecoder:" + pathToDecoder);
  // await evStore.getEvAuthResource(pathToDecoder)

})

function mockDecodePath() {
  console.log("mockDecodePath")
  const pathToDecoder = createLinkFromPathParams(pathForm.value.path);
  console.log(pathToDecoder)
  evStore.getEvAuthResource(pathToDecoder);
}

function loginWithResource() {
  evStore.loginWithResource(true, () => evStore.fetchSessionInfoAndRedirect(true))
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
