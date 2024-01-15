<script setup lang="ts">

import {computed, ref} from "vue";
import IconComponent from "@/components/features/IconComponent.vue";
import BackCloseBar from "@/components/BackCloseBar.vue";
import {Tariff} from "@/models/tariff";

const priceList = computed(() => {
  if (props.tariff.currency === 'PLN') {
    return [50, 75, 100];
  }
  else {
    return [10, 20, 30];
  }
});

const selectedPrice = ref();

const emit = defineEmits(['next', 'back'])
const props = defineProps<{tariff: Tariff}>();

</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] h-full p-2 sm:p-5 flex flex-col justify-between">
      <div class="w-full text-center">
        <BackCloseBar @back="emit('back')"/>
        <span class="font-[Audiowide] text-lime-600 text-3xl">Select amount</span>
      </div>
      <div class="flex flex-col">
        <div class="w-[80%] border-2 border-lime-600 rounded-xl shadow-xl mx-auto my-2 py-2 font-semibold flex flex-inline justify-center items-center transition-all duration-300"
             :class="selectedPrice === price ? 'bg-lime-600 text-white' : ''"
             v-for="price in priceList" :key="price" @click="selectedPrice = price"
        >
          <div class="w-[150px] text-right">
            <span class="font-[SevenSegment] text-[40px] mr-1 font-normal">{{price}}</span>
            <span>{{props.tariff.currency}}</span>
          </div>
          <div class="border-t-2 w-[30px] h-[1px] mx-4 transition-all duration-300" :class="selectedPrice === price ? 'border-white' : 'border-black'"/>
          <div class="w-[150px] text-left">
            <span class="font-[SevenSegment] text-[40px] mr-1 font-normal">{{ (price / Number(tariff.unitCost)).toFixed(1) }}</span>
            <span>{{tariff.unit}}</span>
          </div>
        </div>
      </div>
      <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center disabled:bg-gray-400" :disabled='!selectedPrice' @click="emit('next')"><IconComponent name="Check" class="mr-3"/>Accept</Button>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
