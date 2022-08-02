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

// import {onMounted} from "vue";
import {useValidatorsStore} from "@/store/validators.store";

// onMounted(() => {
//   // useValidatorsStore().fetchNumberOfActiveValidators();
//   useValidatorsStore().fetchValidators();
// });
</script>

<style scoped lang="scss">

</style>
