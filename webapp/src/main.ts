import {createApp} from "vue";
import routerEv from "@/router";
import i18n from "@/plugins/i18n";
import { createPinia } from 'pinia';
import piniaPersist from "pinia-plugin-persist";

import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import 'vue-toastification/dist/index.css';
import "@/assets/tailwind.css";

import PrimeVue from "primevue/config";
import Toast, {PluginOptions, POSITION, TYPE} from "vue-toastification";
import SuccessIcon from "@/components/features/SuccessIcon.vue";
import ErrorIcon from "@/components/features/ErrorIcon.vue";
import {LoggerService} from "@/services/logger/logger.service";
import EvApp from "./EvApp.vue";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";

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

const logger = LoggerService.getInstance();

const pinia = createPinia();
pinia.use(piniaPersist);

console.log("start ev/main.ts");
const appEv = createApp(EvApp);

appEv.use(routerEv)
    .use(pinia)
    .use(i18n)
    .use(PrimeVue)
    .use(Toast, toastOptions)
    .provide('logger', logger)
  .component('Card', Card)
  .component('Button', Button)
  .component('InputText', InputText)
  .component('Checkbox', Checkbox)
  .component('Dropdown', Dropdown)
;
appEv.mount('#app');
