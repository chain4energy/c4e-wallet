<template>
  <span>Dashboard View</span>
  <div class="dashboard">
    <dashboard-pools></dashboard-pools>
  </div>

</template>

<script setup lang="ts">

import DashboardPools from "@/components/dashboard/DashboardPools.vue";
</script>

<style scoped lang="scss">

.dashboard{
  max-width: 450px;
  width: 100%;
  margin: auto;

}
</style>
