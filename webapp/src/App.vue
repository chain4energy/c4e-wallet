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
    <CurrentBlockchain></CurrentBlockchain>
    <app-sidebar/>
  </div>
</template>

<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

import {inject, onBeforeMount, onMounted } from "vue";
import {LoggerService} from '@/services/logger/logger.service';
import {createRouterBeforeEach} from '@/router/before_each';

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import AppFooter from "@/components/layout/AppFooter.vue";
import dataService from './services/data.service';
import CurrentBlockchain from "@/components/layout/CurrentBlockchain.vue";
import { changeTitle } from './utils/title-changer';

const logger = inject<LoggerService>('logger') as LoggerService;
onBeforeMount(() => {
  dataService.onAppStart();
});

onMounted(() => {
  createRouterBeforeEach(logger);
  changeTitle();
});

window.onload = async () =>{
  dataService.onWindowLoad();
  // useUserStore().reconnect();
};
</script>

<style lang="scss">
@import './styles/app.scss';
</style>
