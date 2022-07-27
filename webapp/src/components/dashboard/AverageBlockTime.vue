<template>
  <div class="container">
    <div>{{ $t("DASHBOARD_VIEW.AVERAGE_BLOCK_TIME") }}</div>
    <div class="info">
      {{ blockStore.getAverageBlockTimeView() }}s
    </div>
  </div>
</template>

<script setup lang="ts">

// import {onBeforeMount} from "vue";
import {useBlockStore} from "@/store/block.store";

const blockStore = useBlockStore();

// onBeforeMount(() => {

//   blockStore.fetchAverageBlockTime();
// });

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
