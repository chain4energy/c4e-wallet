<template>
  <sessionInfoC v-if="sessionInfo" :session-info="sessionInfo"></sessionInfoC>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useEvStore} from "@/store/ev.store";
import SessionInfoC from "@/ev/components/SessionInfoC.vue";

const evStore = useEvStore();
const sessionInfo = computed(() => evStore.getSessionInfo);

onMounted(async () => {
  evStore.fetchSessionInfo()
})
</script>


<style scoped lang="scss">

</style>
