<template>
  <div class="tile">
      <Icon name="TrendingUp"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.INFLATION') }}</span>
        <span class="value">{{ useTokensStore().getInflationPercentage() }}%</span>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";

</script>

<style scoped lang="scss">

</style>
