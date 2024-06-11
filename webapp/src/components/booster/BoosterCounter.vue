<template>
  <div class="booster">
    <div>
      {{$t('BOOST.COUNTER.STARTS_IN')}}
    </div>
    <div class="booster-container">
      <div class="booster-container__box">
        <div>{{days}}D</div>
<!--        <div>{{$t('BOOST.COUNTER.DAYS')}}</div>-->
      </div>
      <div style="margin:auto">:</div>
      <div class="booster-container__box">
        <div>{{ hours }}H</div>
<!--        <div>{{$t('BOOST.COUNTER.HOURS')}}</div>-->
      </div>
      <div style="margin:auto">:</div>
      <div class="booster-container__box">
        <div>{{ minutes }}M</div>
<!--        <div>{{$t('BOOST.COUNTER.MINUTES')}}</div>-->
      </div>
      <div style="margin:auto">:</div>
      <div class="booster-container__box">
        <div>{{ seconds }}S</div>
        <!--        <div>{{$t('BOOST.COUNTER.MINUTES')}}</div>-->
      </div>
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
.booster {
  font-size: 0.8rem;
  font-weight: bold;
}
.booster-container {
  max-width: 140px;
  padding: 0 5px;
  //max-height: 70px;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  border-radius: 10px;
  background: #72bf44;

  &__box {
    padding: 5px 2px;
  }

}
</style>
