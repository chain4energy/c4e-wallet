<template>
  <!--  <div class="navbar navbar-expand-lg background bg-primary">-->
  <!--    <div class="container-fluid">-->
  <!--      <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')"/>-->
  <!--      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"-->
  <!--              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">-->
  <!--        <span class="navbar-toggler-icon"></span>-->
  <!--      </button>-->
  <!--      &lt;!&ndash;      <AutoLogOut/>&ndash;&gt;-->
  <!--      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">-->
  <!--        <div class="navbar-nav">-->
  <!--          <span>AppHeader</span>-->
  <!--          <LangSwitch/>-->
  <!--          <Button></Button>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

    <nav class="navbar navbar-expand-lg navbar-dark background">
      <LoginPopUp v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
      <LogoutKeplr v-if="logoutPopupStatus === true" :logout-type="useUserStore().getLogedInfo" @close="logoutPopupStatus = 0"></LogoutKeplr>
      <div class="container-fluid">
        <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36" />
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
<!--          <div class="navbar-nav left">-->
<!--            <i class="pi pi-user me-3" style="font-size: 1.5rem;" />-->
<!--            <span>Hello <span style="font-weight:bold">Jan Kowalski</span> </span>-->
<!--            <i class="pi pi-sun ms-4" style="font-size: 1.5rem;" />-->
<!--            <span class="fw-bold mx-2">Monday</span>-->
<!--            <span>11.05.2022</span>-->
<!--          </div>-->
          <div class="navbar-nav right">
            <!--          <div class="nav-link">-->
<!--            <span class="p-input-icon-left p-input-icon-right mx-5 " >-->
<!--              <i class="pi pi-times-circle" @click="globalFilter.clearFilter()"/>-->
<!--              <InputText type="text" v-model="globalFilter.filter" placeholder="Search" />-->
<!--              <i class="pi" :class="{'pi-search': !globalFilter.isLoading, 'pi-spin pi-spinner': globalFilter.isLoading}"/>-->
<!--            </span>-->
            <LangSwitch class="nav-link mx-1"/>
<!--            <span class="">-->
<!--            <Button icon="pi pi-bell" class="nav-link p-button-rounded p-button-text p-button-lg mx-1" ></Button>-->
<!--            <div class="badge">2</div>-->
<!--          </span>-->
            <div v-if="useUserStore().isLoggedIn">
              {{useUserStore().getAccount.address}}
            </div>
            <div v-else>
              Login
            </div>
            <Button
              v-if="!useUserStore().isLoggedIn"
              icon=" pi pi-power-off"
              class="nav-link p-button-rounded p-button-text p-button-lg mx-1"  @click="loginPopupStatus =! loginPopupStatus"></Button>
            <Button
              v-if="useUserStore().isLoggedIn"
              icon=" pi pi-power-off"
              class="nav-link p-button-rounded p-button-text p-button-lg mx-1"
              @click="logout"
            ></Button>
          </div>
        </div>

      </div>
      <div class="bottom-container">
      </div>
      <UserData v-if="useUserStore().isLoggedIn"/>
    </nav>

</template>

<script setup lang="ts">
import LangSwitch from '@/components/lang/LangSwitch.vue';
import AutoLogOut from "@/components/fetures/AutoLogOut.vue";
import  UserData from "@/components/userData/UserData.vue";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import LogoutKeplr from "@/components/layout/loginPopup/LogoutConfirm.vue";

import { useRouter } from 'vue-router';
import {useGlobalFilterStore} from "@/store/global-filter.store";
import { computed, onMounted, ref, onUnmounted, onUpdated } from "vue";
import { useUserStore } from "@/store/user.store";

const router = useRouter();
const globalFilter = useGlobalFilterStore();

const loginPopupStatus = ref(false);
const logoutPopupStatus = ref(false);

function logout(){
  logoutPopupStatus.value = !logoutPopupStatus.value;
  // switch (useUserStore().getLogedInfo){
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
}
.left {
  margin-left: 40px;
}
.bottom-container {
  padding: 3vh 10vw;
  display:flex;
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
