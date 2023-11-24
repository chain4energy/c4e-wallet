import {createApp} from "vue";
import EvApp from './EvApp.vue';
import routerEv from "@/ev/router";
import i18n from "@/ev/plugins/i18n";
import { createPinia } from 'pinia';
import piniaPersist from "pinia-plugin-persist";

import 'bootstrap/scss/bootstrap.scss';
import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import 'vue-toastification/dist/index.css';

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import component from "*.vue";
import IconComponent from "@/components/features/IconComponent.vue";
import PrimeVue from "primevue/config";
import RadioButton from "primevue/radiobutton";
import Toast, {PluginOptions, POSITION, TYPE} from "vue-toastification";
import SuccessIcon from "@/components/features/SuccessIcon.vue";
import ErrorIcon from "@/components/features/ErrorIcon.vue";

const toastOptions: PluginOptions = {
  // You can set your default options here
  position: POSITION.BOTTOM_RIGHT,
  toastDefaults: {
    [TYPE.SUCCESS]: {
      icon: SuccessIcon,
    },
    [TYPE.ERROR]: {
      icon: ErrorIcon,
    },
  }

};

const pinia = createPinia();
pinia.use(piniaPersist);

console.log("start ev/main.ts")
const appEv = createApp(EvApp);

appEv.use(routerEv)
  .use(pinia)
  .use(i18n)
  .use(PrimeVue)
  .use(Toast, toastOptions)
  .component('Icon', IconComponent)
  .component('Button', Button)
  .component('InputText', InputText)
  .component('Card', Card)
  .component('Tag', Tag)
  .component('RadioButton', RadioButton)
  ;
appEv.mount('#app');
