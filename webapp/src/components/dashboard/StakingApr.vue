<template>
  <div class="tile">
      <Icon name="Coins"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.STACKING_APR') }}</span>
        <span class="value">{{ useTokensStore().getAprPercentage() }}%</span>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
</script>

<style scoped lang="scss">

</style>
