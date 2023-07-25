<template>


  <!-- <nav class="navbar navbar-expand-lg navbar-dark background">
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
  </nav> -->

  <nav class="navbar navbar-expand-lg navbar-dark background">
    <LoginPopUp v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
    <LogoutKeplr v-if="logoutPopupStatus === true" :logout-type="useUserStore().getConnectionType" @close="logoutPopupStatus = false"></LogoutKeplr>
    <div class="navbar-container">

      <div class="container-fluid d-flex justify-content-between">
        <span class="d-flex" style="align-items: center">
        <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36" @click="onLogoClick()" />
        <div class="bottom-container">
        <h2>{{ $t("SECTION_TITLES." + currentRouteName?.toUpperCase()) }}</h2>
          <breadcrumbs-component/>
        </div>
        </span>

        <div class="navbar-nav menu" style="align-items: center">

          <div @click="openAccInfo" class="acc-address" v-if="useUserStore().isLoggedIn">
            <KeplrLogo :letter="getLetter()" v-if="displayLogo"/>

            <Icon v-if="useUserStore().connectionInfo.isAddress()" style="margin-right: 10px;" name="Globe"></Icon>
            <span v-if="useUserStore().connectionInfo.accountName">{{ useUserStore().connectionInfo.accountName }}: </span>
            {{ useUserStore().getAccount.address.slice(0, 8) }}...{{ useUserStore().getAccount.address.slice(-6) }}
          </div>

          <LangSwitch class="nav-link mx-1"/>

          <Button v-if="!useUserStore().isLoggedIn" class="secondary" @click="loginPopupStatus =! loginPopupStatus">{{ $t('COMMON.CONNECT') }}</Button>

          <Button v-if="useUserStore().isLoggedIn" class="secondary" @click="logoutWallet">{{ $t('COMMON.DISCONNECT') }}</Button>

          <div class="profileMenu" @focusout="closeProfileDropdown" tabindex="0" @click="toggleProfileDropdown()" >
            <div class="profileMenu-icon"> <UserIcon :style="useUserServiceStore().isLoggedIn ? 'color: #81CF1F' : ''" /></div>
            <div class="profileMenu__dropdown" v-if="profileDropdown">

              <div v-if="!useUserServiceStore().isLoggedIn">
                <div class="option grid_container"  @click="router.push({name: 'signIn-profile'});">
                  <Icon name="LogIn" />
                  Login to profile
                </div>
              </div>
              <div v-else>
                <div class="profileMenu__dropdown-info">{{useUserServiceStore().userEmail}}</div>
                <div class="option grid_container"  @click="router.push({name: 'userProfileTabs'});">
                  <div><Icon name="User" /></div>
                  <div>My profile</div>
                </div>
                <div class="option grid_container" @click="logoutAccount();">
                  <Icon name="LogOut" />
                  <div>
                    Logout
                  </div>
                </div>
              </div>

            </div>
          </div>


        </div>
        <div class="navbar-nav mobile" @click="toggleDropdown" style="align-items: center">
          <Icon name="Menu"/>
        </div>
      </div>


      <UserData v-if="useUserStore().isLoggedIn"/>
    </div>
    <div class="mobile-menu" :class="dropdown ? 'mobile-menu-open' : ''">
      <div class="header">
        <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36"/>
        <div @click="toggleDropdown">
          <Icon name="X"/>
        </div>
      </div>
      <!-- <div class="divider"></div> -->
      <div @click="openAccInfo" class="acc-address" v-if="useUserStore().isLoggedIn">
        <KeplrLogo v-if="useUserStore().connectionInfo.isKeplr()"/>
        <Icon v-if="useUserStore().connectionInfo.isAddress()" style="margin-right: 10px;" name="Globe"></Icon>
        <span style="display: flex; flex-direction: column">
            <span v-if="useUserStore().connectionInfo.accountName">{{ useUserStore().connectionInfo.accountName }}: </span>
            {{ useUserStore().getAccount.address.slice(0, 8) }}...{{ useUserStore().getAccount.address.slice(-6) }}
            <Button v-if="useUserStore().isLoggedIn" class="secondary" @click="logoutWallet(); toggleDropdown()">{{ $t('COMMON.DISCONNECT') }}</Button>
          </span>
      </div>
      <Button style="width: 90%" v-if="!useUserStore().isLoggedIn" class="secondary" @click="toggleDropdown(); loginPopupStatus =! loginPopupStatus">{{
          $t('COMMON.CONNECT')
        }}
      </Button>
      <span style="display: flex;width: 100%;align-items: center;justify-content: space-around; margin: 10px 0;">
          <span>Connected to:</span>
          <span>
            <span class="net-changer">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.2" cx="13" cy="13" r="6" fill="#088201">
                  <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="13" cy="13" r="3" fill="#088201">
                  <animate attributeName="r" values="1;4;1" dur="2s" repeatCount="indefinite"/>
                </circle>
              </svg>
              <select class="currentBlockchain__selector" @change="onChange($event)">
                <option v-for="[key, item] in configMap" :key="key" :value="key" :selected="curentNetwork === item.networkName">{{ item.networkName }}</option>
              </select>
            </span>
          </span>
        </span>
      <div class="section-header">Navigation</div>
      <router-link :to="menuItem.href" v-for="(menuItem,index) of menu" :key="index" @click="toggleDropdown">
            <span class="sidebar-element">
              <span class="icon" :class="{ 'active': index === selected }">
                <Icon v-if="menuItem.icon.type === SideBarIconType.LUCIDE" :name="menuItem.icon.element"/>
                <GovernanceIcon v-else-if="menuItem.icon.type === SideBarIconType.GOV" :icon="menuItem.icon.element"/>
              </span>
              <span class="title">{{ menuItem.title }}</span>
            </span>
      </router-link>
    </div>
  </nav>

