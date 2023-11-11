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
    component: () => import(/* webpackChunkName: "ResourceLink" */ '@/ev/views/QrCode.vue')
  },
];

const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
