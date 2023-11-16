<template>
  <Button @click="mockAccepted()">Accepted</Button>
  <Button @click="mockRejected()">Rejected</Button>
</template>
<script setup lang="ts">

import {useEvStore} from "@/store/ev.store";
import {SessionState} from "@/models/ev/sessionInfo";

const evStore = useEvStore();

function mockAccepted() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.PAID
  }
  redirectBackToLink()
}

function mockRejected() {
  if (evStore.sessionInfo) {
    evStore.sessionInfo.state = SessionState.REJECTED
  }
  redirectBackToLink()
}

function redirectBackToLink() {
  window.location.href = 'http://localhost:9000/ev/resourceLink/hydrogenium/GUIGUGIUIHIUHDiuhadsacmixexciw'
}
</script>



<style scoped lang="scss">

</style>
