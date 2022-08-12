<template>
  <div class="tile">
      <Icon name="Coins"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.STACKING_APR') }}</span>
        <PercentsView :amount="useTokensStore().getAprPercentage" :precision="2"/>

      </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import PercentsView from "../commons/PercentsView.vue";
</script>

<style scoped lang="scss">

</style>
