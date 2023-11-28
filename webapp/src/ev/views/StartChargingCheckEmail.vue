<template>
  <p>we sent an email to:</p>
  <p>{{ evStore.userEmail }}</p>
  <p>Please check your email</p>
</template>
<script setup lang="ts">
import {useEvStore} from "@/ev/store/ev.store";
const evStore = useEvStore();
</script>

<style scoped lang="scss">

</style>
