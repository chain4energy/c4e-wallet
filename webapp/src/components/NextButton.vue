<script setup lang="ts">

import IconComponent from "@/components/features/IconComponent.vue";

defineProps<{text: string, icon?: string, disabled?: boolean, color?: string, submit?:string}>();
const emit = defineEmits(['clicked']);
</script>

<template>
  <Button
    :type='submit ? "submit" : "button"'
    :disabled='!!disabled'
    class="min-w-[200px] min-h-[40px] mx-auto w-full sm:w-[70%] rounded-xl py-3 text-center text-lg font-semibold text-white flex justify-center shadow-lg shadow-gray-500 disabled:bg-gray-400" :class="color ? color : 'bg-lime-600'"
    @click="emit('clicked')">
      <IconComponent :name="icon" class="mr-3" v-if="icon"/>{{text}}
  </Button>
</template>

<style scoped lang="scss">

</style>
