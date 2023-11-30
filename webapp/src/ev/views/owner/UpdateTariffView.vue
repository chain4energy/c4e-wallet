<template>
  <h2>Update tariff</h2>
  <AddTariffC :is-edit="true" @on-success="goTo_ChargePointView()"/>
</template>

<script setup lang="ts">
import AddTariffC from "@/ev/components/AddTariffC.vue";
import {goTo_ChargePointView, goTo_TariffGroupsView} from "@/ev/router/goToRoute";

</script>


<style scoped lang="scss">

</style>
