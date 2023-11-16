import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
    path: '/' + subAppName + '/mockStream',
    name: subAppName + '_MockedStream',
    component: () => import(/* webpackChunkName: "MockPayment" */ '@/ev/views/MockedStream.vue')
  }
];

export const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
