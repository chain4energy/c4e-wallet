// @ts-ignore

import ForgotPasswordView from "@/views/forgotPassword/ForgotPasswordView.vue";
// @ts-ignore

import ForgotPasswordStep1 from "@/views/forgotPassword/ForgotPasswordStep1.vue";
// @ts-ignore

import ForgotPasswordStep2 from "@/views/forgotPassword/ForgotPasswordStep2.vue";
// @ts-ignore

import ForgotPasswordStep3 from "@/views/forgotPassword/ForgotPasswordStep3.vue";

export const resetPasswordRoutes = [
  {
    path: '/ev/reset',
    name: 'resetPasswordEv',
    component: ForgotPasswordView,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'resetPassword1Ev',
        component: ForgotPasswordStep1,
        meta: {
          requiresAuth: false
        },
      },
      {
        path: 'step2',
        name: 'resetPassword2Ev',
        component: ForgotPasswordStep2,
        meta: {
          requiresAuth: false
        },
      },
      {
        path: 'step3',
        name: 'resetPassword3Ev',
        component: ForgotPasswordStep3,
        meta: {
          requiresAuth: false
        },
      }
    ]
  }
  // {
  //   path: '/ev/changepassword',
  //   name: 'changePassword',
  //   component: ChangePassword,
  //   meta: {
  //     requiresAuth: true
  //   }
  // }
  ];
