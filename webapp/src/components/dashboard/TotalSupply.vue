<template>
  <div class="tile">
    <Icon name="Disc"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.TOTAL_SUPPLY') }}</span>
      <CoinAmount :amount="tokensStore.totalSupply" :show-denom="true" class="value small"/>
      <!-- <span class="value small">{{ tokensStore.totalSupply.getViewAmount()}} {{ tokensStore.totalSupply.getViewDenom() }}</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import CoinAmount from "../commons/CoinAmount.vue";

const tokensStore = useTokensStore();
</script>

<style scoped lang="scss">
</style>
