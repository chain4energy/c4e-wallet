<script setup lang="ts">

import PortfolioVestingLine from "@/components/portfolio/PortfolioVestingLine.vue";
import {useUserStore} from "@/store/user.store";

const userStore = useUserStore();

</script>

<template>

  <div class="portfolioVesting">
    <h2 class="portfolioVesting__header">Vesting details</h2>
    <div class="portfolioVesting__list">
      <div class="portfolioVesting__line">
        <div/>
        <h3>Vesting End</h3>
        <h3>Locked</h3>
        <h3>Time remaining</h3>
      </div>
      <PortfolioVestingLine
        v-for="(item, index) in userStore.getAccountVestingDetails"
        :vesting = 'item'
        :key = index
      />
    </div>
  </div>

</template>

<style scoped lang="scss">

.portfolioVesting {
  width: 70%;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  font-size: 20px;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 30px auto;
  color: white;

  div {
    width: 100%;
  }

  h3 {
    padding: 20px 10px;
  }



  &__header {
    border-bottom: 1px solid #2AFD88;
    padding: 20px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  &__line {
    align-items: center;
    display: grid;
    grid-template-columns: 150px repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
    margin: 20px auto;
  }

  &__tile {
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
}

</style>
