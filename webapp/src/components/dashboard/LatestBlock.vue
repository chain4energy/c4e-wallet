<template>
  <div class="container">
    <div>Latest Block</div>
    <div class="info">
      {{ blockStore.getLatestBlockHeight }}
    </div>

  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {useBlockStore} from "@/store/block.store";


const blockStore = useBlockStore();
onMounted(() => {

  blockStore.fetchLatestBlock();
});

</script>

<style scoped lang="scss">
.container {

  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);

  .info {
    font-weight:bold;
  }
}
</style>
