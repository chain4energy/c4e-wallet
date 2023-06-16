<template>
  <div class="tile" style="text-align: left;">

    <div style="display:flex; flex-direction: row; " class="text left-element">
      <Icon name="Coins"></Icon>
      <div>
        <span class="label">{{ $t('DASHBOARD_VIEW.STACKING_APR') }}</span>
        <PercentsView :amount="useTokensStore().getAprPercentage" :precision="2"/>
      </div>

    </div>
    <div class="text right-element">
      <span class="label">{{ $t('DASHBOARD_VIEW.TARGET_STACKING_APR') }}</span>
      <PercentsView :amount="useTokensStore().getAprPercentage * useConfigurationStore().config.targetInflationAprMultiplier" :precision="2"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import PercentsView from "../commons/PercentsView.vue";
import {useConfigurationStore} from "@/store/configuration.store";</script>

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
