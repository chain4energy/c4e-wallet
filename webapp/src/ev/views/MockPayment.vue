<template>
  <Button @click="mockAccepted()">Accepted</Button>
  <Button @click="mockAcceptedAccepted()">AcceptedAccepted</Button>
  <Button @click="mockRejected()">Rejected</Button>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>
<script setup lang="ts">

import {SessionState} from "@/ev/models/sessionInfo";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {ErrorData} from "@/api/base.api";
import {useEvChargingSessionStore} from "@/ev/store/evChargingSession.store";
import {EvServiceApplicationError} from "@/ev/models/evServiceErrors";

const errorStr = ref("");

const evChargingSessionStore = useEvChargingSessionStore();
const router = useRouter()
function mockAccepted() {
  if (evChargingSessionStore.sessionInfo) {
    evChargingSessionStore.sessionInfo.state = SessionState.INIT
  }
  evChargingSessionStore.initPayment({ amount:'500', currency: 'PLN'}, true, onSuccess);
}

function mockAcceptedAccepted() {
  if (evChargingSessionStore.sessionInfo) {
    evChargingSessionStore.sessionInfo.state = SessionState.INIT
  }
  onSuccess();
}

function onSuccess(){
  router.push('/ev/sessionInfo');
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

function mockRejected() {
  if (evChargingSessionStore.sessionInfo) {
    evChargingSessionStore.sessionInfo.state = SessionState.FINAL
  }
  errorStr.value="ten przycisk nie działa. Jeszcze ...."
}

</script>

<style scoped lang="scss">

</style>
