<template>
  <span class="font-[Audiowide] text-lime-600 text-4xl text-center">Waiting for payment</span>
  <div class="w-1/3 mx-auto">
    <HourglassSVG class="gelatine elastic-spin text-lime-600"/>
  </div>
  <div/>
</template>

<script setup lang="ts">
// import {PropType} from "vue";
// import {SessionInfo} from "@/models/sessionInfo";
import HourglassSVG from "@/components/svg/HourglassSVG.vue";

const emit = defineEmits(['initPayment']);

// const props = defineProps({
//   sessionInfo: {
//     type: Object as PropType<SessionInfo> ,
//     required: false
//   },
// });

</script>

<style scoped lang="scss">
.gelatine {
  animation: gelatine 0.5s infinite;
}
@keyframes gelatine {
  from, to { transform: scale(1, 1); }
  25% { transform: scale(0.9, 1.1); }
  50% { transform: scale(1.1, 0.9); }
  75% { transform: scale(0.95, 1.05); }
}

.elastic-spin {
  animation: elastic-spin 3s infinite ease;
}
@keyframes elastic-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(720deg); }
}
</style>
