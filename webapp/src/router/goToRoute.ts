import routerEv from "@/router/index";

export function goTo_SignInView() {
  routerEv.push('/ev/signIn');
}

export function goTo_SignUpView() {
  routerEv.push('/ev/signUp');
}

export function goTo_ResetPasswordView() {
  routerEv.push('/ev/reset');
}

export function goTo_EvOwnerDashboardView() {
  routerEv.push('/ev/owner');
}

export function goTo_ActivateAccountView() {
  routerEv.push('/ev/activate');
}

export function goTo_AddChargerView() {
  routerEv.push('/ev/addCharger');
}

export function goTo_AddTariffGroupView() {
  routerEv.push('/ev/addTariffGroup');
}

export function goTo_AddTariffForChargePointView() {
  routerEv.push('/ev/addTariffForChargePoint');
}

export function goTo_AddTariffView(tariffGroupId: number) {
  routerEv.push('/ev/addTariff/' + tariffGroupId);
}

export function goTo_ChargePointView() {
  routerEv.push('/ev/chargePoint');
}

export function goTo_UpdateTariffView() {
  routerEv.push({name: 'ev_UpdateTariff',});
}

export function goTo_TariffGroupsView() {
  routerEv.push('/ev/tariffGroups');
}


