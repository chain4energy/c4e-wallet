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
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";

const activationCode = ref<string>('');
const onActivateClick = () => {
  useUserServiceStore().verifyParingEmailKeplr(activationCode.value, onSuccess, onError, true);
};
const toast = useToast();
const router = useRouter();
const onSuccess = () => {
  toast.success('Account activated');
  router.push({name: 'publicSaleInfo'});
};
const onError = () => {
  toast.error('An error occurred');
};
</script>

<style scoped lang="scss">

</style>
