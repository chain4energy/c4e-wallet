import OwnerView from "@/views/owner/OwnerView.vue";
import AddCharger from "@/views/owner/AddCharger.vue";
import ChargePointView from "@/views/owner/ChargePointView.vue";
import AddTariffC from "@/components/AddTariffC.vue";
import TariffGroupView from "@/views/owner/TariffGroupView.vue";
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
    path: '/' + evSubAppName + '/editCharger',
    name: evSubAppName + '_EditCharger',
    component: AddCharger,
    props: {edit: true}
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
