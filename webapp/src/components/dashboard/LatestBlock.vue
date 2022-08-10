<template>
  <div class="tile">
    <Icon name="TrendingUp"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.LATEST_BLOCK') }}</span>
      <span class="value small">{{ blockStore.getLatestBlockHeight }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useBlockStore} from "@/store/block.store";
const blockStore = useBlockStore();
</script>

<style scoped lang="scss">

</style>
