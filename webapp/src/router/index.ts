import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ResourceLink from "@/views/ResourceLink.vue";
import ChargingSessionView from "@/views/ChargingSessionView.vue";
import ChargePointEvseView from "@/views/ChargePointEvseView.vue";
import ChoosePaymentMethod from "@/views/ChoosePaymentMethod.vue";
import WaitForPaymentConfirmation from "@/views/WaitForPaymentConfirmation.vue";
import PaymentRejected from "@/views/PaymentRejected.vue";
import MockPayment from "@/views/MockPayment.vue";
import SignInView from "@/views/profile/SignInView.vue";
import SignUpView from "@/views/profile/SignUpView.vue";
import ActivateView from "@/views/profile/ActivateView.vue";
import {resetPasswordRoutes} from "@/router/resetPasswordRoutes";
import {ownerRoutes} from "@/router/ownerRoutes";

export const evSubAppName ="ev";


const routesEv: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: "OwnerEntryPoint",
    redirect: '/' + evSubAppName + '/signIn',
  },
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
    path: '/' + evSubAppName + '/chargePointEvse/:context(.*)*',
    name: evSubAppName + '_ChargePointEvse',
    component: ChargePointEvseView,
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

];

export const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
