<template>
  <div>
    Days:{{ daysLeft }} Hours:{{ hoursLeft }} Minutes:{{ minutesLeft }} Seconds:{{ secondsLeft }}
  </div>
</template>

<script setup lang="ts">
import {useBlockStore} from "@/store/block.store";
import {onUnmounted, ref} from "vue";

const props = defineProps<{
  height: number
}>();

const secondsLeft = ref(0);
const minutesLeft = ref(0);
const hoursLeft = ref(0);
const daysLeft = ref(0);

const intervals = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24
};

let timeHandler = 0;

function calculateSecondsLeft() {
  let lastBlock = 0;
  let secondsLeftLocal = 0;
  if (props.height - lastBlock > 0) {
    timeHandler = setInterval(() => {
        if (lastBlock != useBlockStore().getLatestBlock.height) {
          lastBlock = useBlockStore().getLatestBlock.height;
          secondsLeftLocal = (props.height - lastBlock) * useBlockStore().averageBlockTime;
        } else {
          secondsLeftLocal--;
        }
        if (secondsLeftLocal < 0) {
          clearInterval(timeHandler);
          secondsLeftLocal = 0;
        } else {
          let secondsLeftTemp = secondsLeftLocal;
          daysLeft.value = Math.floor(secondsLeftTemp / intervals.day);
          secondsLeftTemp -= daysLeft.value * intervals.day;
          hoursLeft.value = Math.floor(secondsLeftTemp / intervals.hour);
          secondsLeftTemp -= hoursLeft.value * intervals.hour;
          minutesLeft.value = Math.floor(secondsLeftTemp / intervals.minute);
          secondsLeftTemp -= minutesLeft.value * intervals.minute;
          secondsLeft.value = Math.floor(secondsLeftTemp / intervals.second);
        }
      }, 1000
    );
  }

}

calculateSecondsLeft();

onUnmounted(() => {
  if (timeHandler > 0) {
    clearInterval(timeHandler);
  }
});

// const secondsLeft = computed(() => {
//   if (props.proposalPlan?.height) {
//     return Number(props.proposalPlan?.height) - useBlockStore().getLatestBlock.height < 0;
//   }
//   return false;
// });

</script>

<style scoped>

</style>
