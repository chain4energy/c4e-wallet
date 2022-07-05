<template>
  <div class="page-container">
    <loading-screen/>
    <app-header/>
    <div class="main-container">
      <div class="content">
        <router-view />
      </div>
    </div>
    <app-footer class="footer"/>
    <app-sidebar/>
  </div>
</template>

<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

import { inject, onBeforeMount, onMounted, watch } from "vue";
import {LoggerService} from '@/services/logger/logger.service';
import {createRouterBeforeEach} from '@/router/before_each';


import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import AppFooter from "@/components/layout/AppFooter.vue";
import {useConfigurationStore} from "@/store/configuration.store";
import { useUserStore } from "@/store/user.store";

const logger = inject<LoggerService>('logger') as LoggerService;
onBeforeMount(() => {
  useConfigurationStore().fetchConfig("config1.json");
});

onMounted(() => {
  createRouterBeforeEach(logger);
  setTimeout(() =>{
    if (localStorage.getItem('account')){
      useUserStore().fetchAccount()
    } else {
      return
    }
  },200)
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.page-container {
  position: relative;
  min-height: 100vh;
}

.main-container {
  display: flex;
  padding-bottom: 60px;

  .content {
    width: 100%;
    padding-left: 100px;
    //padding-right: 100px;
    margin: auto;

  }

}

.footer {
  position: absolute;
  bottom: 0px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
@media only screen and (max-width: 600px) {
  .main-container {
    .content {
      padding-left: 0px;
    }
  }

}
</style>
