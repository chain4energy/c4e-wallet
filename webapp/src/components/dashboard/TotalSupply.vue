<template>
  <div class="container">
    <div class="left">
      <Icon name="Disc"></Icon>
    </div>
    <div class="right">
      <div>{{ $t("DASHBOARD_VIEW.TOTAL_SUPPLY") }}</div>
      <div class="info">
        {{ tokensStore.totalSupply.getViewAmount()}} {{ tokensStore.totalSupply.getViewDenom() }}
      </div>
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
  display: flex;
  max-width: 210px;
  margin: auto auto 30px;
  padding: 15px 10px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);

  .info {
    font-weight:bold;
  }
}
</style>
