<template>
  <component :is="icon" />
</template>

<script>
import * as icons from "lucide-vue-next";
import {computed} from "vue";

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const icon = computed(() => icons[props.name]);
    return { icon };
  }
};
</script>
