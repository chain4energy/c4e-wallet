<template>
    <div class="page-container">
      <loading-screen/>
      <div class="main-container">
        <div class="content">
          <router-view/>
        </div>
      </div>
=    </div>
</template>

<script setup lang="ts">
import dataServiceEv from "@/services/dataEv.service";
import LoadingScreen from "@/components/LoadingScreen.vue";
import {inject, onMounted} from "vue";
import {LoggerService} from "@/services/logger/logger.service";
import {createRouterBeforeEach} from "@/router/before_each";

const logger = inject<LoggerService>('logger') as LoggerService;
dataServiceEv.onAppStart();

onMounted(() => {
  createRouterBeforeEach(logger);
});

window.onload = async () =>{
  // dataServiceEv.onWindowLoad();
};

</script>

<style lang="scss">
</style>
