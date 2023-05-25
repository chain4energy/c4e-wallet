<template>
<div class="addressModal">
  <div class="addressModal__background" @click="$emit('close')"></div>
  <div class="addressModal__holder">
    <form class="addressModal__form" @submit="submit">
      <input type="email" v-model="address"/>
      <Button @click="submit" :label="'submit'"/>
    </form>

  </div>
</div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import { useToast } from "vue-toastification";

const toast = useToast();
const address = ref('');

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const emit = defineEmits(['close', 'submit']);

const usersEmail = computed(() => {
  return useUserServiceStore().getUserEmail;
});

function submit(){
  if(usersEmail.value){
    emit('submit');
    useUserServiceStore().provideEmailAddress(
      { claimedAddress: address.value,
        emailAddress: usersEmail.value,
        walletType: 'keplr'
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
  &__form{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
