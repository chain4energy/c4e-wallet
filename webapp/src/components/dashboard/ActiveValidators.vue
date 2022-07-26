<template>
  <div class="container">
    <div class="left">
      <Icon name="FileCheck"></Icon>
    </div>
    <div class="right">
      <div>{{ $t("DASHBOARD_VIEW.VALIDATORS") }} </div>
      <div class="info">
        {{useValidatorsStore().getNumberOfActiveValidators}}
      </div>
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
.container {
  display: flex;
  max-width: 210px;
  margin: auto auto 30px;
  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;

  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);

  .info {
    font-weight:bold;
  }
}
</style>
