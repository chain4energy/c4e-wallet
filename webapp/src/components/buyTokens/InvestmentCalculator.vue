<template>
  <div class="calculatorC4E">
    <div class="calculatorC4E__header">Calculate investment</div>
    <div class="calculatorC4E__body">
      <div class="calculatorC4E__inputContainer">
        <p>I want to buy</p>
        <div>
          <input class="calculatorC4E__input" type="text" v-model="calculator.c4e">
          C4E
        </div>
      </div>

      <div class="calculatorC4E__inputContainer">
        <div>
          <p>I want to invest</p>
          <input class="calculatorC4E__input" type="text" v-model="calculator.usdc">
          USD
        </div>
      </div>
      <div class="calculatorC4E__btnSection">
        <p>Required</p>
        <p>terms acceptance</p>
        <p>proof of residence</p>
        <Button class="p-button p-component secondary" style="width: 141px;" @click="summaryVisible=true">Buy</Button>
      </div>

    </div>
    <Dialog v-model:visible="summaryVisible" closeIcon="false" modal header="Summary" :style="{ width: '95vw', 'max-width': '600px' }">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;">
        <div>
          Amount: {{c4e}} C4E
        </div>
        <div>
          Price: {{usdc}} USD
        </div>
        <div style="display: flex">
          <Button class="p-button p-component secondary" @click="summaryVisible=false">Close</Button>
          <Button class="p-button p-component secondary" @click="onBuy">Confirm</Button>
        </div>
      </div>

    </Dialog>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import { reactive, ref, watch } from "vue";
import {Form, Field} from "vee-validate";
import {useSaleServiceStore} from "@/store/saleService.store";
import Dialog from 'primevue/dialog';

const currencyExchangeRate = defineProps<{
  rate: number
}>();

const calculator = reactive({
  c4e: 0,
  usdc: 0,
});
const c4e = ref();
const usdc = ref();
const summaryVisible = ref(false);

watch(calculator, (next)=>{
  if(next.c4e != c4e.value){
    c4e.value = next.c4e;
    calculator.usdc = c4e.value * currencyExchangeRate.rate;
    usdc.value= calculator.usdc;
  } else if(calculator.usdc != usdc.value){
    usdc.value = calculator.usdc;
    calculator.c4e = usdc.value / currencyExchangeRate.rate;
    c4e.value = calculator.c4e;
  }
});

const router = useRouter();
const saleStore = useSaleServiceStore();
const onBuy = () => {
  console.log(usdc.value);
  saleStore.reserveTokens(usdc.value);
};
</script>

<style scoped lang="scss">
.calculatorC4E{
  margin-top: 29px;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 32px 33px 26px 116px;
  border-radius: 5px;
  &__header{
    width: 100%;
    text-align: left;
    font-weight: 700;
    font-size: 29px;
    line-height: 35px;
  }
  &__body{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__inputContainer{
    text-align: start;
    margin-right: 104px;
  }
  &__btnSection{
    display: flex;
    flex-direction: column;
  }
  &__input{
    padding: 20px 10px;
    background: #FFFFFF;
    border: 1px solid #81CF1F;
    border-radius: 8px;
    text-align: end;

    &:focus-visible{
      border: 1px solid #81CF1F;
    }
    &:focus{
      border: 1px solid #81CF1F;
    }
    &:hover{
      border: 1px solid #81CF1F;
    }

  }
}
</style>
