import routerEv from "@/ev/router/index";

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
