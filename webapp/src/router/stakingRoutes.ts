import { RouteRecordRaw, useRouter } from "vue-router";
import StakingView from "@/views/StakingView.vue";
import BaseAccount from "@/components/stacking/BaseAccount.vue";
import { LogLevel } from "@/services/logger/log-level";
import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { useUserStore } from "@/store/user.store";

/**
 * @type {import('vue-router').RouteConfig}
 */
const stakingRoutes = {
  path: '/staking',
    name: 'staking',
  component: StakingView,
  query: { redirect: BaseAccount },
  meta: {
  requiresAuth: false,
},
  children:[
    {
      path: '',
      name: 'baseAccount',
      component: BaseAccount,
      meta: {
        accType: 'BaseAccount',
        requiresAuth: false
      },
    },
    {
      path: '',
      name: 'vesting',
      component: BaseAccount,
      meta: {
        accType: 'VestingAccount',
        requiresAuth: false
      },
    },
  ]
};

// useRouter().beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.accType)) {
//     if (useUserStore().isLoggedIn) {
//       next({name: 'baseAccount'});
//       return;
//     }
//     next('/');
//   } else {
//     next();
//   }
// });

export default stakingRoutes;