</template>

<script setup lang="ts">
import LangSwitch from '@/components/lang/LangSwitch.vue';
import BreadcrumbsComponent from '../features/BreadcrumbsComponent.vue';
import UserData from "@/components/userData/UserData.vue";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import LogoutKeplr from "@/components/layout/loginPopup/LogoutConfirm.vue";
import {SideBarIconType} from "@/services/permissions/sidebar.config";
import {useConfigurationStore} from '@/store/configuration.store';
import {changeTitle} from "@/utils/title-changer";
import {useRoute, useRouter} from 'vue-router';
import {computed, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {PermissionsService} from "@/services/permissions/permissions.service";
import KeplrLogo from '../commons/KeplrLogo.vue';
import * as GovernanceIcon from "@/components/commons/GovernanceIcon.vue";
import dataService from "@/services/data.service";
import {useUserServiceStore} from "@/store/userService.store";
import UserIcon from "@/components/features/UserIcon.vue";

const router = useRouter();
const loginPopupStatus = ref(false);
const logoutPopupStatus = ref(false);
const dropdown = ref(false);

const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};
const configMap = computed(() => {
  return useConfigurationStore().getConfigList;
});
const curentNetwork = computed(() => {
  return useConfigurationStore().getConfigName;
});

const onChange = (event: any) => {
  useConfigurationStore().setNetwork(event.target.value);
  changeTitle();
  logoutPopupStatus.value = false;
};
const permissionsService = new PermissionsService();
const menu = computed(() => {
  return permissionsService.createSideBar();
});


const selected = computed(() => {
  let current = menu.value.find(element => element.href == router.currentRoute.value.path);
  return current?.id;
});

const currentRouteName = computed(() => {
  return router.currentRoute.value.name;
});
const displayLogo = () => {
  return useUserStore().connectionInfo.isKeplr() || useUserStore().connectionInfo.isLeap() || useUserStore().connectionInfo.isCosmostation();
};

const getLetter = () => {
  if(useUserStore().connectionInfo.isCosmostation()) {
    return 'C';
  } else if(useUserStore().connectionInfo.isKeplr()) {
    return 'K';
  } else if(useUserStore().connectionInfo.isLeap()) {
    return 'L';
  }
};

function openAccInfo() {
  logoutPopupStatus.value = !logoutPopupStatus.value;
}

