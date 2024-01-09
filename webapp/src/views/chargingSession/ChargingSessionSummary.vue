<template>
  <p>Charging summary</p>
  <p>state: {{sessionInfo.state}}</p>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {SessionInfo} from "@/models/sessionInfo";

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
</script>

<style scoped lang="scss">

</style>
