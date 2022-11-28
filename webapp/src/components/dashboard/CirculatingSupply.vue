<template>
  <div class="tile">
    <Icon name="Circle"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.CIRCULATING_SUPPLY') }}</span>
      <CoinAmount :amount="supply" :show-denom="true" class="value small"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import { computed } from "vue";
import CoinAmount from "../commons/CoinAmount.vue";
const supply = computed(() => useTokensStore().getCirculatingSupply);

</script>

<style scoped lang="scss">

</style>
