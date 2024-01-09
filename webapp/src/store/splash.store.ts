import { defineStore } from 'pinia';
import {computed, ref, watch} from "vue";
import {debounce} from "vue-debounce";

export const useSplashStore = defineStore('SplashStore', () => {
  const splashCounter = ref(0);
  const splashState = ref(false);

  function increment() {
    splashCounter.value++;
  }
  function decrement() {
    splashCounter.value--;
  }
  const splashOn = computed(() => splashState.value);

  const checkSplash = computed(() => splashCounter.value > 0);

  const debouncedWatcher = debounce((newVal: boolean) => {
    splashState.value = newVal;
  }, 20);

  watch(() => checkSplash.value, (newVal) => {
    debouncedWatcher(newVal);
  });
  return {increment, decrement, splashOn, checkSplash, splashCounter};
});
