<template>
  <span @click="onLinkClick()" class="tooltip-icon" :class="{ 'pointer': tooltipLink }">
    <span v-tooltip.left="{ value: tooltipText, escape: true }">
      {{text}}
      <slot/>
      <Icon name="HelpCircle" style="margin-left: 5px;"/>
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
