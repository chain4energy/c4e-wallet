<template>

<!--  <h4 class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h4>-->
  <h4 class="m-0">Active pools</h4>

  <BoostDataTable :validators="useValidatorsStore().getValidators" :type="ValidatorsDataTableType.VALIDATORS"/>
</template>

<script setup lang="ts">

import {useValidatorsStore} from "@/store/validators.store";
import {ValidatorsDataTableType} from "@/components/staking/ValidatorsDataTable";
import BoostDataTable from "@/components/boost/BoostDataTable.vue";

</script>

<style scoped>
h4 {
  font-weight: bold;
  margin-top: 2em !important;
}
</style>
