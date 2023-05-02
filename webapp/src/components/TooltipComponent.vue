<template>
  <div class="tooltip-icon">
    <div v-tooltip="{ value: tooltipText, escape: true }">
      <Icon name="HelpCircle"/>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps(["tooltipText"]);

</script>

<style scoped>
</style>
