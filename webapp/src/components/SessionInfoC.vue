<template>
  <Card class="content">
    <template #title>Session state: {{ sessionInfo.state }}</template>
    <template #content>

    </template>
  </Card>
</template>


<script setup lang="ts">
import {SessionInfo} from "@/models/sessionInfo";

defineProps({
    sessionInfo: {
      type: Object as () => SessionInfo,
      required: true
    }
  }
);
</script>

<style scoped lang="scss">
.content {
  fill: rgba(153, 232, 14, 0.50);
  filter: drop-shadow(0px 0px 32px rgba(112, 112, 112, 0.50));
}
</style>
