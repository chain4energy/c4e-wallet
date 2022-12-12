<template>
  <div class="countDown">
    <!--<div v-for="digits in timeModel" :key="digits">
      <div v-for="hundreds in digits.digits" :key="hundreds">{{hundreds}}</div>
      <div v-for="dec in digits.digits" :key="dec">{{dec}}</div>
      <div v-for="sec in digits.digits" :key="sec">{{sec}}</div>
    </div>-->
    <div class="countDown__items" v-if="showItems.year">
      <div>YY:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.year.split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.year.split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.year.split('')[2] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        :
      </div>
    </div>
    <div class="countDown__items" v-if="showItems.month">
      <div>M:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.month.split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.month.split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        :
      </div>
    </div>
    <div class="countDown__items" v-if="showItems.day">
      <div>D:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.days.toString().split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.days.toString().split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        :
      </div>
    </div>
    <div class="countDown__items">
      <div>H:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.hours.toString().split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.hours.toString().split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        :
      </div>
    </div>
    <div class="countDown__items">
      <div>M:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.min.toString().split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.min.toString().split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        :
      </div>
    </div>
    <div class="countDown__items">
      <div>S:</div>
      <div class="countDown__items-secondsContainer">
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.sec.toString().split('')[0] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="countDown__items-seconds">
          <div v-for="unit in timeModel" :key="unit">
            <transition name="slide-up" mode="out-in">
              <div v-if="time.sec.toString().split('')[1] === unit">
                <div class="countDown__number">
                  <p>{{unit}}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  endTime: Date,
}>();

const showItems = ref({
  year: false,
  month: false,
  day: false,
});

const timeModel = ref(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ]);

const time = ref({
  sec: '',
  min: '',
  hours: '',
  days: '',
  month:'',
  year: ''
});

function getTime(){
  let today = props.endTime - Date.now();
  if(today < 0){
    time.value = {
      sec: '00',
      min: '00',
      hours: '00',
      days: '00',
      month: '00',
      year:'000',
    };
  } else {
    let res = new Date(today);
    let y = res.getUTCFullYear() -1970;
    time.value = {
      year : setDecYear(y),
      month : setDecTime(res.getUTCMonth()),
      days : setDecTime(res.getUTCDate() - 1),
      hours : setDecTime(res.getUTCHours()),
      min : setDecTime(res.getUTCMinutes()),
      sec : setDecTime(res.getUTCSeconds()),
    };
    requestAnimationFrame(getTime);
    if(time.value.year !== '000'){
      showItems.value.year = true;
      showItems.value.month = true;
      showItems.value.day = true;
    } else if(time.value.year ==='000' && time.value.month !== '00'){
      showItems.value.year = false;
      showItems.value.month = true;
      showItems.value.day = true;
    } else if(time.value.year ==='000' && time.value.month === '00' && time.value.days !== '00'){
      showItems.value.year = false;
      showItems.value.month = false;
      showItems.value.day = true;
    } else {
      showItems.value.year = false;
      showItems.value.month = false;
      showItems.value.day = false;
    }
  }
}


getTime();

function setDecTime(val: number){
  if(val < 10){
    return `0${val}`;
  } else {
    return `${val}`;
  }
}
function setDecYear(val: number){
  if(val < 10){
    return time.value.year = `00${val}`;
  } else if(val > 10 && val< 100){
    return time.value.year = `0${val}`;
  } else {
    return time.value.year = val.toString();
  }
}

</script>

<style scoped lang="scss">
.countDown{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &__items{
    display: flex;
    flex-direction: column;
    align-items: center;
    &-secondsContainer{
      justify-content: space-between;
      display: flex;
      flex-direction: row;
    }
    &-seconds{
      position: relative;
      width: 10px;
      flex-direction: row;
    }
  }
  &__number{
    position: absolute;
    text-decoration: underline;

  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.1s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

</style>
