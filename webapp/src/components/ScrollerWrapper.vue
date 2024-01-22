<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const scrollElement = ref();
const handleScroll = () => {
  if (scrollElement.value) {
    const scrollTop = scrollElement.value.scrollTop;
    const scrollHeight = scrollElement.value.scrollHeight;
    const clientHeight = scrollElement.value.clientHeight;

    // Check if at the top
    atTop.value = scrollTop === 0;

    // Check if at the bottom
    atBottom.value = scrollTop + clientHeight === scrollHeight;
  }
}

const atTop = ref<boolean>(true);
const atBottom = ref<boolean>(true);



</script>

<template>
  <div class="flex flex-col justify-evenly items-center h-full overflow-scroll w-full">
    <span class="w-1/3 h-[5px] mb-2 sm:mb-4" :class="atTop ? 'bg-gray-500' : 'bg-lime-600'"/>
    <div class="w-full flex flex-1 flex-col items-center max-h-full overflow-scroll" ref="scrollElement" @scroll="handleScroll">
      <slot/>
    </div>
    <span class="w-1/3 h-[5px] mt-2 sm:mt-4" :class="atBottom ? 'bg-gray-500' : 'bg-lime-600'"/>
  </div>
</template>

<style scoped>



</style>
