const evSubAppName ="ev";

export const ownerRoutes = [
  {
    path: '/' + evSubAppName + '/owner',
    name: evSubAppName + '_OwnerView',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/OwnerView.vue')
  },
  {
    path: '/' + evSubAppName + '/addCharger',
    name: evSubAppName + '_AddCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/AddCharger.vue')
  },
  {
    path: '/' + evSubAppName + '/singleCharger/:id',
    name: evSubAppName + '_SingleCharger',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/SingleCharger.vue')
  },
  {
    path: '/' + evSubAppName + '/addTariffGroup',
    name: evSubAppName + '_AddTariffGroup',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/AddTariffGroup.vue')
  },
  {
    path: '/' + evSubAppName + '/addTariff/:tariffGroupId',
    name: evSubAppName + '_AddTariff',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/components/AddTariffC.vue'),
    props: true,
  },
  {
    path: '/' + evSubAppName + '/tariffGroups',
    name: evSubAppName + '_TariffGroups',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/TariffGroupView.vue'),
    props: true,
  },
  {
    path: '/' + evSubAppName + '/updateTariff/:tariffGroupId/:tariffId',
    name: evSubAppName + '_UpdateTariff',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/UpdateTariffView.vue'),
    props: {
      header: true,
      content: true
    },
  }
];
