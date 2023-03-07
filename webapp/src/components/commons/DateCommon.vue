<template>
<span v-tooltip="{ value: retrieveConvertedTime(), disabled:!props.showTooltip, class:'coin-amount-tooltip'}">
  {{trueDate}}
</span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  date: Date,
  showTime: {
    type: boolean,
    default: true,
    required: false
  },
  showTooltip: {
    type : boolean,
    required: false,
    default: false
  },
}>();

const trueDate = computed(()=> {
  let date = new Date(props.date);
  if(!props.showTime) {
    return date.toLocaleDateString();
  }
  return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
});

const retrieveConvertedTime = () => {
  let date = new Date(props.date);
  return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
};
</script>

<style scoped lang="scss">
p{
  margin: 0;
}

</style>
