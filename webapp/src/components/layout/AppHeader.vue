<template>


    <nav class="navbar navbar-expand-lg navbar-dark background">
      <LoginPopUp v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
      <LogoutKeplr v-if="logoutPopupStatus === true" :logout-type="useUserStore().getConnectionType" @close="logoutPopupStatus = false"></LogoutKeplr>
      <div class="container-fluid">
        <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36" />
        <Button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </Button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">

          <div class="navbar-nav right">

            <div class="acc-address" v-if="useUserStore().isLoggedIn">
              {{useUserStore().getAccount.address}}
            </div>
            
            <LangSwitch class="nav-link mx-1"/>
            
            <Button
              v-if="!useUserStore().isLoggedIn"
              icon=" pi pi-power-off"
              style="margin-top: -8px;"
              class="nav-link p-button-rounded p-button-text p-button-lg mx-1"  @click="loginPopupStatus =! loginPopupStatus"></Button>
            <Button
              v-if="useUserStore().isLoggedIn"
              icon=" pi pi-power-off"
              style="margin-top: -8px;"
              class="nav-link p-button-rounded p-button-text p-button-lg mx-1"
              @click="logout"
            ></Button>
          </div>
        </div>

      </div>
      <div class="bottom-container">
        <h2>{{$t("SECTION_TITLES." + currentRouteName?.toUpperCase())}}</h2>
          <!-- <breadcrumbs-component /> -->
      </div>
      <UserData v-if="useUserStore().isLoggedIn"/>
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

const router = useRouter();
const globalFilter = useGlobalFilterStore();

const loginPopupStatus = ref(false);
const logoutPopupStatus = ref(false);

const currentRouteName = computed(() => {
  console.log(router.currentRoute.value);
  return router.currentRoute.value.name;
});

function logout(){
  logoutPopupStatus.value = !logoutPopupStatus.value;
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
@import '../../styles/variables.scss';

.acc-address {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 2px;
  padding: 0.5rem;
  background-color: $main-lighter-color;
  border-radius: 1rem;

  &:hover {
    max-width: 600px;
    overflow: visible;
  }

}
.userdata {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}
.background {
  background-image: url('@/assets/header/background.svg');
  //background-position: right 20px bottom -250px;
  background-size:     cover;                      /* <------ */
  background-repeat:   no-repeat;
  background-position: center center;
  position:sticky;
  color: white;
  top: 0px;
  z-index: 20;
  padding-bottom: 20px;

.badge {
  position: relative;
  top: -40px;
  right: -10px;
  border-radius: 50%;
  background-color: aqua;
  color: black;
}
.right {
  position: absolute;
  right: 20px;
  top:10px;
  display: flex;
  align-items: center;
}
.left {
  margin-left: 40px;
}
.bottom-container {
  padding: 3vh 10vw;
  display:flex;
  flex-direction: column;
  align-items: flex-start;
}
}

.p-inputtext {
  border-radius: 20px;
}
.p-input-icon-right>i {
  margin-top: -1rem;
}
@media (min-width: 992px) {
  .navbar-expand-lg{
    flex-wrap: wrap;
  }
}
</style>
