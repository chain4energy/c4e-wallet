import ForgotPasswordView from "@/ev/views/forgotPassword/ForgotPasswordView.vue";
import ForgotPasswordStep1 from "@/ev/views/forgotPassword/ForgotPasswordStep1.vue";
import ForgotPasswordStep2 from "@/ev/views/forgotPassword/ForgotPasswordStep2.vue";
import ForgotPasswordStep3 from "@/ev/views/forgotPassword/ForgotPasswordStep3.vue";
import ChangePassword from "@/views/forgotPassword/ChangePassword.vue";

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
