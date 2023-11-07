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
    component: () => import(/* webpackChunkName: "about" */ '@/ev/views/InfoPage.vue')
  },
  {
    path: '/' + subAppName + '/about',
    name: subAppName + '_About',
    component: () => import(/* webpackChunkName: "about" */ '@/ev/views/AboutView.vue')
  },
  {
    path: '/' + subAppName + '/resourceLink/:chargerId',
    name: subAppName + '_ResourceLink',
    component: () => import(/* webpackChunkName: "about" */ '@/ev/views/ResourceLink.vue')
  },
];

const routerEv = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routesEv
});

export default routerEv;
