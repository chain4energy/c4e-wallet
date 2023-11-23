<template>
  <Button @click="mockAccepted()">Accepted</Button>
  <Button @click="mockRejected()">Rejected</Button>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>
<script setup lang="ts">

import {useEvStore} from "@/store/ev.store";
import {SessionState} from "@/models/ev/sessionInfo";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/ev/evServiceCommons";

const errorStr = ref("");

const evStore = useEvStore();
const router = useRouter()
function mockAccepted() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.PAID
  }
  evStore.initPayment({ amount:'500', currency: 'PLN'}, true, onSucces, onError);
}

function onSucces(){
  router.push('/ev/startChargingSession');
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

function mockRejected() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.REJECTED
  }
  errorStr.value="ten przycisk nie działa. Jeszcze ...."
  // redirectBackToLink()
}

// function redirectBackToLink() {
  // window.location.href = 'http://localhost:9000/ev/resourceLink/hydrogenium/GUIGUGIUIHIUHDiuhadsacmixexciw'
  // router.push('/ev/startChargingSession');
// }
</script>


<style scoped lang="scss">

</style>
