<template>
  <div class="loginPopup">
    <div class="loginPopup__background" @click="$emit('close')"></div>
    <div class="loginPopup__holder">
      <div class="loginChoose__holder">
        <div class="top-bar">
          <h2>Wallet</h2>
          <Button icon="pi pi-times" style="margin-bottom: 0.5rem" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />

        </div>
        <div class="loginChoose__body">
          <div class="loginChoose__description">
            <div style="display: flex; align-items: center; justify-content: space-evenly; flex-direction: column;">
              <div style="display: flex">
                  <span v-if="showKeplrLogo">
                    <KeplrLogo style="display: flex; background-color: #002C50; color: white; font-size: 2em; padding: 0 10px" />
                  </span>
                <div class="loginChoose__descriptionIcon" v-if="!showKeplrLogo">
                  <img  :src="logo">
                </div>
                <div class="loginPopup__addressHolder">
                  <p>{{useUserStore().getAccount.address}}</p>
                  <Icon name="Copy" @click="copyTxt">{{$t('COPY.ADDRESS')}}</Icon>
                </div>
              </div>
                <span style="display: flex;width: 100%;align-items: center;justify-content: space-between;">
                  <span>Connected to:</span>
                  <span>
                    <span class="net-changer">
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle opacity="0.2" cx="13" cy="13" r="6" fill="#088201">
                          <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="13" cy="13" r="3" fill="#088201">
                          <animate attributeName="r" values="1;4;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                      <select class="currentBlockchain__selector" @change="onChange($event)">
                        <option v-for="[key, item] in configMap" :key="key" :value="key" :selected= "curentNetwork === item.networkName">{{ item.networkName }}</option>
                      </select>
                    </span>
                  </span>

                </span>
               <a :href="`${useConfigurationStore().config.explorerAccount}${useUserStore().getAccount.address}`"
                target="_blank" class="loginPopup__disconnect p-button">{{ $t('CONNECT.VIEW_EXPLORER')}}</a>
               <Button class="loginPopup__disconnect" @click="logout">{{ $t('COMMON.DISCONNECT') }}</Button>

              <!--<div class="loginPopup__data" style="display: flex; flex-direction: column; justify-items: left">
                <p>{{ useUserStore().getAccount.address.slice(0, 13)}}...{{useUserStore().getAccount.address.slice(-6)}}</p>
                <div>
                  <Button @click="copyTxt" style="width: 30%">copy</Button>
                  <a :href="`https://explorer-testnet.chain4energy.org/accounts/${useUserStore().getAccount.address}`"
                     target="_blank">{{ $t('CONNECT.VIEW_EXPLORER')}}</a>
                </div>

              </div>-->
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KeplrLogo from '@/components/commons/KeplrLogo.vue';
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue';
import { useUserStore } from "@/store/user.store";
import { ConnectionType } from "@/api/wallet.connecton.api";
import { computed, PropType } from "vue";
import { Validator } from "@/models/store/validator";
import { useToast } from "vue-toastification";
import Icon from "@/components/features/IconComponent"
import dataService from '@/services/data.service';
import { useConfigurationStore } from '@/store/configuration.store';
import { getConfigurationProfiles } from "@/config/configuration.profiles";
import {useBlockStore} from "@/store/block.store";
import { changeTitle } from "@/utils/title-changer";
import i18n from "@/plugins/i18n";

const props = defineProps({
  logoutType:{
    type: Number,
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

const showKeplrLogo = computed(() => {
  if(props.logoutType == ConnectionType.Keplr) {
    return true;
  } else {
    return false;
  }
});

const emit = defineEmits(['close']);

const onChange = (event: any) => {
  useConfigurationStore().setNetwork(event.target.value);
  changeTitle();
  emit('close');
};

const configMap = computed(() => {return useConfigurationStore().getConfigList;});
const curentNetwork = computed(() => {
  return useConfigurationStore().getConfigName;
})

const latestBlock = computed(() => useBlockStore().getLatestBlock)

function logout(){
  dataService.onLogOut();
  // useUserStore().logOut()
  emit('close')
}

function copyTxt(){
  navigator.clipboard.writeText(useUserStore().getAccount.address);
  useToast().success(i18n.global.t('COPY.ADDRESS'))
}

</script>

<style scoped lang="scss">
.net-changer {
  display: flex;
  border-radius: 7px;
  border: none;
  background-color: rgb(216, 216, 216);
  padding: 5px 10px;

  select {
    border: none;
    background-color: rgb(216, 216, 216);
    cursor: pointer;
  }
}

.top-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

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
  z-index: 10;
  &__addressHolder{
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    justify-content: space-between;
    width: 100%;

    svg {
      width: 15px;
      margin-right: 5px;
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
    width: 800px;
    min-height: 292px;
    background-color: #FFFFFF;
    padding: 46px 20px 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
  }
  &__disconnect{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    padding:11px 24px 13px 24px;
    text-decoration: none;
    width: 100% !important;
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
    width: 100%;
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
    background: #FFFFFF;
    flex-direction: column;
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
