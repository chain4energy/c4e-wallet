// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import vuetify from './plugins/vuetify';
// import { loadFonts } from './plugins/webfontloader';
//
// loadFonts();
//
// createApp(App)
//   .use(router)
//   .use(vuetify)
//   .mount('#app');
//

import { createPinia } from 'pinia';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import 'bootstrap/scss/bootstrap.scss';
// import CountryFlag from 'vue-country-flag-next';// https://www.npmjs.com/package/vue-country-flag-next
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faCheck, faGlobe, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // https://github.com/FortAwesome/vue-fontawesome
import Toast, {PluginOptions, POSITION, TYPE} from 'vue-toastification'; // https://openbase.com/js/vue-toastification
import 'vue-toastification/dist/index.css';
// import vuetify from './plugins/vuetify';
import i18n from '@/plugins/i18n';
// https://github.com/eladcandroid/v-idle-3
// import Vidle from 'v-idle-3';
import { LoggerService } from '@/services/logger/logger.service';
// https://www.primefaces.org/primevue/setup
import PrimeVue from 'primevue/config';
import VueSvgInlinePlugin from "vue-svg-inline-plugin";
import "vue-svg-inline-plugin/src/polyfills";

// https://www.npmjs.com/package/vue-sidebar-menu
// import VueSidebarMenu from 'vue-sidebar-menu'
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Image from 'primevue/image';
import AutoComplete from "primevue/autocomplete";
import Dropdown from "primevue/dropdown";
import Loading from "vue-loading-overlay";

import piniaPersist from 'pinia-plugin-persist';
//https://www.npmjs.com/package/vue-debounce
import { vue3Debounce } from 'vue-debounce';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import IconComponent from "@/components/features/IconComponent.vue";
import ECharts from 'vue-echarts';
import Tooltip from 'primevue/tooltip';
import AccordionTab from "primevue/accordiontab";
import Accordion from "primevue/accordion";
// import {createI18n} from "vue-i18n";
import "./styles/toasts.scss";
import SuccessIcon from "@/components/features/SuccessIcon.vue";
import ErrorIcon from "@/components/features/ErrorIcon.vue";
import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VueRecaptchaPlugin } from 'vue-recaptcha/head'


// Lucide Icons
// https://github.com/lucide-icons/lucide/tree/master/packages/lucide-vue-next#lucide-vue-next

// library.add(faGlobe, faCheck, faTimes);

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

(BigInt.prototype as any).toJSON = function () {
  return {value: this.toString(), type: "bigint"} ;
};
function reviver2(key:any, value:any) {
  if (value && value.type == 'bigint') {
    return BigInt(value.value);
  }
  return value;
}
const originalJSONParse = JSON.parse;
JSON.parse = function parse(text: string, reviver?: (this: any, key: string, value: any) => any): any {
  if(reviver) {
    return originalJSONParse(text, reviver);
  }

  return originalJSONParse(text, reviver2);
};


const pinia = createPinia();
pinia.use(piniaPersist);
const logger = new LoggerService();
// const i18n = createI18n({
//   legacy: false
// });
const app = createApp(App);

app.use(router)
  .use(pinia)
  .use(i18n)
  .use(Toast, toastOptions)
  // .use(vuetify)
  .use(PrimeVue)
  // .use(Vidle)
  .use(VueSvgInlinePlugin)
  .use(VueRecaptchaPlugin, {
    v2SiteKey: '6Lc2fTYmAAAAAEQSYDkeecH1xPPvVD3T1UrBbpac'
   })
  .provide('logger', logger)
  .component('Button', Button)
  .component('InputText', InputText)
  .component('DataTable', DataTable)
  .component('Column', Column)
  .component('AutoComplete', AutoComplete)
  .component('Dropdown', Dropdown)
  .component('Image' , Image)
  .component('Accordion', Accordion)
  .component('AccordionTab', AccordionTab)
  .component('Icon', IconComponent)
  .component('loading', Loading)
  .component('v-chart', ECharts)
  .directive('debounce', vue3Debounce({lock: true}))
  .directive('tooltip', Tooltip)
  // .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

// app.config.errorHandler = (err, instance, info) => {
//   logger.logToConsole(LogLevel.ERROR, ServiceTypeEnum.GLOBAL_ERROR_HANDLER, 'ErrorHandler', JSON.stringify(err), info);
// };
