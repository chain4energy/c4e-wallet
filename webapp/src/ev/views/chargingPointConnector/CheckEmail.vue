<template>
  <p>we sent an email to:</p>
  <p>{{ providedEmail }}</p>
  <p>Please check your email</p>
</template>
<script setup lang="ts">

const props = defineProps({
    providedEmail: {
      type: String,
      required: true
    }
  }
);

</script>

<style scoped lang="scss">

</style>
