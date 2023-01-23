import { defineStore } from 'pinia';

interface SplashState {
  splashCounter: number,
  splashOnLocal: boolean
}

export const useSplashStore = defineStore({
  id: 'splashStore',
  state: (): SplashState => {
    return {
      splashCounter: 0,
      splashOnLocal: false
    };
  },
  actions: {
    increment () {
      this.splashCounter++;
      this.splashOnLocal = true;
    },
    decrement () {
      this.splashCounter--;
      if (this.splashCounter < 1) {
        this.splashCounter = 0;
        this.splashOnLocal = false;
      }
    }
  },
  getters: {
    splashOn (): boolean {
      console.log("splashOn:" + this.splashOnLocal);
      return this.splashOnLocal;
    }
  }
});
