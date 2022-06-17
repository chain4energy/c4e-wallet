<template>
  <div class="container">
    <div>Average Block Time</div>
    <div class="info">
      {{ blockStore.getAverageBlockTime }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {onBeforeMount} from "vue";
import {useBlockStore} from "@/store/block.store";

const blockStore = useBlockStore();

onBeforeMount(() => {

  blockStore.fetchAverageBlockTime();
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
