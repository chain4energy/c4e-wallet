<template>
  <div>
    {{ dateToString(calculateDate) }} ( {{ $t("GOVERNANCE_VIEW.LOCAL_TIME") }} )
  </div>
</template>

<script setup lang="ts">
import {useBlockStore} from "@/store/block.store";
import {computed} from "vue";
import {padStartZero} from "@/utils/number-formatter";

const props = defineProps<{
  height: number
}>();

const calculateDate = computed((): Date | null => {
  const secondsLeftLocal = (props.height - useBlockStore().getLatestBlock.height) * useBlockStore().averageBlockTime;
  if (secondsLeftLocal > 0) {
    let t = new Date();
    t.setSeconds(t.getSeconds() + secondsLeftLocal);
    return t;
  }
  return null;
});

function dateToString(date: Date): string {
  if (!date) {
    return "";
  }
  const day = date.getDate();
  const monthIndex = date.getMonth() + 1;
  const year = date.getFullYear();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  return '' + year + '.' + padStartZero(monthIndex, 2) + '.' + padStartZero(day, 2) + ' '
    + padStartZero(hours, 2) + ':' + padStartZero(minutes, 2) + ':' + padStartZero(seconds, 2);
}

</script>

<style scoped>

</style>
