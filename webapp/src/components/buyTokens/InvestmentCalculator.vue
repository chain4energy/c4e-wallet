<template>
  <div class="box-shadow">
    calculator
    <Button class="p-button p-component secondary" @click="router.push({name: 'accountType'})">Buy</Button>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";

const router = useRouter();
</script>

<style scoped>

</style>
