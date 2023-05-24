<template>
  <div style="padding: 50px">
    <h1 style="font-weight: 700;">{{$t('FAUCET.TITLE')}}</h1>
    <div style="font-size: 1.25rem;white-space: pre-line;">
      {{$t('FAUCET.WELCOME')}}
    </div>
    <div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 60px">
        <InputText :placeholder="i18n.t('FAUCET.INPUT_ADDRESS')" style="width: 70%" v-model="address"></InputText>
        <Button class="p-button p-component secondary" :disabled="recaptchaToken.length==0" @click="topup">{{$t('FAUCET.REQUEST_TOKENS')}} <img class="" src="@/assets/faucet.svg" alt="Image" style="width: 30px"></Button>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px">
        <ReCaptcha @recaptchaSuccess="onRecaptchaSuccess" />
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">

import {useUserStore} from "@/store/user.store";
import {useToast} from "vue-toastification";
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {FaucetErrorEnum} from "@/models/faucet";
import ReCaptcha from "@/components/ReCaptcha.vue";



onMounted(async () => {
  address.value=userStore.connectionInfo.account;

});
const toast = useToast();
const i18n = useI18n();
const userStore = useUserStore();
const address = ref<string>('');
const recaptchaToken = ref<string>('');

function topup() {
  console.log('topup')
  useUserStore().topUpAccount(address.value, recaptchaToken.value,
    () => {
      toast.success(i18n.t('TOAST.SUCCESS.TOP_UP'));
    },
    (errorType: FaucetErrorEnum) => {
      if(errorType == FaucetErrorEnum.UNKNOWN) {
        toast.error(i18n.t('TOAST.ERROR.TOP_UP'));
      } else if(errorType == FaucetErrorEnum.TOO_MANY_REQUESTS) {
        toast.error(i18n.t('TOAST.ERROR.TOO_MANY_REQUESTS'));
      }

    });
}
const onRecaptchaSuccess = (token: string) => {
  recaptchaToken.value = token;
};
</script>

<style scoped lang="scss">

</style>
