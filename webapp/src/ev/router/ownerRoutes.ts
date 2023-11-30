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
    path: '/' + evSubAppName + '/chargePoint',
    name: evSubAppName + '_ChargePoint',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/ChargePointView.vue')
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
    path: '/' + evSubAppName + '/updateTariff',
    name: evSubAppName + '_UpdateTariff',
    component: () => import(/* webpackChunkName: "OwnerView" */ '@/ev/views/owner/UpdateTariffView.vue'),
    props: true,
  },
];
