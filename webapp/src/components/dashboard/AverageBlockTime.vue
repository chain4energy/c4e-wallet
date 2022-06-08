<template>
  <div class="container">
    <div>Average Block Time</div>
    <div class="info">
      {{ useAverageBlockTime().getAverageBlockTime }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import AverageBlockTimeService from "@/services/average-block-time.service";
import {useAverageBlockTime} from "@/store/average-block-time.store";
const averageBlockTimeService = new AverageBlockTimeService();

onMounted(() => {
  averageBlockTimeService.getDataToStore();

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
