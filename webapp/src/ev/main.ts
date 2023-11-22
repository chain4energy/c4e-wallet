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

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import component from "*.vue";
import IconComponent from "@/components/features/IconComponent.vue";
import PrimeVue from "primevue/config";
import RadioButton from "primevue/radiobutton";


const pinia = createPinia();
pinia.use(piniaPersist);

console.log("start ev/main.ts")
const appEv = createApp(EvApp);

appEv.use(routerEv)
  .use(pinia)
  .use(i18n)
  .use(PrimeVue)
  .component('Icon', IconComponent)
  .component('Button', Button)
  .component('InputText', InputText)
  .component('Card', Card)
  .component('Tag', Tag)
  .component('RadioButton', RadioButton)
  ;
appEv.mount('#app');
