<template>
  <div class="container">
    <div class="left">
      <Icon name="TrendingUp"></Icon>
    </div>
    <div class="right">
      <div>{{ $t("DASHBOARD_VIEW.LATEST_BLOCK") }}</div>
      <div class="info">
        {{ blockStore.getLatestBlockHeight }}
      </div>
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
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  max-width: 210px;
  margin: auto auto 30px;
  .info {
    font-weight:bold;
  }
}
</style>
