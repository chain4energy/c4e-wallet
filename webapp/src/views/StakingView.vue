<template>
  <span>Staking View</span>
  <div class="card">

    <TabView class="tabview-custom" ref="tabview4">
      <TabPanel>
        <template #header>
          <span>GRUPY TARYFOWE</span>
        </template>
        <tariff-view />
      </TabPanel>
      <TabPanel>
        <template #header>
          <span>CENNIKI</span>
        </template>
        <pricing-view />
      </TabPanel>

    </TabView>

  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
