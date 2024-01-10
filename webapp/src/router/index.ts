import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// @ts-ignore
import ResourceLink from "@/views/ResourceLink.vue";
// @ts-ignore


import ChargingSessionView from "@/views/ChargingSessionView.vue";
// @ts-ignore

import ChargePointConnectorView from "@/views/ChargePointConnectorView.vue";
// @ts-ignore

import ChoosePaymentMethod from "@/views/ChoosePaymentMethod.vue";
// @ts-ignore

import WaitForPaymentConfirmation from "@/views/WaitForPaymentConfirmation.vue";
// @ts-ignore

import PaymentRejected from "@/views/PaymentRejected.vue";
// @ts-ignore

import MockPayment from "@/views/MockPayment.vue";
// @ts-ignore

import SignInView from "@/views/profile/SignInView.vue";
// @ts-ignore

import SignUpView from "@/views/profile/SignUpView.vue";
// @ts-ignore

import ActivateView from "@/views/profile/ActivateView.vue";
// @ts-ignore

import DgCss from "@/views/DgCss.vue";
import {resetPasswordRoutes} from "@/router/resetPasswordRoutes";
import {ownerRoutes} from "@/router/ownerRoutes";

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
    component: ResourceLink,
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/sessionLink/:context(.*)*',
    name: evSubAppName + '_SessionLink',
    component: ChargingSessionView,
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/chargePointConnector/:context(.*)*',
    name: evSubAppName + '_ChargePointConnector',
    component: ChargePointConnectorView,
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
  {
    path: '/' + evSubAppName + '/sessionInfo',
    name: evSubAppName + '_ChargingSession',
    component: ChargingSessionView
  },
  {
    path: '/' + evSubAppName + '/choosePaymentMethod',
    name: evSubAppName + '_ChoosePaymentMethod',
    component: ChoosePaymentMethod
  },
  {
    path: '/' + evSubAppName + '/waitForPaymentConfirmation',
    name: evSubAppName + '_WaitForPaymentConfirmation',
    component: WaitForPaymentConfirmation
  },
  // {
  //   path: '/' + evSubAppName + '/startChargingSession',
  //   name: evSubAppName + '_StartChargingSession',
  //   component: () => import(/* webpackChunkName: "StartChargingSession" */ '@/views/StartChargingSessionView.vue')
  // },
  {
    path: '/' + evSubAppName + '/paymentRejected',
    name: evSubAppName + '_PaymentRejected',
    component: PaymentRejected
  },
  {
    path: '/' + evSubAppName + '/mockPayment',
    name: evSubAppName + '_MockPayment',
    component: MockPayment
  },
  {
    path: '/' + evSubAppName + '/signIn',
    name: evSubAppName + '_SignInView',
    component: SignInView
  },
  {
    path: '/' + evSubAppName + '/signUp',
    name: evSubAppName + '_SignUpView',
    component: SignUpView
  },
  {
    path: '/' + evSubAppName + '/activate',
    name: evSubAppName + '_Activate',
    component: ActivateView
  },

  ... resetPasswordRoutes,
  ...ownerRoutes,


  {
    path: '/' + evSubAppName + '/dg',
    name: evSubAppName + '_dg',
    component: DgCss,
    props: true,
    // alias: '/' + evSubAppName + '/resourceLink/:context'
  },
];

export const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
