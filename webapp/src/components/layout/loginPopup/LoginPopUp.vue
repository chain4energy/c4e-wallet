<template>
<div class="loginPopup">
  <div class="loginPopup__background" @click="$emit('close')"></div>
  <div class="loginPopup__holder">
    <transition v-bind="loginType" name="slide-fade" mode="out-in">
      <component @keplr="keplrConnect" @back="loginType = LoginChoose" @typeChange="(comp) => loginType = comp" v-bind:is="loginType"></component>
    </transition>
  </div>
</div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'

import { onUnmounted, ref, shallowRef } from "vue";
import { useUserStore } from "@/store/user.store";
import { useToast } from "vue-toastification";
import dataService from '@/services/data.service';


document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const emit = defineEmits(['close', 'typeChange']);

const loginType = shallowRef(LoginChoose)

function keplrConnect(){
  dataService.onKeplrLogIn(() => {emit('close')});
  // useUserStore().connectKeplr().then(() => {
  //   if (useUserStore().isLoggedIn){
  //     emit('close')
  //   } else {
  //     return
  //   }
  // });
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
