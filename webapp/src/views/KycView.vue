<template>
  <div>
    <Button
      class="p-button p-component secondary"
      @click="onKycStart">Start KYC</Button>
    <div id="app">
      <synaps-verify
        :sessionId="sessionId"
        :color="{ primary: '212b39', secondary: 'ffffff' }"
        lang="en"
        tier="2158"
        service="individual"
        @ready="console.log('ready')"
        @finish="console.log('finish')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SynapsVerify from '@synaps-io/vue3-verify';
import {computed, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";

const userServiceStore = useUserServiceStore();
const sessionId = computed(() => {
  return userServiceStore.kycSessionId;
});

const onKycStart = () => {
  useUserServiceStore().initKycSession(true);
};
</script>


<style scoped lang="scss">

</style>
