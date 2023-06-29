<template>
  <div class="calculatorC4E">

  </div>
</template>

<script setup lang="ts">
const currencyExchangeRate = defineProps<{
  rate: number
}>();
</script>

<style scoped lang="scss">
.calculatorC4E{
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 10px 33px;
  border-radius: 5px;
  align-items: center;
}
</style>
