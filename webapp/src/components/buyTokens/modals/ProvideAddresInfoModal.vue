<template>

  <div class="addressModal">
    <div class="addressModal__background" @click="$emit('close')"></div>
    <div class="addressModal__holder">
      <p>Email: {{ usersEmail }}</p>
      <p v-if="addressType === AddressType.KEPLR">Keplr Address: {{usersWallet  }}</p>
      <p v-if="addressType === AddressType.METAMASK">Metamask address</p>
      <Button @click="confirm" :label="'Confirm'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useToast} from "vue-toastification";
import {computed, onUnmounted} from "vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useUserServiceStore} from "@/store/userService.store";
import {useUserStore} from "@/store/user.store";

const toast = useToast();

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const props = defineProps<{
  addressType: AddressType
}>();

const usersEmail = computed(() => {
  return useUserServiceStore().getUserEmail;
});

const usersWallet = computed(() => {
  return useUserStore().getAccount.address;
});

const emit = defineEmits(['close', 'confirm']);

function confirm(){
  emit('confirm');
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
