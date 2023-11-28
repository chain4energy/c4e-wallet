const evSubAppName ="ev";

export const ownerRoutes = [
  {
    path: '/' + evSubAppName + '/owner',
    name: evSubAppName + '_OwnerView',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/OwnerView.vue')
  },
  {
    path: '/' + evSubAppName + '/addCharger',
    name: evSubAppName + '_AddCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/AddCharger.vue')
  },
  {
    path: '/' + evSubAppName + '/singleCharger/:id',
    name: evSubAppName + '_SingleCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/SingleCharger.vue')
  },
  {
    path: '/' + evSubAppName + '/addTariffGroup',
    name: evSubAppName + '_AddTariffGroup',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/AddTariffGroup.vue')
  },
  {
    path: '/' + evSubAppName + '/addTariff/:tariffGroupId',
    name: evSubAppName + '_AddTariff',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/AddTariff.vue'),
    props: true,
  },
  {
    path: '/' + evSubAppName + '/tariffGroups',
    name: evSubAppName + '_TariffGroups',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/TariffGroupView.vue'),
    props: true,
  }
];
