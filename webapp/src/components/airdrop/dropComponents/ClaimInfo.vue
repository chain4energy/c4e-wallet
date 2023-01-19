<template>
<div class="claimInfo">
  <p>{{props.header}}</p>
  <slot class="claimInfo__slot"></slot>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  header: string,
}>();
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
.claimInfo{
  background-color: #013C6C;
  padding: 3.5px 13px;
  box-shadow: 0px 0px 2px 2px #02447A;
  border-radius: 2px;
  &__slot{
    margin: 0;
  }
  p{
    font-weight: 400;
    font-size: 12px;
    line-height: 15px
  }
}

</style>
