<template>
  <div class="booster-container">
    <div class="booster-container__box">
      <div>{{days}}</div>
      <div>Days</div>
    </div>
    <div style="margin:auto">:</div>
    <div class="booster-container__box">
      <div>{{ hours }}</div>
      <div>Hours</div>
    </div>
    <div style="margin:auto">:</div>
    <div class="booster-container__box">
      <div>{{ minutes }}</div>
      <div>Mins</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  startDate: {
    type: Date,
    required: true
  },
});

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const interval = ref();

const calculateTimeRemaining = () => {
  const now = new Date();
  const difference = props.startDate?.getTime() - now.getTime();

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24);
    minutes.value = Math.floor((difference / 1000 / 60) % 60);
    seconds.value = Math.floor((difference / 1000) % 60);
  } else {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    clearInterval(interval.value);
  }
};

onMounted(() => {
  calculateTimeRemaining();
  interval.value = setInterval(calculateTimeRemaining, 1000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>



<style scoped lang="scss">
.booster-container {
  max-width: 200px;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(90,55,142,1) 0%, rgba(79,22,139,1) 35%, rgba(134,32,162,1) 100%);

  &__box {
    padding: 10px;
  }

}
</style>
