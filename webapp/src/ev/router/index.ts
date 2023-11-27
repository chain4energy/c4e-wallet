import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {resetPasswordRoutes} from "@/ev/router/resetPasswordRoutes";

const subAppName ="ev";


const routesEv: Array<RouteRecordRaw> = [
  {
    path: '/' + subAppName,
    name: "",
    redirect: '/' + subAppName + '/infoPage',
  },
  {
    path: '/' + subAppName + '/infoPage',
    name: subAppName + '_InfoPage',
    component: () => import(/* webpackChunkName: "InfoPage" */ '@/ev/views/InfoPage.vue')
  },
  {
    path: '/' + subAppName + '/about',
    name: subAppName + '_About',
    component: () => import(/* webpackChunkName: "AboutView" */ '@/ev/views/AboutView.vue')
  },
  {
    path: '/' + subAppName + '/resourceLink/:context(.*)*',
    name: subAppName + '_ResourceLink',
    component: () => import(/* webpackChunkName: "ResourceLink" */ '@/ev/views/ResourceLink.vue')
  },
  {
    path: '/' + subAppName + '/qrCode/:context(.*)*',
    name: subAppName + '_QrCode',
    component: () => import(/* webpackChunkName: "QrCode" */ '@/ev/views/QrCode.vue')
  },
  {
    path: '/' + subAppName + '/startCharging',
    name: subAppName + '_StartCharging',
    component: () => import(/* webpackChunkName: "StartChargingProvideEmail" */ '@/ev/views/StartChargingProvideEmail.vue')
  },
  {
    path: '/' + subAppName + '/startChargingCheckEmail',
    name: subAppName + '_StartChargingCheckEmail',
    component: () => import(/* webpackChunkName: "StartChargingProvideEmail" */ '@/ev/views/StartChargingCheckEmail.vue')
  },
  {
    path: '/' + subAppName + '/sessionInfo',
    name: subAppName + '_ChargingSession',
    component: () => import(/* webpackChunkName: "StartChargingProvideEmail" */ '@/ev/views/ChargingSession.vue')
  },
  {
    path: '/' + subAppName + '/choosePaymentMethod',
    name: subAppName + '_ChoosePaymentMethod',
    component: () => import(/* webpackChunkName: "ChoosePaymentMethod" */ '@/ev/views/ChoosePaymentMethod.vue')
  },
  {
    path: '/' + subAppName + '/waitForPaymentConfirmation',
    name: subAppName + '_WaitForPaymentConfirmation',
    component: () => import(/* webpackChunkName: "WaitForPaymentConfirmation" */ '@/ev/views/WaitForPaymentConfirmation.vue')
  },
  {
    path: '/' + subAppName + '/startChargingSession',
    name: subAppName + '_StartChargingSession',
    component: () => import(/* webpackChunkName: "StartChargingSession" */ '@/ev/views/StartChargingSession.vue')
  },
  {
    path: '/' + subAppName + '/paymentRejected',
    name: subAppName + '_PaymentRejected',
    component: () => import(/* webpackChunkName: "PaymentRejected" */ '@/ev/views/PaymentRejected.vue')
  },
  {
    path: '/' + subAppName + '/mockPayment',
    name: subAppName + '_MockPayment',
    component: () => import(/* webpackChunkName: "MockPayment" */ '@/ev/views/MockPayment.vue')
  },
  {
    path: '/' + subAppName + '/signIn',
    name: subAppName + '_SignInView',
    component: () => import(/* webpackChunkName: "SignInView" */ '@/ev/views/profile/SignInView.vue')
  },
  {
    path: '/' + subAppName + '/signUp',
    name: subAppName + '_SignUpView',
    component: () => import(/* webpackChunkName: "SignUpView" */ '@/ev/views/profile/SignUpView.vue')
  },
  {
    path: '/' + subAppName + '/activate',
    name: subAppName + '_Activate',
    component: () => import(/* webpackChunkName: "ActivateView" */ '@/ev/views/profile/ActivateView.vue')
  },
  {
    path: '/' + subAppName + '/owner',
    name: subAppName + '_OwnerView',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/OwnerView.vue')
  },
  ... resetPasswordRoutes
  },
  {
    path: '/' + subAppName + '/addCharger',
    name: subAppName + '_AddCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/AddCharger.vue')
  },
  {
    path: '/' + subAppName + '/singleCharger/:id',
    name: subAppName + '_SingleCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/SingleCharger.vue')
  }
];

export const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
