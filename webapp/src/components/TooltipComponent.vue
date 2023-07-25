<template>
  <span @click="onLinkClick()" class="tooltip-icon" :class="{ 'pointer': tooltipLink }">
    {{text}}
    <slot name="text"></slot>
    <span v-tooltip.left="{ value: tooltipText, escape: true }">
      <Icon name="HelpCircle"/>
    </span>
  </span>
</template>

<script setup lang="ts">

const props = defineProps({
  tooltipText: String,
  tooltipLink: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  }
});

const onLinkClick = () => {
  if(props.tooltipLink) {
    window.open(props.tooltipLink, '_blank');
  }

};
</script>


<style scoped lang="scss">


</style>
<style lang="scss">
.tooltip{
  z-index: 1003 !important;

}
.pointer {
  cursor: pointer;
}
</style>