function logoutWallet() {
  // const latestBlock = computed(() => useBlockStore().getLatestBlock);
  dataService.onLogOutWallet();
}

function logoutAccount(){
  useUserServiceStore().logoutAccount();
  router.push('/buyTokens/signIn');
}
const route= useRoute();
const onLogoClick = () => {

  if(route.name == 'Dashboard') {
    window.location.reload();
  } else {
    router.push({name: 'Dashboard'});
  }
};


const profileDropdown = ref(false);
const toggleProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value;
};

const closeProfileDropdown = () => {
  profileDropdown.value = false;
};
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

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

.section-header {
  background: $main-color;
  font-weight: bold;
  color: white;
  padding: 0.5em 0;
  width: 100vw;
}

.divider {
  background: rgba(0, 0, 0, .1);
  width: 300%;
  height: 1px;
  transform: translateX(-50%);
  margin: 0.5em 0;
}

.mobile-menu {
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  background: white;
  flex-direction: column;
  z-index: 99999999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 120vw;
  transition: 0.2s ease-in-out all;
  overflow: hidden;
  color: $plain-text-color;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 2em;

    div {
      width: 25px;
      height: 25px;
      color: black;

      &:last-of-type {
        cursor: pointer;
      }
    }
  }

  .acc-address {
    display: flex;
    align-items: center;
    padding: 0.5em 2em;
    justify-content: space-evenly;

    .lucide-globe-icon {
      width: 50px;
      height: 70px;
    }

    .keplr-logo {
      font-size: 2.5em;
    }
  }

  .sidebar-element {
    font-size: 1.2em;
    display: flex;
    align-items: center;

    .icon {
      .lucide {
        width: 40px;
        height: 30px;
      }
    }

    .active {
      box-shadow: none !important;
    }
  }
}

a {
  text-decoration: none;
  padding: .5em 2em;

  &:hover {
    background: rgba(0, 0, 0, .1);
    color: $primary-green-color;
  }
}

nav a.router-link-exact-active {
  color: $primary-green-color !important;
}

.mobile-menu-open {
  left: 0;
}

.mobile {
  display: none;

  .lucide-menu-icon {
    border: 1px solid $primary-green-color;
    padding: 0.3em;
    box-sizing: content-box;
    border-radius: 7px;
    cursor: pointer;
    transition: 0.2s ease-in-out all;

    &:hover {
      background-color: $primary-green-color;
      color: $main-color;
    }
  }
}

.acc-address {
  cursor: pointer;
  // margin-top: 2px;
  // position: relative;
  // padding: 0.5rem;
  // background-color: $main-lighter-color;
  // border-radius: 1rem;
}

.keplr-logo {
  padding: 0 5px;
  background-color: rgba(255, 255, 255);
}

@media screen and (max-width: 700px), (max-height: 640px) {
  .menu {
    display: none;
  }

  .mobile {
    display: flex;
  }
}

.navbar-brand:hover {
  cursor: pointer;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, .8) !important;
}

.navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover {
  color: var(--secondary-color) !important;
}
.profileMenu {

  //padding: 10px;

  border-radius: 5px;
  position: relative;

  cursor: pointer;
  color: white;
  z-index: 3;

  &__dropdown {
    display: flex;
    flex-direction: column;
    position: absolute;
    top:40px;
    min-width: 130px;
    border-radius: 5px 0 5px 5px;
    overflow: hidden;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index: 3;
    color: black;
    background-color: #ffffff;
    transform:translateX(-100%);
    font-weight: bolder;
    &-info {
      padding: 15px 25px;
    }
    .option {
      padding: 20px 15px;
      background-color: #ffffff;
      width: 100%;
      border-top: 1px #eeeeee solid;
      white-space: nowrap;
      &:hover {
        background-color: #b6b6b6;
      }
    }
    .grid_container {
      text-align: left;
      display: grid;
      grid-template-columns: minmax(20px, auto) 1fr;
      grid-template-rows: 1fr;
      align-items: center;

      grid-gap: 30px;
      background-color: #f8f8f8;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
    }
  }
  &-icon {

  }
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
