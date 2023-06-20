<script setup lang="ts">

import C4EIcon from "@/components/commons/C4EIcon.vue";

export interface IVestingLine {
  vestingEndDate: string,
  vestingC4EFunds: number,
  vestingUSDFunds: number,
}

const props = defineProps<IVestingLine>();

</script>

<template>

  <div class="portfolioVesting__line">
    <div>
      <C4EIcon size="75" icon="c4e-green"/>
    </div>
    <div class="portfolioVesting__tile">
      <h3>{{ props.vestingEndDate }}</h3>
    </div>
    <div class="portfolioVesting__tile">
      <h4>{{ props.vestingC4EFunds }} C4E</h4>
      <h5>${{ props.vestingUSDFunds }}</h5>
    </div>
    <div class="portfolioVesting__tile">
      <h3>10 days</h3>
    </div>
  </div>

</template>

<style scoped lang="scss">

.portfolioVesting__tile {
    height: 100%;

    padding: 10px 0 0 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;

    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
}

.portfolioVesting__line {
  align-items: center;
  display: grid;
  grid-template-columns: 150px repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  margin: 20px auto;
}

h4 {
  padding: 5px;
  font-weight: 800;
}

</style>

