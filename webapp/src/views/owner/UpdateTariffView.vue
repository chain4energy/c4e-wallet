<template>
  <h2>Update tariff</h2>
  <AddTariffC :is-edit="true" @on-success="goTo_ChargePointView()"/>
</template>

<script setup lang="ts">
import AddTariffC from "@/components/AddTariffC.vue";
import {goTo_ChargePointView} from "@/router/goToRoute";

</script>


<style scoped lang="scss">

</style>
