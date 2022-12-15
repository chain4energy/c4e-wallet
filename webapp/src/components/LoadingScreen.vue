<template>
  <!--  BlockUI nie zawsze działa, czasami pozostaje się nie wyłącza i ekran zostaje zablokowany-->
  <!--  <BlockUI id="blokUi" :blocked="splashStore.splashOn" :fullScreen="true">-->
<!--    <div v-if="splashStore.splashOn" class="lds-hourglass"/>-->
  <div>
    <loading v-model:active="splashStore.splashOn" ><C4ESpinner class="c4e-icon" :size="120"/></loading>

<!--    <loading v-model:active="ttt"/>-->
  </div>
</template>

<script setup lang="ts">
import {useSplashStore} from '@/store/splash.store';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import C4ESpinner from './commons/C4ESpinner.vue';

const splashStore = useSplashStore();
// const ttt = true;

</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
.c4e-icon {
  color: $primary-secondary-blue-color;
}
/*TODO - jakiś ładny spinner */
.lds-hourglass {
  position: fixed;
  top: 49%;
  left: 49%;
  z-index: 9999;
  /*width: 100vw; height: 100vh;*/
}

.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid #2afb88;
  border-color: #2afb88 transparent #2afb88 transparent;
  animation: lds-hourglass 1.2s infinite;
}

@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

</style>
