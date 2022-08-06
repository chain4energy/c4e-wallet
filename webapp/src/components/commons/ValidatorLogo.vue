<template>
  <img v-if="validator.description.pictureUrl" :class="`validator-image-local ` + getClass()" :src="validator.description.pictureUrl"/>
</template>

<script setup lang="ts">
import { ValidatorBase } from '@/models/store/validator.js';

const props = defineProps<{
  validator: ValidatorBase,
  class?: string
}>();

function getClass() {
  if (props.class) {
    return props.class;
  }
  return ''
}

</script>
<style scoped>
.validator-image-local {
  border-radius: 50%;
  max-height: 100%;
  max-width: 100%;
  background-size: contain;
  box-shadow: 0 0 3px 0 #b7bdc3;
  margin-right: 0.5rem;
}
</style>
