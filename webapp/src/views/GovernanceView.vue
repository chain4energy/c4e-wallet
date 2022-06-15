<template>
  <keep-alive>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </keep-alive>
</template>

<script setup lang="ts">

import ProposalsList from "@/components/governance/ProposalsList.vue";



</script>

<style scoped>

</style>
