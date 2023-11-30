<template>
  <div class="page-container">
    <loading-screen/>
    <app-header/>
    <div class="main-container">
      <div class="content">
        <router-view />
      </div>
    </div>
    <CurrentBlockchain></CurrentBlockchain>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import dataServiceEv from "@/ev/services/dataEv.service";
import CurrentBlockchain from "@/components/layout/CurrentBlockchain.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
dataServiceEv.onAppStart();
</script>

<style lang="scss">
@import '.././styles/app.scss';
</style>
