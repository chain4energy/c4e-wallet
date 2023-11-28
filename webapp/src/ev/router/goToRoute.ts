import routerEv from "@/ev/router/index";
import {Tariff} from "@/ev/models/tariff";

export function goTo_SignInView(){
  routerEv.push('/ev/signIn');
}

export function goTo_SignUpView(){
  routerEv.push('/ev/signUp');
}

export function goTo_ResetPasswordView(){
  routerEv.push('/ev/reset');
}

export function goTo_EvOwnerDashboardView(){
  routerEv.push('/ev/owner');
}

export function goTo_ActivateAccountView(){
  routerEv.push('/ev/activate');
}

export function goTo_AddChargerView(){
  routerEv.push('/ev/addCharger');
}

export function goTo_AddTariffGroupView(){
  routerEv.push('/ev/addTariffGroup');
}

export function goTo_AddTariffView(tariffGroupId: number){
  routerEv.push('/ev/addTariff/' + tariffGroupId);
}

export function goTo_UpdateTariffView(tariffGroupId: number, tariffId: number){
  routerEv.push({
    name: 'ev_UpdateTariff',
    params: { tariffGroupId: tariffGroupId, tariffId: tariffId }
  });
}

export function goTo_TariffGroupsView(){
  routerEv.push('/ev/tariffGroups');
}


