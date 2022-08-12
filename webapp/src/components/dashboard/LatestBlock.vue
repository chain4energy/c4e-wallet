<template>
  <div class="tile">
    <Icon name="TrendingUp"></Icon>
    <div class="text">
      <span class="label">{{ $t('DASHBOARD_VIEW.LATEST_BLOCK') }}</span>
      <FormattedNumber class="value small" :amount="blockStore.getLatestBlockHeight" :precision="0"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useBlockStore} from "@/store/block.store";
import FormattedNumber from "../commons/FormattedNumber.vue";
const blockStore = useBlockStore();
</script>

<style scoped lang="scss">

</style>
