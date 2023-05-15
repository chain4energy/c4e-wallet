<template>
  <div class="registration_container">
    <h3>Email login</h3>
    <div>
      Some information about...
    </div>
    <div>
      <email-register  :is-register="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmailRegister from "@/components/buyTokens/EmailRegister.vue";
</script>

<style scoped lang="scss">

.registration_container {
  font-weight: 500;
  text-align: start;
  padding: 30px;
  h3 {
    font-weight: 700;
  }
}

</style>
