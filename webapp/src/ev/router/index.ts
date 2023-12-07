import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {resetPasswordRoutes} from "@/ev/router/resetPasswordRoutes";
import {ownerRoutes} from "@/ev/router/ownerRoutes";

export const evSubAppName ="ev";


const routesEv: Array<RouteRecordRaw> = [
  {
    path: '/' + evSubAppName,
    name: "",
    redirect: '/' + evSubAppName + '/signIn',
  },
  {
    path: '/' + evSubAppName + '/resourceLink/:context(.*)*',
    name: evSubAppName + '_ResourceLink',
    component: () => import(/* webpackChunkName: "ResourceLinkNew" */ '@/ev/views/ResourceLink.vue'),
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/sessionLink/:context(.*)*',
    name: evSubAppName + '_SessionLink',
    component: () => import(/* webpackChunkName: "ResourceLink" */ '@/ev/views/ChargingSessionView.vue'),
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/chargePointConnector/:context(.*)*',
    name: evSubAppName + '_ChargePointConnector',
    component: () => import(/* webpackChunkName: "ChargePointConnectorView" */ '@/ev/views/ChargePointConnectorView.vue'),
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/sessionInfo',
    name: evSubAppName + '_ChargingSession',
    component: () => import(/* webpackChunkName: "StartChargingProvideEmail" */ '@/ev/views/ChargingSessionView.vue')
  },
  {
    path: '/' + evSubAppName + '/choosePaymentMethod',
    name: evSubAppName + '_ChoosePaymentMethod',
    component: () => import(/* webpackChunkName: "ChoosePaymentMethod" */ '@/ev/views/ChoosePaymentMethod.vue')
  },
  {
    path: '/' + evSubAppName + '/waitForPaymentConfirmation',
    name: evSubAppName + '_WaitForPaymentConfirmation',
    component: () => import(/* webpackChunkName: "WaitForPaymentConfirmation" */ '@/ev/views/WaitForPaymentConfirmation.vue')
  },
  // {
  //   path: '/' + evSubAppName + '/startChargingSession',
  //   name: evSubAppName + '_StartChargingSession',
  //   component: () => import(/* webpackChunkName: "StartChargingSession" */ '@/ev/views/StartChargingSessionView.vue')
  // },
  {
    path: '/' + evSubAppName + '/paymentRejected',
    name: evSubAppName + '_PaymentRejected',
    component: () => import(/* webpackChunkName: "PaymentRejected" */ '@/ev/views/PaymentRejected.vue')
  },
  {
    path: '/' + evSubAppName + '/mockPayment',
    name: evSubAppName + '_MockPayment',
    component: () => import(/* webpackChunkName: "MockPayment" */ '@/ev/views/MockPayment.vue')
  },
  {
    path: '/' + evSubAppName + '/signIn',
    name: evSubAppName + '_SignInView',
    component: () => import(/* webpackChunkName: "SignInView" */ '@/ev/views/profile/SignInView.vue')
  },
  {
    path: '/' + evSubAppName + '/signUp',
    name: evSubAppName + '_SignUpView',
    component: () => import(/* webpackChunkName: "SignUpView" */ '@/ev/views/profile/SignUpView.vue')
  },
  {
    path: '/' + evSubAppName + '/activate',
    name: evSubAppName + '_Activate',
    component: () => import(/* webpackChunkName: "ActivateView" */ '@/ev/views/profile/ActivateView.vue')
  },
  ... resetPasswordRoutes,
  ...ownerRoutes
];

export const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
