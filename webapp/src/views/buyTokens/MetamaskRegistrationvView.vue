<template>
  <div class="registration_container">
    <h3>Metamask registration</h3>
    <div>
      Some information about...
    </div>
    <div>
      <metamask-register />
    </div>
  </div>
</template>

<script setup lang="ts">
import MetamaskRegister from "@/components/buyTokens/MetamaskRegister.vue";
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
