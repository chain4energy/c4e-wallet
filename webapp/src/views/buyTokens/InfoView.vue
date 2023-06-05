<template>
  <div class="info">
    <PublicSaleInfo />
    <div class="info__details">
      <h2>Chain4Energy token sale</h2>
      <p>Natenczas Wojski chwycił na taśmie przypięty Swój róg bawoli, długi, cętkowany,<br>
        kręty Jak wąż boa, oburącz do ust go przycisnął, Wzdął policzki jak banię, w oczach krwią zabłysnął,<br>
        Zasunął wpół powieki, wciągnął w głąb pół brzucha I do płuc wysłał z niego cały zapas ducha.<br>
        I zagrał: róg jak wicher niewstrzymanym dechem Niesie w puszczę muzykę i podwaja echem.<br>
        Umilkli strzelce, stali szczwacze zadziwieni Mocą, czystością, dziwną harmoniją pieni.<br>
        Starzec cały kunszt, którym niegdyś w lasach słynął, Jeszcze raz przed uszami myśliwców rozwinął;<br>
        Napełnił wnet, ożywił knieje i dąbrowy, Jakby psiarnię w nie wpuścił i rozpoczął łowy.<br>
        Bo w graniu była łowów historyja krótka: Zrazu odzew dźwięczący, rześki - to pobudka;<br>
        Potem jęki po jękach skomlą - to psów granie; A gdzieniegdzie ton twardszy jak grzmot - to strzelanie.<br>
        Tu przerwał, lecz róg trzymał; wszystkim się zdawało, Że Wojski wciąż gra jeszcze, a to echo grało.</p>
    </div>
    <InvestmentCalculator />
    <div v-for="items in transactions" :key="items" class="userProfile__holder">
      <AllocationInfo :transaction="items" @pay="onPay(items)"/>
    </div>
  </div>
  <PayModal v-model:display="showModal" v-model:reservation="selectedReservation" @close="showModal = false" />
</template>

<script lang="ts" setup>

import PublicSaleInfo from "@/components/buyTokens/PublicSaleInfo.vue";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import {computed, onBeforeMount, ref} from "vue";
import AllocationInfo from "@/components/transactions/AllocationInfo.vue";
import PayModal from "@/components/buyTokens/PayModal.vue";

onBeforeMount(() => {
  usePublicSalesStore().fetchTokenReservations();
});

const publicSalesStore = usePublicSalesStore();
publicSalesStore.setParts();
publicSalesStore.setTotal();
publicSalesStore.setCurrentPrice();
const currency = computed(() => {
  return publicSalesStore.getC4eToUSDC;
});

const transactions = computed(() => {
  return usePublicSalesStore().getTransactions;
});
const showModal = ref<boolean>(false);
const selectedReservation = ref();
const onPay = (transaction: TokenReservation) => {
  selectedReservation.value = transaction;
  showModal.value = true;

};
</script>

<style scoped lang="scss">
.info{
  padding: 25px 54px;
  &__details{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 36px;
    h2{
      font-family: 'Poppins',sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #000000;
    }
    p{
      text-align: start;
      font-family: 'Poppins',sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
  }
}

</style>
