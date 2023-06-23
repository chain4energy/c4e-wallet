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

const activationCode = ref<string>('');
const contextStore = useContextStore();
const onActivateClick = () => {
  let dataToSign = activationCode.value+'-'+contextStore.dataToSign?.dataToSign.randomString;
  const processID = contextStore.dataToSign?.processID;
  if(contextStore.addressType == AddressType.METAMASK) {
    dataToSign = 'This message is for pairing your email with metamask/n' + dataToSign;

    if(processID)
      apiFactory.accountApi().signMetamask(dataToSign).then(signedDataResponse => {
        if(signedDataResponse.isSuccess() && signedDataResponse.data) {
          useUserServiceStore().emailMetamaskPairingDataVerify(processID, signedDataResponse.data, onSuccess, onError);
        }
      });
  } else if(contextStore.addressType == AddressType.KEPLR) {

    const accountNumber = contextStore.dataToSign?.dataToSign.accountNumber;
    const sequenceNumber = contextStore.dataToSign?.dataToSign.sequenceNumber;
    if(processID && accountNumber && sequenceNumber) {
      dataToSign = 'This message is for pairing your email with keplr/n' + dataToSign;
      console.log(dataToSign);
      apiFactory.accountApi().sign(useUserStore().connectionInfo, {accountNumber: accountNumber, randomString: dataToSign, sequenceNumber:sequenceNumber }).then(signedDataResponse => {

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
