<template>


    <nav class="navbar navbar-expand-lg navbar-dark background">
      <LoginPopUp v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
      <LogoutKeplr v-if="logoutPopupStatus === true" :logout-type="useUserStore().getConnectionType" @close="logoutPopupStatus = false"></LogoutKeplr>
    <div class="navbar-container">

      <div class="container-fluid d-flex justify-content-between">
        <span class="d-flex" style="align-items: center">
        <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36" />
        </span>

          <div class="navbar-nav" style="align-items: center">

            <div @click="openAccInfo"  class="acc-address" v-if="useUserStore().isLoggedIn">
              <KeplrLogo v-if="useUserStore().connectionInfo.isKeplr()"/>
              <Icon v-if="useUserStore().connectionInfo.isAddress()" style="margin-right: 10px;" name="Globe"></Icon>
              <span v-if="useUserStore().connectionInfo.accountName">{{ useUserStore().connectionInfo.accountName}}: </span>
              {{ useUserStore().getAccount.address.slice(0, 8)}}...{{useUserStore().getAccount.address.slice(-6) }}
            </div>

            <LangSwitch class="nav-link mx-1"/>

            <Button v-if="!useUserStore().isLoggedIn" class="secondary" @click="loginPopupStatus =! loginPopupStatus">{{ $t('COMMON.CONNECT') }}</Button>

            <Button v-if="useUserStore().isLoggedIn" class="secondary" @click="logout">{{ $t('COMMON.DISCONNECT') }}</Button>


          </div>
        </div>

      <div class="bottom-container">
        <h2>{{$t("SECTION_TITLES." + currentRouteName?.toUpperCase())}}</h2>
          <breadcrumbs-component />
      </div>
      <UserData v-if="useUserStore().isLoggedIn"/>
      </div>
    </nav>

</template>

<script setup lang="ts">
import LangSwitch from '@/components/lang/LangSwitch.vue';
import BreadcrumbsComponent from '../features/BreadcrumbsComponent.vue';
import AutoLogOut from "@/components/fetures/AutoLogOut.vue";
import  UserData from "@/components/userData/UserData.vue";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import LogoutKeplr from "@/components/layout/loginPopup/LogoutConfirm.vue";

import { useRouter } from 'vue-router';
import {useGlobalFilterStore} from "@/store/global-filter.store";
import { computed, ref } from "vue";
import { useUserStore } from "@/store/user.store";
import KeplrLogo from '../commons/KeplrLogo.vue';

const router = useRouter();
const globalFilter = useGlobalFilterStore();

const loginPopupStatus = ref(false);
const logoutPopupStatus = ref(false);
const dropdown = ref(false);

const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};

const currentRouteName = computed(() => {
  console.log(router.currentRoute.value);
  return router.currentRoute.value.name;
});
function openAccInfo(){
  logoutPopupStatus.value = !logoutPopupStatus.value;
}
function logout(){

  useUserStore().logOut()
  // switch (useUserStore().getConnectionType){
  //   case 1: logoutPopupStatus.value = 1;
  //     break;
  //   case 0: logoutPopupStatus.value = 2;
  //     break
  //   default: logoutPopupStatus.value = 0;
  //     break
  // }
}
// const keystoreChangeListener = () => {
//       useUserStore().connectKeplr()
//     }
// function logIn(){
//   useUserStore().connectKeplr().then(() => {
//     window.addEventListener('keplr_keystorechange', keystoreChangeListener);
//   })
// }
// function logOut(){
//   useUserStore().logOut()
//   window.removeEventListener('keplr_keystorechange', keystoreChangeListener)
// }
//
// onUnmounted(()=>{
//   window.removeEventListener('keplr_keystorechange', keystoreChangeListener)
// })

</script>

<style scoped lang="scss">

.acc-address {
  cursor: pointer;
  // margin-top: 2px;
  // position: relative;
  // padding: 0.5rem;
  // background-color: $main-lighter-color;
  // border-radius: 1rem;
}

.keplr-logo {
  padding: 0px 5px;
  background-color: rgba(255,255,255);
}

@media screen and (max-width: 700px) {
  .acc-address {
    display: none;
  }
}
.navbar-brand:hover{
  cursor: pointer;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255,255,255,.8) !important;
}

.navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover {
  color: var(--secondary-color) !important;
}
// .userdata {
//   position: absolute;
//   bottom: 0;
//   left: 50%;
//   transform: translate(-50%, 50%);
// }
// .background {
//   background-image: url('@/assets/header/background.svg');
//   //background-position: right 20px bottom -250px;
//   background-size:     cover;                      /* <------ */
//   background-repeat:   no-repeat;
//   background-position: center center;
//   position:sticky;
//   color: white;
//   top: 0px;
//   z-index: 20;
//   padding-bottom: 20px;

// .badge {
//   position: relative;
//   top: -40px;
//   right: -10px;
//   border-radius: 50%;
//   background-color: aqua;
//   color: black;
// }
// .right {
//   position: absolute;
//   right: 20px;
//   top:10px;
//   display: flex;
//   align-items: center;
// }
// .left {
//   margin-left: 40px;
// }
// .bottom-container {
//   padding: 3vh 10vw;
//   display:flex;
//   flex-direction: column;
//   align-items: flex-start;
// }
// }

// .p-inputtext {
//   border-radius: 20px;
// }
// .p-input-icon-right>i {
//   margin-top: -1rem;
// }
// @media (min-width: 992px) {
//   .navbar-expand-lg{
//     flex-wrap: wrap;
//   }
// }
</style>
