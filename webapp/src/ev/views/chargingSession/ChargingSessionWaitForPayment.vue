<template>
  <h1>Waiting for payment</h1>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {SessionInfo} from "@/ev/models/sessionInfo";

const emit = defineEmits(['initPayment']);

const props = defineProps({
  sessionInfo: {
    type: Object as PropType<SessionInfo> ,
    required: false
  },
});

</script>

<style scoped lang="scss">

</style>
