<template>
<span v-tooltip="{ value: retrieveConvertedTime(), disabled:!props.showTooltip, class:'coin-amount-tooltip'}">
  {{trueDate}}
</span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  date: {
    type: [Date, Number],
    required: true
  },
  showTime: {
    type: Boolean,
    default: true,
    required: false
  },
  showTooltip: {
    type: Boolean,
    required: false,
    default: false
  }
});

const trueDate = computed(()=> {
  let date = new Date(props.date);
  if(!props.showTime) {
    return date.toLocaleDateString('fr-CH');
  }
  return date.toLocaleDateString('fr-CH') + ', ' + date.toLocaleTimeString();
});

const retrieveConvertedTime = () => {
  let date = new Date(props.date);
  return date.toLocaleDateString('fr-CH') + ', ' + date.toLocaleTimeString();
};
</script>

<style scoped lang="scss">
p{
  margin: 0;
}

</style>
