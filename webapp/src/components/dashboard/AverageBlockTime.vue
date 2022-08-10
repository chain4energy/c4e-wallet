<template>
  <div class="tile">
      <Icon name="Clock"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.AVERAGE_BLOCK_TIME') }}</span>
        <span class="value small">{{ blockStore.getAverageBlockTimeView() }}s</span>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useBlockStore} from "@/store/block.store";

const blockStore = useBlockStore();
</script>

<style scoped lang="scss">
.container {

  max-width: 210px;
  margin: auto auto 30px;
  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);

  .info {
    font-weight:bold;
  }
}
</style>
