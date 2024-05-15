<template>

<!--  <h4 class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h4>-->
  <h4 class="m-4">{{$t('BOOST.TITLE')}}</h4>

  <BoostDataTable/>
</template>

<script setup lang="ts">

import BoostDataTable from "@/components/boost/BoostDataTable.vue";

</script>

<style scoped>
h4 {
  font-weight: bold;
  margin-top: 2em !important;
}
</style>
