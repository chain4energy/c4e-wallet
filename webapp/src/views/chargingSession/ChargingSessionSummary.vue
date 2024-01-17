<template>
  <span class="font-[Audiowide] text-lime-600 text-4xl text-center">{{$t('HEADERS.SUMMARY')}}</span>
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
