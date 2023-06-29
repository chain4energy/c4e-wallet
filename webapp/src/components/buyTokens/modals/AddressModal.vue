<template>
<div class="addressModal">
  <div class="addressModal__background" @click="$emit('close')"></div>
  <div class="addressModal__holder">
    <div v-if="needToVerify">
      <p >Check your Email and input data here</p>
      <div class="addressModal__form">
        <div class="addressModal__inputBlock">
          <p> ProcessID: </p>
          <InputText v-model="processID" type="text"/>
        </div>
        <div class="addressModal__inputBlock">
          <p> Pairing code: </p>
          <InputText v-model="pairingCode" type="text"/>
        </div>
        <div class="addressModal__inputBlock">
          <p> Signed data: </p>
          <InputText v-model="signedData" type="text"/>
        </div>
      </div>


    </div>

    <p v-if="!needToVerify">Keplr Address: {{usersWallet}}</p>
    <p v-if="mode === LoginTypeEnum.EMAIL && !needToVerify">Email: {{usersEmail}}</p>
    <p v-if="mode === LoginTypeEnum.METAMASK && !needToVerify">Metamask address</p>
      <Button @click="needToVerify ? verify() : submit()" :label="'submit'"/>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { LoginTypeEnum, useUserServiceStore } from "@/store/userService.store";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/store/user.store";

const toast = useToast();

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const emit = defineEmits(['close', 'submit']);

const processID = ref('');
const pairingCode=ref('');
const signedData = ref('');

const usersEmail = computed(() => {
  return useUserServiceStore().getUserEmail;
});

const usersWallet = computed(() => {
  return useUserStore().getAccount.address;
});

const mode = computed(() => {
  return useUserServiceStore().getLoginType;
});

const needToVerify= computed(() => {
  return useUserServiceStore().isVerificationNeeded;
});

function submit(){
  switch (useUserServiceStore().getLoginType){
    case LoginTypeEnum.EMAIL: submitEmail();
      break;
    case LoginTypeEnum.METAMASK: submitMetamask()
      break;
    case LoginTypeEnum.KEPLR: console.log(3);
      break;
    case LoginTypeEnum.NONE: useToast().error('you have to be logged in');
  }
}

function verify(){
  if(processID.value != '' && pairingCode.value != '' && signedData.value != ''){
    useUserServiceStore().verifyParingEmailKeplr( processID.value, pairingCode.value, signedData.value, onSuccessPairing, onFail, true).then((res)=>{
      emit('submit');
    });
  } else {
    return onFail();
  }

}
function submitEmail(){
  if(usersWallet.value){
    // emit('submit');
    useUserServiceStore().provideKeplrAddress(
      { claimedAddress: usersWallet.value,
      }, onSuccessPairing, onFail, true);
  }else {
    toast.error('You have to be logged in with Email');
  }
}

function submitMetamask(){
  if(usersWallet.value){
    emit('submit');
    useUserServiceStore().pairMetamaskAddress(
      { claimedAddress: usersWallet.value,
      }, onSuccessPairing, onFail, true);
  }else {
    toast.error('You have to be logged in with Email');
  }
}
function onSuccessPairing(){
  toast.success('Successfully logged in');
}

function onFail(){
  toast.error('An error occured');
}


</script>

<style scoped lang="scss">
.addressModal{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 100vh;
  &__background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }

  &__holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 800px;
    background-color: #FFFFFF;
    padding: 46px 20px 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    opacity: 100%;
  }
  &__inputBlock{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    input {
      margin-left: 10px;
    }
  }
  &__form{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    div{
      margin-top: 10px;
      align-items: center;
      justify-items: center;
    }
  }
}
</style>
