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

const emit = defineEmits(['next', 'back']);
const props = defineProps<{tariff: Tariff}>();

</script>

<template>
      <div class="w-full text-center">
        <BackCloseBar @back="emit('back')"/>
        <span class="font-[Audiowide] text-lime-600 text-4xl">{{$t('HEADERS.SELECT_AMOUNT')}}</span>
      </div>
      <div class="flex flex-col">
        <div class="w-[95%] sm:w-[80%] border-2 border-lime-600 rounded-xl shadow-lg shadow-gray-500 mx-auto my-2 p-2 font-semibold flex flex-inline justify-center items-center transition-all duration-300"
             :class="selectedPrice === price ? 'bg-lime-600 text-white' : ''"
             v-for="price in priceList" :key="price" @click="() => {selectedPrice = price; emit('next', selectedPrice)}"
        >
          <div class="w-[150px] text-right">
            <span class="font-[SevenSegment] text-[32px] sm:text-[40px] mr-1 font-normal">{{price}}</span>
            <span>{{tariff.currency}}</span>
          </div>
          <div class="border-t-2 w-[30px] h-[1px] mx-4 transition-all duration-300" :class="selectedPrice === price ? 'border-white' : 'border-black'"/>
          <div class="w-[150px] text-left">
            <span class="font-[SevenSegment] text-[32px] sm:text-[40px] mr-1 font-normal">{{ (price / Number(tariff.unitCost)).toFixed(1) }}</span>
            <span>{{tariff.unit}}</span>
          </div>
        </div>
      </div>
  <div/>
<!--      <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center disabled:bg-gray-400" :disabled='!selectedPrice' @click="emit('next', selectedPrice)"><IconComponent name="Check" class="mr-3"/>{{$t('COMMON.ACCEPT')}}</Button>-->
</template>

<style scoped lang="scss">

</style>
