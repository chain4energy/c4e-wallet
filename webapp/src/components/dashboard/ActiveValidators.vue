<template>
  <div class="tile">
      <Icon name="FileCheck"></Icon>
      <div class="text">
        <span class="label">{{ $t('DASHBOARD_VIEW.VALIDATORS') }}</span>
        <FormattedNumber class="value small" :amount="useValidatorsStore().getNumberOfActiveValidators" :precision="0"/>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useValidatorsStore} from "@/store/validators.store";
import FormattedNumber from "../commons/FormattedNumber.vue";
</script>

<style scoped lang="scss">

</style>
