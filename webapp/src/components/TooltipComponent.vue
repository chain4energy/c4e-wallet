<template>
  <span class="tooltip-icon">
    <span v-tooltip="{ value: tooltipText, escape: true }">
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
.p-tooltip{
  z-index: 1003 !important;

}
</style>
