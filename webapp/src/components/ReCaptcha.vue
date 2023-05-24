<template>
  <div
    class="g-recaptcha"
    data-sitekey="6Lc2fTYmAAAAAEQSYDkeecH1xPPvVD3T1UrBbpac"
    data-callback="onRecaptchaSuccess"
    data-expired-callback="onRecaptchaResponseExpiry"
    data-error-callback="onRecaptchaError"
  >
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";

onMounted(async () => {

  window.onRecaptchaSuccess = onRecaptchaSuccess;
  window.onRecaptchaError = onRecaptchaError;
  window.onRecaptchaResponseExpiry = onRecaptchaResponseExpiry;

});
const emit = defineEmits(['recaptchaSuccess']);
const onRecaptchaSuccess = (token: string) => {
  console.log('success');
  emit('recaptchaSuccess', token);
};
const onRecaptchaError = () => {
  console.log('error');
};
const onRecaptchaResponseExpiry = () => {
  console.log('expiry');
};
</script>


<style scoped lang="scss">

</style>
