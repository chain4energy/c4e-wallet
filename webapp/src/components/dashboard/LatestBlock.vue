<template>
  <div class="tile">
    <Icon name="TrendingUp"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.MAX_SUPPLY') }}</span>
      <span class="value small">{{ blockStore.getLatestBlockHeight }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {useBlockStore} from "@/store/block.store";


const blockStore = useBlockStore();
// onMounted(() => {

//   blockStore.fetchLatestBlock();
// });

</script>

<style scoped lang="scss">

</style>
