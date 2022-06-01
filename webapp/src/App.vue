<template>
  <div class="page-container">
    <loading-screen/>
    <app-header/>
    <div class="main-container">
      <div class="content">
        <router-view/>
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

import {inject, onMounted} from 'vue';
import {LoggerService} from '@/services/logger/logger.service';
import {createRouterBeforeEach} from '@/router/before_each';

import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import AppFooter from "@/components/layout/AppFooter.vue";

const logger = inject<LoggerService>('logger') as LoggerService;

onMounted(() => createRouterBeforeEach(logger));

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
    padding-right: 100px;

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
</style>
