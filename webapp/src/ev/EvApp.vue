<template>
  <div class="page-container">
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
dataServiceEv.onAppStart();
</script>

<style lang="scss">
@import '.././styles/app.scss';
</style>
