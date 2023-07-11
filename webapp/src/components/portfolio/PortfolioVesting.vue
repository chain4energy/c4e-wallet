

<template>

  <div class="portfolioVesting" v-if ='accountType === 5 || accountType === 2'>
    <h2 class="portfolioVesting__header">{{$t("PORTFOLIO_VIEW.DETAILS")}}</h2>
    <div class="portfolioVesting__list"
         v-if="userStore.getAccountVestingDetails && filterVestingArray(userStore.getAccountVestingDetails).length
         ||
         contVestingDetails && filterVestingArray(contVestingDetails).length"
    >
      <div class="portfolioVesting__line">
        <div class="mobile-hidden"/>
        <h3 class="start-date">{{$t("PORTFOLIO_VIEW.START_DATE")}}</h3>
        <h3 class="end-date">{{$t("PORTFOLIO_VIEW.END_DATE")}}</h3>
        <h3>{{$t("PORTFOLIO_VIEW.LOCKED")}}</h3>
        <h3>{{$t("PORTFOLIO_VIEW.TIME")}}</h3>
      </div>
      <!-- Periodic vesting -->
      <div v-if ='accountType === 5'>
        <PortfolioVestingLine
          v-for="(item, index) in filterVestingArray(userStore.getAccountVestingDetails)"
          :vesting = 'item'
          :key = index
        />
      </div>
      <!-- Continuous vesting -->
      <div v-else-if="accountType === 2">
        <PortfolioVestingLine
          v-for="(item, index) in filterVestingArray(contVestingDetails)"
          :vesting = 'item'
          :key = index
        />
      </div>

    </div>
    <h3 v-else>
      {{$t("PORTFOLIO_VIEW.NO_ACTIVE")}}
    </h3>
  </div>

</template>

<script setup lang="ts">

/*

 */

import PortfolioVestingLine from "@/components/portfolio/PortfolioVestingLine.vue";
import {useUserStore} from "@/store/user.store";
import {VestingPeriods} from "@/models/store/account";
import {computed} from "vue";
import {Coin} from "@/models/store/common";

const userStore = useUserStore();

const continuousVestingData = computed(() => userStore.getAccount.continuousVestingData);
const accountType = computed(() => userStore.getAccountType);

// variable changing format of continuousVestingData to the same type like vesting period to ise the same component
let contVestingDetails = computed(() => {
  if (continuousVestingData.value) {
    return [{
      startTime: continuousVestingData.value.startTime.getTime() / 1000,
      endTime: continuousVestingData.value.endTime.getTime() / 1000,
      amount: continuousVestingData.value.originalVesting
    }];
  }
  else return [];
});

// filter completed vestings and sort them
const filterVestingArray = (array: VestingPeriods[] | undefined) => {
  return array?.filter(element => {
    return new Date(element.endTime*1000).getTime() - Date.now() > 0;
  }).sort((a,b) => a.endTime - b.endTime);
};


const fakeVestings: VestingPeriods[] = [
  {
    startTime: 1687770000,
    endTime: 1687857660,
    amount: [
      new Coin(30000n, 'uc4e')
    ]
  }
];



</script>

<style scoped lang="scss">

.portfolioVesting {
  width: 75%;
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
    padding: 5px;
    margin: 0 auto;
  }

  h3, h4 {
    font-size: 1.25rem;
  }



  &__header {
    border-bottom: 1px solid #2AFD88;
    padding: 20px;
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 1.5rem;
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

@media screen and (width<1500px) {
  .mobile-hidden {
    display: none;
  }
  .portfolioVesting h3{
    font-size: 1rem !important;
  }
  .portfolioVesting__line {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

@media screen and (width<1024px) {
  .portfolioVesting {
    width: 95%;
  }
}

@media screen and (width<850px) {
  .end-date {
    display: none;
  }
}

@media screen and (width<520px) {
  .start-date {
    display: none;
  }
}


</style>
