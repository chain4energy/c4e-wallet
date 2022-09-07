<template>
  <div class="tile">
    <Icon name="Disc"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.TOTAL_SUPPLY') }}</span>
      <CoinAmount :amount="tokensStore.totalSupply" :show-denom="true" class="value small"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import CoinAmount from "../commons/CoinAmount.vue";
import {useTokensStore} from "@/store/tokens.store";

const tokensStore = useTokensStore();
</script>

<style scoped lang="scss">
</style>
