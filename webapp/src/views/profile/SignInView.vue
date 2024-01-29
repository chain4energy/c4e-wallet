<template>
  <SignInComponent :authEmailAccountMethod="OwnerService.authEmailAccount"
                   @on-forgot-password-button="goTo_ResetPasswordView()"
                   @on-sign-up-button="goTo_SignUpView()"
                   @on-success-login="goTo_EvOwnerDashboardView()"
  />
</template>

<script setup lang="ts">
import SignInComponent from "@/components/profile/SignInComponent.vue";
import {goTo_EvOwnerDashboardView, goTo_ResetPasswordView, goTo_SignUpView} from "@/router/goToRoute";
import {onMounted} from "vue";
import OwnerService from "@/services/ownerEv.service";

onMounted(() => {
  OwnerService.loginPageEntered();
});

</script>

<style scoped lang="scss">

</style>
