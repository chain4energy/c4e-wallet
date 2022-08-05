<template>
  <div class="tile">
      <Icon name="FileCheck"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.VALIDATORS') }}</span>
        <span class="value small">{{useValidatorsStore().getNumberOfActiveValidators}}</span>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useValidatorsStore} from "@/store/validators.store";
</script>

<style scoped lang="scss">

</style>
