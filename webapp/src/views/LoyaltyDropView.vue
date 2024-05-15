<template>
  <h4 class="m-4">{{$t('BOOST.TITLE')}}</h4>
  <LoyaltyDropDataTable/>
  <Button class="outlined" @click="withdraw">
    <StakeManagementIcon icon="manage"/>Withdraw all available
    {{ $t('BOOST.TABLE.MANAGE') }}
  </Button>
</template>

<script setup lang="ts">

import LoyaltyDropDataTable from "@/components/loyaltyDrop/LoyaltyDropDataTable.vue";
import {onMounted, onUnmounted} from "vue";
import dataService from "@/services/data.service";
import StakeManagementIcon from "@/components/commons/StakeManagementIcon.vue";


onMounted(() => {
  dataService.onLoyaltyDropSelected();
});

onUnmounted(() => {
  dataService.onLoyaltyDropUnselected();
});

async function withdraw(){
  await dataService.onVestingPoolWithdrawAllAvailable();
}

</script>

<style scoped>
h4 {
  font-weight: bold;
  margin-top: 2em !important;
}
</style>
