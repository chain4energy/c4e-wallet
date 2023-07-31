import ForgotPasswordView from "@/views/forgotPassword/ForgotPasswordView.vue";
import ForgotPasswordStep1 from "@/views/forgotPassword/ForgotPasswordStep1.vue";
import ForgotPasswordStep2 from "@/views/forgotPassword/ForgotPasswordStep2.vue";
import ForgotPasswordStep3 from "@/views/forgotPassword/ForgotPasswordStep3.vue";

export const resetPasswordRoutes =
  {
    path: '/profile/reset',
    name: 'resetPassword',
    component: ForgotPasswordView,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'resetPassword1',
        component: ForgotPasswordStep1,
        meta: {
          requiresAuth: false
        },
      },
      {
        path: 'step2',
        name: 'resetPassword2',
        component: ForgotPasswordStep2,
        meta: {
          requiresAuth: false
        },
      },
      {
        path: 'step3',
        name: 'resetPassword3',
        component: ForgotPasswordStep3,
        meta: {
          requiresAuth: false
        },
      }
    ]
  };
