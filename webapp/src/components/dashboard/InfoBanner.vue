<template>
  <div class="tile">
    <div style="display:flex; flex-direction: row; text-align:left" class="text left-element">
        Boost your money
<!--      <Button icon="pi pi-times" style="width: 20px; right:0" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />-->
      <Button
        @click="dataService.onKeplrLogIn()" class="p-button-raised p-button-rounded">
        <KeplrLogo letter="K" /> Go to BOOST NOW !!!
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import PercentsView from "../commons/PercentsView.vue";
import {useConfigurationStore} from "@/store/configuration.store";
import StakeManagementIcon from "@/components/commons/StakeManagementIcon.vue";
import dataService from "@/services/data.service";
import KeplrLogo from "@/components/commons/KeplrLogo.vue";</script>

<style scoped lang="scss">
.left-element {
  padding-right: 20px;
  width: 50%;
  box-sizing: border-box;
}

.right-element {
  padding-left: 20px;
  border-left: 1px solid;
}
</style>
