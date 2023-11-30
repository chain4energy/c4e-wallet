<template>
  <p>Charging summary</p>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {SessionInfo} from "@/ev/models/sessionInfo";

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});
</script>

<style scoped lang="scss">

</style>
