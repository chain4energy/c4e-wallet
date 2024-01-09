// @ts-ignore

import OwnerView from "@/views/owner/OwnerView.vue";
// @ts-ignore

import AddCharger from "@/views/owner/AddCharger.vue";
// @ts-ignore

import ChargePointView from "@/views/owner/ChargePointView.vue";
// @ts-ignore

import AddTariffC from "@/components/AddTariffC.vue";
// @ts-ignore

import TariffGroupView from "@/views/owner/TariffGroupView.vue";
// @ts-ignore

import UpdateTariffView from "@/views/owner/UpdateTariffView.vue";

const evSubAppName ="ev";

export const ownerRoutes = [
  {
    path: '/' + evSubAppName + '/owner',
    name: evSubAppName + '_OwnerView',
    component: OwnerView
  },
  {
    path: '/' + evSubAppName + '/addCharger',
    name: evSubAppName + '_AddCharger',
    component: AddCharger
  },
  {
    path: '/' + evSubAppName + '/chargePoint',
    name: evSubAppName + '_ChargePoint',
    component: ChargePointView
  },
  {
    path: '/' + evSubAppName + '/addTariff/:tariffGroupId',
    name: evSubAppName + '_AddTariff',
    component: AddTariffC,
    props: true,
  },
  {
    path: '/' + evSubAppName + '/tariffGroups',
    name: evSubAppName + '_TariffGroups',
    component: TariffGroupView,
    props: true,
  },
  {
    path: '/' + evSubAppName + '/updateTariff',
    name: evSubAppName + '_UpdateTariff',
    component: UpdateTariffView,
    props: true,
  },
];
