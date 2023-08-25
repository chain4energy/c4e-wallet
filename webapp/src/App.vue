<template>
  <div class="page-container">
    <loading-screen/>
<!--    <AppDisclaimer v-if="disclaimerOpen" @close="closeDisclaimer"/>-->
    <app-header/>
    <div class="main-container">
      <div class="content">
        <router-view />
      </div>
    </div>
    <app-footer class="footer"/>
    <CurrentBlockchain></CurrentBlockchain>
    <app-sidebar/>
    <div class="ari10-widget-wrapper" data-widget-id='41875703-9ee2-4729-9d51-e574c61467c3'></div>
  </div>
</template>

<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

import {inject, onMounted, ref} from "vue";
import {LoggerService} from '@/services/logger/logger.service';
import {createRouterBeforeEach} from '@/router/before_each';

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import AppFooter from "@/components/layout/AppFooter.vue";
import dataService from './services/data.service';
import CurrentBlockchain from "@/components/layout/CurrentBlockchain.vue";
import { useRecaptchaProvider } from 'vue-recaptcha/head';

useRecaptchaProvider();
const logger = inject<LoggerService>('logger') as LoggerService;
dataService.onAppStart();
const disclaimerOpen = ref();

onMounted(() => {
  createRouterBeforeEach(logger);
  disclaimerOpen.value = !localStorage.getItem('disclaimer');
});

window.onload = async () =>{
  dataService.onWindowLoad();
};

</script>

<style lang="scss">
@import './styles/app.scss';
</style>
