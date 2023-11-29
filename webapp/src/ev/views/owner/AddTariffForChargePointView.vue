<template>
  <h2>Add New Tariff For Charge Point</h2>
  <AddTariffForChargePointC @on-success="goTo_AddChargerView()"/>
</template>

<script setup lang="ts">

import AddTariffForChargePointC from "@/ev/components/AddTariffForChargePointC.vue";
import {goTo_AddChargerView} from "@/ev/router/goToRoute";
</script>

<style scoped>

</style>
