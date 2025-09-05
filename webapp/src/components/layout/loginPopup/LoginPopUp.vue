<template>
<div class="loginPopup">
  <div class="loginPopup__background" @click="$emit('close')"></div>
  <div class="loginPopup__holder">
    <transition v-bind="loginType" name="slide-fade" mode="out-in">
      <component @keplr="keplrConnect"
                 @leap="leapConnect"
                 @chargEra="chargEraConnect"
                 @back="loginType = LoginChoose"
                 @typeChange="(comp: Component) => loginType = comp"
                 @close="$emit('close')"
                 @cosmostation="cosmostationConnect"
                 @loginSuccess="onChargEraLoginSuccess"
                 :showAddressOption="props.showAddressOption"
                 v-bind:is="loginType">
      </component>
    </transition>
  </div>
</div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue';
import ChargEraLogin from '@/components/layout/loginPopup/ChargEraLogin.vue';

import { onUnmounted, shallowRef, Component } from "vue";
import dataService from '@/services/data.service';

const props = defineProps({
  showAddressOption: {
    type: Boolean,
    default: true,
    required: false
  }
});

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const emit = defineEmits(['close', 'typeChange', 'connected']);

const loginType = shallowRef<Component>(LoginChoose);

function keplrConnect(){
  dataService.onKeplrLogIn(() => {emit('close');emit('connected');});
  // useUserStore().connectKeplr().then(() => {
  //   if (useUserStore().isLoggedIn){
  //     emit('close')
  //   } else {
  //     return
  //   }
  // });
}
function cosmostationConnect() {
  dataService.onCosmostationLogIn(() => {emit('close');emit('connected');});
}

const leapConnect = () => {
  dataService.onLeapLogIn(() => {emit('close');emit('connected');});
};

const chargEraConnect = () => {
  loginType.value = ChargEraLogin;
};

const onChargEraLoginSuccess = (userData: {email: string, token?: string, user?: unknown, address?: string}) => {
  // handle successful ChargEra login
  console.log('LoginPopUp: ChargEra login successful for:', userData.email);
  console.log('LoginPopUp: Using address-based connection for ChargEra...');
  // use the address from ChargEra response or fallback to static address
  const chargEraAddress = userData.address || 'c4e1mzy0xrh86cyesp37t7sk67qzza6svchsajs9r7';
  dataService.onAddressLogIn(chargEraAddress, () => {
    console.log('LoginPopUp: Address connection successful, closing popup...');
    emit('close');
    emit('connected');
  });
};

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
  z-index: 1100;

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
    width: 650px;
    min-height: 292px;
    background-color: #FFFFFF;
    padding: 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
  }
}

.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
