<template>
  <div class="code_container box-shadow">
    <div class="code_container__info">
      A verification code has been sent to {{useUserServiceStore().userEmail}}. Please check your mailbox and enter code below.
    </div>
    <OtpComponent digit-count="12" @update:otp="activationCode = $event" />
    <div class="code_container__button">
      <Button class="p-button p-component secondary" @click="onActivateClick" >Activate</Button>
    </div>

  </div>
</template>

<script setup lang="ts">

import OtpComponent from "@/components/buyTokens/OtpComponent.vue";
import {ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import apiFactory from "@/api/factory.api";
import {useContextStore} from "@/store/context.store";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useUserStore} from "@/store/user.store";
import message from "@/config/message";
import {formatString} from "@/utils/string-formatter";

const activationCode = ref<string>('');
const contextStore = useContextStore();
const onActivateClick = () => {
  const processID = contextStore.dataToSign?.processID;
  if(contextStore.addressType == AddressType.METAMASK) {
    const dataToSign = formatString(message.LINKING_METAMASK_WALLET, {email: useUserServiceStore().userEmail, address: useUserStore().metamaskConnectionInfo.address,  activationCode: activationCode.value, randomString: contextStore.dataToSign?.dataToSign.randomString});
    if(processID)
      apiFactory.accountApi().signMetamask(dataToSign).then(signedDataResponse => {
        if(signedDataResponse.isSuccess() && signedDataResponse.data) {
          useUserServiceStore().emailMetamaskPairingDataVerify(processID, signedDataResponse.data, onSuccess, onError);
        }
      });
  } else if(contextStore.addressType == AddressType.KEPLR) {
    if(processID ) {
      const dataToSign = formatString(message.LINKING_COSMOS_WALLET, {email: useUserServiceStore().userEmail, address: useUserStore().connectionInfo.account,  activationCode: activationCode.value, randomString: contextStore.dataToSign?.dataToSign.randomString});
      apiFactory.accountApi().sign(useUserStore().connectionInfo, dataToSign, processID).then(signedDataResponse => {

        if(signedDataResponse.isSuccess() && signedDataResponse.data) {

          useUserServiceStore().emailKeplrPairingDataVerify(processID, signedDataResponse.data, onSuccess, onError);
        }
      });
    }
  }
};
const toast = useToast();
const router = useRouter();
const onSuccess = () => {
  if(contextStore.addressType == AddressType.METAMASK) {
    toast.success('Metamask connected');
  } else if (contextStore.addressType == AddressType.KEPLR) {
    toast.success('Keplr connected');
  }

  router.back();
};
const onError = (errorMessage?: string) => {
  toast.error('An error occurred \n' + errorMessage);
  router.back();
};
</script>

<style scoped lang="scss">
.code_container {
  padding: 70px 50px 50px 50px;
  &__info {
    margin-bottom: 50px;
    font-size: 1.5em;
  }
  &__button {
    margin-top: 30px;
  }
}
</style>
