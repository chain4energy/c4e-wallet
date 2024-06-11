<template>
  <img v-if="validator.description.pictureUrl && !imageLoadingError" class="c4e-validator-image" :src="validator.description.pictureUrl" @error="setAltImg"/>
</template>

<script setup lang="ts">
import { ValidatorBase } from '@/models/store/validator.js';
import {ref} from "vue";
const imageLoadingError = ref(false);

const props = defineProps<{
  validator: ValidatorBase,
}>();

function setAltImg(event:any) {
  imageLoadingError.value = true;
  console.log("(Img) Validator " + props.validator.description.moniker + " has wrong imag url. Cannot get content. Skipping. " + props.validator.description.pictureUrl);
}

</script>
<style scoped>
.c4e-validator-image {
  border-radius: 50%;
  max-height: 100%;
  max-width: 100%;
  background-size: contain;
  box-shadow: 0 0 3px 0 #b7bdc3;
  margin-right: 0.5rem;
  height: 2.5rem;
  /* min-height: 2.5rem; */
  width: 2.5rem;
  /* min-width: 2.5rem;  */
}
</style>
