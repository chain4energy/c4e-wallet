<script setup lang="ts">
import IconComponent from "@/components/features/IconComponent.vue";
const emit=defineEmits(['back','close', 'hamburger']);
const props = defineProps<{hamburger?: boolean}>()
</script>

<template>
<div class="w-full flex flex-inline justify-between p-3 px-5 sm:px-8 mb-5">
  <IconComponent name="Undo2" @click="emit('back')" class="hover:text-lime-600 transition cursor-pointer"/>
  <IconComponent v-if='hamburger' name="Menu" @click="emit('hamburger')" class="hover:text-lime-600 transition cursor-pointer"/>
  <IconComponent v-else name="X" @click="emit('close')" class="hover:text-lime-600 transition cursor-pointer"/>

</div>
</template>

<style scoped lang="scss">

</style>
