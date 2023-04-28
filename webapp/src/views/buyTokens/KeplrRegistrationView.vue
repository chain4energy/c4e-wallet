<template>
  <div class="registration_container">
    <h3>Keplr registration</h3>
    <div>
      Some information about...
    </div>
    <div>
      <KeplrRegister />
    </div>
  </div>
</template>

<script setup lang="ts">
import KeplrRegister from "@/components/buyTokens/KeplrRegister.vue";
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
