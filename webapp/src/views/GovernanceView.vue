<template>
  <keep-alive>
    <router-view v-slot="{ Component }">
      <keep-alive include="ProposalsList">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </keep-alive>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
