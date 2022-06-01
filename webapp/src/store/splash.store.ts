import { defineStore } from 'pinia';

export const useSplashStore = defineStore({
  id: 'splashStore',
  state: () => {
    return {
      splashCounter: 0
    };
  },
  actions: {
    increment () {
      this.splashCounter++;
    },
    decrement () {
      this.splashCounter--;
      if (this.splashCounter < 0) {
        this.splashCounter = 0;
      }
    }
  },
  getters: {
    splashOn (): boolean {
      return this.splashCounter > 0;
    }
  }
});
