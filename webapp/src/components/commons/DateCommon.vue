<template>
<span>{{trueDate}}</span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  date: Date
}>();

const trueDate = computed(()=> {
  let date = new Date(props.date);
  return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
});
</script>

<style scoped lang="scss">
p{
  margin: 0;
}

</style>
