<template>
  <div class="container">
    <div>Validators</div>
    <div class="info">
      {{useValidatorsStore().getActiveValidators}}
    </div>

  </div>
</template>

<script setup lang="ts">

import {onMounted} from "vue";
import {useValidatorsStore} from "@/store/validators.store";

onMounted(() => {
  useValidatorsStore().fetchNumberOfActiveValidators();
});
</script>

<style scoped lang="scss">
.container {

  flex-wrap: wrap;
  padding: 15px 10px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);

  .info {
    font-weight:bold;
  }
}
</style>
