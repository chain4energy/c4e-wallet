<template>
  <div class="container">
    <div>Latest Block</div>
    <div class="info">
      {{ useLatestBlockStore().getLatestBlock }}
    </div>

  </div>
</template>

<script setup lang="ts">

import {useLatestBlockStore} from "@/store/latest-block.store";
import LatestBlockService from "@/services/latest-block.service";
import {onMounted} from "vue";

const latestBlockService = new LatestBlockService();

onMounted(() => {
  latestBlockService.getDataToStore();

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
