<template>
  <h1>Oczekiwanie na potwierdzenie płatności</h1>
  <span class="loader"></span>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useSessionStorage} from "@vueuse/core";
import {useRouter} from "vue-router";

const router = useRouter();

onMounted(() => {
  const context = useSessionStorage("context", {}) ;
  console.log("context: " + context);
  router.push({name:'ev_SessionLink',params:{context:context.value as string[] | undefined}});
});

</script>

<style scoped lang="scss">
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: #FF3D00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
