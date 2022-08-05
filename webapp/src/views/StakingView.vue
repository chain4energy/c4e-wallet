<template>
  <div>
    <!-- <div>{{accType}}</div> -->
    <router-view/>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
