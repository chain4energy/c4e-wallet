<template>
  <div class="tile">
    <Icon name="TrendingUp"></Icon>
    <div class="text left-element">
      <span class="label">{{ $t('DASHBOARD_VIEW.INFLATION') }}</span>
      <PercentsView :amount="useTokensStore().inflation" :precision="2"/>
    </div>
    <div class="text right-element">
      <span class="label">{{ $t('DASHBOARD_VIEW.TARGET_INFLATION') }}</span>
      <PercentsView :amount="useTokensStore().inflation * useConfigurationStore().config.targetInflationAprMultiplier" :precision="2"/>
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
}

.right-element {
  padding-left: 20px;
  border-left: 1px solid;
}
</style>
