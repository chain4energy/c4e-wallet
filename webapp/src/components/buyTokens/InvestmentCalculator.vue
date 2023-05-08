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

    </div>
    <Button class="p-button p-component secondary" style="width: 141px;" @click="router.push({name: 'accountType'})">Buy</Button>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import { reactive, ref, watch } from "vue";
import {Form, Field} from "vee-validate";

const currencyExchangeRate = defineProps<{
  rate: number
}>();

const calculator = reactive({
  c4e: 0,
  usdc: 0,
});
const c4e = ref();
const usdc = ref();

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
  }
  &__inputContainer{
    text-align: start;
    margin-right: 104px;
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
