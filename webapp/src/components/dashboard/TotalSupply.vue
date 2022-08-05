<template>
  <div class="tile">
    <Icon name="Disc"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.TOTAL_SUPPLY') }}</span>
      <span class="value small">{{ tokensStore.totalSupply.getViewAmount()}} {{ tokensStore.totalSupply.getViewDenom() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";

const tokensStore = useTokensStore();

// onBeforeMount(() => {
//   tokensStore.fetchTotalSupply();
// });
</script>

<style scoped lang="scss">
</style>
