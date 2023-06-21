<script setup lang="ts">

import C4EIcon from "@/components/commons/C4EIcon.vue";
</script>

<template>

  <div class="portfolioSummary">
    <div>
      <C4EIcon size="100" icon="c4e-green"/>
    </div>
    <div class="portfolioSummary__tile">
      <h3>Amount</h3>
      <h4>8,000,000 C4E</h4>
      <h5>$8,000,000</h5>
    </div>
    <div class="portfolioSummary__tile">
      <h3>Locked</h3>
      <h4>8,000,000 C4E</h4>
      <h5>$8,000,000</h5>
    </div>
    <div>
      <Button class="secondary portfolioSummary__button">Send</Button>
    </div>

  </div>

</template>

<style scoped lang="scss">

.portfolioSummary {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;

  div {
    width: 100%;
  }
  h3 {
    padding: 20px 10px;
  }
  h4 {
    padding: 5px;
    font-weight: 800;
  }
  &__button {
    width: 80%;
  }
  &__tile {
    padding: 10px 0 0 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;
    color: white;
    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
  }
}

</style>
