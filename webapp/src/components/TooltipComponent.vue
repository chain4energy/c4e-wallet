<template>
  <span class="tooltip-icon">
    <span v-tooltip.left="{ value: tooltipText, escape: true }">
      <Icon name="HelpCircle"/>
    </span>
  </span>
</template>

<script setup lang="ts">

const props = defineProps(["tooltipText"]);

</script>

<style scoped lang="scss">


</style>
<style lang="scss">
.tooltip{
  z-index: 1003 !important;

}
</style>
