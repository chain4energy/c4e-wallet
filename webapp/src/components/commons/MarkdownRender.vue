<template>
  <VueMarkdown :source="source.replace(new RegExp('\\\\n','g'),'\n')"/>
</template>

<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{
  source: string
}>();
</script>

<style scoped>

</style>
