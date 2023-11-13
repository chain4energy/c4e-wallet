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
];

const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
