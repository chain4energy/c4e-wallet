<template>
  <div class="container">
    <div>Validators</div>
    <div class="info">
      {{useActiveValidatorsStore().getActiveValidators}}
    </div>

  </div>
</template>

<script setup lang="ts">

import ActiveValidatorsService from "@/services/active-validators.service";
import {onMounted} from "vue";
import {useActiveValidatorsStore} from "@/store/active-validators.store";

const activeValidatorsService = new ActiveValidatorsService();

onMounted(() => {

  activeValidatorsService.getDataToStore();
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
