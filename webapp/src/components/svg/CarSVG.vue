<script setup lang="ts">
const props = defineProps<{charger?: boolean}>()
</script>

<template>
<div class="w-full relative">
  <img v-svg-inline :src="require('@/assets/svg/carCharger.svg')" alt="Charging car" v-if="charger"/>
  <img v-svg-inline :src="require('@/assets/svg/car.svg')" alt="Car" v-else/>
  <slot/>
</div>
</template>

<style scoped lang="scss">

</style>
