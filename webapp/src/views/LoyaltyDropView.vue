<template>
  <h4 class="m-4">{{$t('BOOST.TITLE')}}</h4>
  <LoyaltyDropDataTable/>
</template>

<script setup lang="ts">

import LoyaltyDropDataTable from "@/components/loyaltyDrop/LoyaltyDropDataTable.vue";
import {onMounted, onUnmounted} from "vue";
import dataService from "@/services/data.service";


onMounted(() => {
  dataService.onLoyaltyDropSelected();
});

onUnmounted(() => {
  dataService.onLoyaltyDropUnselected();
});

</script>

<style scoped>
h4 {
  font-weight: bold;
  margin-top: 2em !important;
}
</style>
