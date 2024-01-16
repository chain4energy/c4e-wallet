<script setup lang="ts">

import IconComponent from "@/components/features/IconComponent.vue";

const props = defineProps<{text: string, icon?: string, disabled?: boolean}>();
const emit = defineEmits(['clicked'])
</script>

<template>
  <Button :disabled='!!disabled' class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-lg font-semibold text-white flex justify-center shadow-lg shadow-gray-500 disabled:bg-gray-400" @click="emit('clicked')"><IconComponent :name="icon" class="mr-3" v-if="icon"/>{{text}}</Button>
</template>

<style scoped lang="scss">

</style>
