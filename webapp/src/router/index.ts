import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import StakingView from '../views/StakingView.vue';
import GovernanceView from '../views/GovernanceView.vue';
import GovernanceDetailsView from '../views/GovernanceDetailsView.vue';
import ValidatorsView from '../views/ValidatorsView.vue';
import ProposalsList from '@/components/governance/ProposalsList.vue'
import BaseAccount from "@/components/Stacking/BaseAccount.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DashboardView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/staking',
    name: 'staking',
    component: StakingView,
    redirect: to => {
      return {name: 'baseAccount'};
    },
    meta: {
      accountType: {}
    },
    children:[
      {
        path: '',
        name: 'baseAccount',
        component: BaseAccount,
      },
      {
        path: '',
        name: 'vesting',
        component: BaseAccount,
      },
    ]
  },
  {
    path: '/governance',
    name: 'governance',
    component: GovernanceView,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'proposalsList',
        component: ProposalsList,

      },
      {
        path: ':id',
        name: 'governanceDetails',
        component: GovernanceDetailsView,

      }
    ]
  },
  // {
  //   path: '/governance/:id',
  //   name: 'governanceDetails',
  //   component: GovernanceDetailsView,
  //   meta: {
  //     requiresAuth: false
  //   },
  //
  // },
  {
    path: '/validators',
    name: 'validators',
    component: ValidatorsView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// const logger = inject<LoggerService>('logger') as LoggerService;

// router.beforeEach((to, from, next) => {
//   logger.logToConsole(LogLevel.DEBUG, 'Router', 'go form:' + JSON.stringify(from.name) + ' to:' + JSON.stringify(to.name));
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (useUserStore().isLoggedIn) {
//       next();
//       return;
//     }
//     logger.logToConsole(LogLevel.INFO, 'Router', 'user not logged in, redirecting to login page');
//     next('/login');
//   } else {
//     logger.logToConsole(LogLevel.WARNING, 'Router', 'requiresAuth not defined in router configuration');
//     next();
//   }
// });

export default router;
