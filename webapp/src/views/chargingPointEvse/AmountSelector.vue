<template>
  <div class="w-full text-center">
    <BackCloseBar @back="emit('back')" hide-right/>
    <span class="font-[Audiowide] text-lime-600 text-4xl">{{$t('HEADERS.SELECT_AMOUNT')}}</span>
  </div>
  <div class="flex flex-inline flex-wrap gap-2">
    <div class="w-[40%] sm:w-[80%] border-2 border-lime-600 rounded-xl shadow-lg shadow-gray-500 mx-auto my-2 p-2 font-semibold flex flex-col justify-center items-center transition-all duration-300"
         :class="selectedPrice === price ? 'bg-lime-600 text-white' : ''"
         v-for="price in priceList" :key="price" @click="() => {selectedPrice = price;}"
    >
      <div class="w-full text-center">
        <span class="font-[SevenSegment] text-[40px] sm:text-[50px] mr-1 font-normal">{{price}}</span>
        <span>{{tariff.currency}}</span>
      </div>
      <div class="w-full text-center flex flex-inline items-center justify-center gap-2 text-xs py-2 border-t border-black/50 ">
        <span class="font-[SevenSegment] text-[20px] sm:text-[25px] -mr-1 font-normal">~ {{ (price / Number(tariff.unitCost)).toFixed(1) }}</span>
        <span class="self-end">{{tariff.unit}}</span>
      </div>
    </div>
  </div>
  <div/>
  <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center disabled:bg-gray-400" :disabled='!selectedPrice' @click="emit('next', selectedPrice)"><IconComponent name="Check" class="mr-3"/>{{$t('COMMON.ACCEPT')}}</Button>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import BackCloseBar from "@/components/BackCloseBar.vue";
import {Tariff} from "@/models/tariff";
import IconComponent from "@/components/features/IconComponent.vue";

const emit = defineEmits(['next', 'back']);
const props = defineProps<{tariff: Tariff}>();

const selectedPrice = ref();

const priceList = computed(() => {
  if (props.tariff.currency === 'PLN') {
    return [50, 75, 100, 150];
  }
  else {
    return [20, 30, 40, 50];
  }
});
</script>

<style scoped lang="scss">

</style>
