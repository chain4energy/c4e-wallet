<template>
  <div class="code_container">
    <div class="code_container__info">
      The activation code has been sent to the e-mail address provided. Please check your mailbox and enter code below.
    </div>
    <OtpComponent digit-count="12" @update:otp="activationCode = $event" />
    <div class="code_container__button">
      <Button class="p-button p-component secondary" @click="onActivateClick" >Activate</Button>
    </div>
  </div>
</template>

<script setup lang="ts">

import OtpComponent from "@/components/OtpComponent.vue";
import {ref} from "vue";
import {useToast} from "vue-toastification";
// import {useRouter} from "vue-router";
import {useEvStore} from "@/store/ev.store";
import {goTo_EvOwnerDashboardView} from "@/router/goToRoute";

const activationCode = ref<string>('');
const onActivateClick = () => {

  useEvStore().activateEmailAccount(activationCode.value, onSuccess, onError, true);
};
const toast = useToast();
// const router = useRouter();
const onSuccess = () => {
  toast.success('Account activated');
  goTo_EvOwnerDashboardView();
};
const onError = () => {
  toast.error('An error occurred');
};
</script>

<style scoped lang="scss">
.code_container {
  padding: 0px 50px 50px 50px;
  &__info {
    margin-bottom: 50px;
    font-size: 1.5em;
  }
  &__button {
    margin-top: 30px;
  }
}
</style>
