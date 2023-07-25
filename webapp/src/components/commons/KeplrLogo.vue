<template>
  <span :class="props?.reverseColors ?'keplr-logoReversed' :'keplr-logo'">{{ letter }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  reverseColors?: false,
  letter: string
}>();

</script>
<style scoped lang="scss">
@import '../../styles/variables.scss';

.keplr-logo {
  padding: 0 7px;
  border-radius: 5px;
  color: $main-color;
  background-color: $secondary-color;
  box-sizing: border-box;
  font-weight: bold;
  margin-right: 10px;
}
.keplr-logoReversed {
  padding: 0 7px;
  border-radius: 5px;
  color: $secondary-color;
  background-color: $main-color;
  box-sizing: border-box;
  font-weight: bold;
  margin-right: 10px;
}

</style>
