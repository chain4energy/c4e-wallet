import {createApp} from "vue";
import EvApp from './EvApp.vue';
import routerEv from "@/ev/router";
import i18n from "@/ev/plugins/i18n";
import { createPinia } from 'pinia';
import piniaPersist from "pinia-plugin-persist";

import 'bootstrap/scss/bootstrap.scss';

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import component from "*.vue";
import IconComponent from "@/components/features/IconComponent.vue";


const pinia = createPinia();
pinia.use(piniaPersist);

console.log("start ev/main.ts")
const appEv = createApp(EvApp);

appEv.use(routerEv)
  .use(pinia)
  .use(i18n)
  .component('Icon', IconComponent)
  .component('Button', Button)
  .component('InputText', InputText);
appEv.mount('#app');
