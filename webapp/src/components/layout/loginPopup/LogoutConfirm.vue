<template>
  <div class="loginPopup">
    <div class="loginPopup__background" @click="$emit('close')"></div>
    <div class="loginPopup__holder">
      <div class="loginChoose__holder">
        <h2>Wallet</h2>
        <button @click="$emit('close')"> close </button>
        <div class="loginChoose__body">
          <div class="loginChoose__description">
            <div style="display: flex; align-items: center; justify-content: space-evenly;">
              <div class="loginChoose__descriptionIcon">
                <img :src="logo">
              </div>
              <div class="loginPopup__data" style="display: flex; flex-direction: column; justify-items: left">
                <p>{{ useUserStore().getAccount.address.slice(0, 13)}}...{{useUserStore().getAccount.address.slice(-6)}}</p>
                <div>
                  <button @click="copyTxt" style="width: 30%">copy</button>
                  <a :href="`https://explorer-testnet.chain4energy.org/accounts/${useUserStore().getAccount.address}`"
                     target="_blank">{{ $t('LOGIN.VIEW_EXPLORER')}}</a>
                </div>

              </div>
            </div>
            <button class="loginPopup__disconect" @click="logout">{{ $t('COMMON.DISCONNECT') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue';
import { useUserStore } from "@/store/user.store";
import { ConnectionType } from "@/api/wallet.connecton.api";
import { computed, PropType } from "vue";
import { Validator } from "@/models/store/validator";
import { useToast } from "vue-toastification";

const props = defineProps({
  logoutType:{
    type: String,
    required: true,
  }
});

const logo = computed(() => {
  switch(props.logoutType){
    case ConnectionType.Keplr: return '/keplrIcon.jpg'
    case ConnectionType.Address: return '/globe.svg'
    default : return 'Logout'
  }
})

const emit = defineEmits(['close']);

function logout(){
  useUserStore().logOut()
  emit('close')
}

function copyTxt(){
  navigator.clipboard.writeText(useUserStore().getAccount.address);
  useToast().success('address have been copied')
}

</script>

<style scoped lang="scss">
.loginPopup {
  color: #001b31;
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  p{
    margin-bottom: 0;
  }
  &__background{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }
  &__holder{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    width: 800px;
    min-height: 292px;
    background-color: #FFFFFF;
    padding: 46px 20px 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
  }
  &__data{

    button{
      border: none;
      background: transparent;
      color: #0A6BDD;
      text-align: left;
    }
  }
  &__disconect{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }
}
.loginChoose{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 100vh;
  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }
  p{
    margin-bottom: 0;
  }
  &__background{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }
  &__holder{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
  }
  &__header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    div{
      display: flex;
      align-items: baseline;
      justify-items: center;
      text-align: center;
      :nth-child(1){
        margin-right: 15px;
      }
    }
  }
  &__form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 300px;
  }
  &__body{
    width: 100%;
  }
  &__description{
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    border-radius: 8px;
    padding: 22px;
    border: 2px solid transparent;
    &:hover{
      border: 2px solid rgba(0, 0, 0, 0.11);
    }

    &-info{
      display: flex;
      flex-direction: column;
      align-items: flex-start;

    }
  }
  &__descriptionIcon{
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
  }
  &__btnHolder{
    width: 100%;
  }
  &__btns{
    margin-top: 10px;
    display: flex;
    width: 100%;
    justify-content: flex-end;

  }
}

</style>
