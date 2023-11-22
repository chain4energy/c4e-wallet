<template>
  <Button @click="mockAccepted()">Accepted</Button>
  <Button @click="mockRejected()">Rejected</Button>
</template>
<script setup lang="ts">

import {useEvStore} from "@/store/ev.store";
import {SessionState} from "@/models/ev/sessionInfo";
import {useRouter} from "vue-router";

const evStore = useEvStore();
const router = useRouter()
function mockAccepted() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.PAID
  }
  evStore.initPayment({ amount:'500', currency: 'PLN'}, true);
  redirectBackToLink()
}

function mockRejected() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.REJECTED
  }
  // redirectBackToLink()
}

function redirectBackToLink() {
  // window.location.href = 'http://localhost:9000/ev/resourceLink/hydrogenium/GUIGUGIUIHIUHDiuhadsacmixexciw'
  router.push('/ev/sessionInfo');
}
</script>


<style scoped lang="scss">

</style>
