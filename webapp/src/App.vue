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

import { inject, onBeforeMount, onMounted } from "vue";
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
      useUserStore().reconectAcc();
  },500);
});

</script>

<style lang="scss">
@import './styles/app.scss';
</style>
