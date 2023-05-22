<template>
  <div>
    <OtpComponent digit-count="12" @update:otp="activationCode = $event" />
    <Button class="p-button p-component secondary" @click="onActivateClick" >Activate</Button>
  </div>
</template>

<script setup lang="ts">

import OtpComponent from "@/components/buyTokens/OtpComponent.vue";
import {ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";

const activationCode = ref<string>('');
const onActivateClick = () => {

  useUserServiceStore().activateEmailAccount(activationCode.value, true);
};
</script>

<style scoped lang="scss">

</style>
