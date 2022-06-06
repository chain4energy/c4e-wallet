<template>
  <div class="container">
    <div>Total supply</div>
    <div class="info">
      {{useTotalSupplyStore().getTotalSupply.amount}}  {{useTotalSupplyStore().getTotalSupply.denom}}
    </div>

  </div>
</template>

<script setup lang="ts">


import TotalSupplyService from "@/services/total-supply.service";
import {onMounted} from "vue";
import {useTotalSupplyStore} from "@/store/total-supply.store";

const totalSupplyService = new TotalSupplyService();

onMounted(() => {
  totalSupplyService.getDataToStore();
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
