<template>
  <div class="tooltip-icon">
    <Card v-tooltip="{ value: tooltipText, escape: true }">
      <Icon name="HelpCircle"/>
    </Card>
  </div>
</template>

<script setup lang="ts">

const props = defineProps(["tooltipText"]);

</script>

<style scoped>
</style>
