<template>
  <div class="container">
    <div>Total supply</div>
    <div class="info">
      {{ tokensStore.totalSupply.amount}}  {{ tokensStore.totalSupply.denom }}

    </div>

  </div>
</template>

<script setup lang="ts">

import {onBeforeMount} from "vue";
import {useTokensStore} from "@/store/tokens.store";

const tokensStore = useTokensStore();

onBeforeMount(() => {
  tokensStore.fetchTotalSupply();
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
