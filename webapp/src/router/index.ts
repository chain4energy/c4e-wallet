import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import StakingView from '../views/StakingView.vue';
import GovernanceView from '../views/GovernanceView.vue';
import GovernanceDetailsView from '../views/GovernanceDetailsView.vue';
import ValidatorsView from '../views/ValidatorsView.vue';
import ProposalsList from '@/components/governance/ProposalsList.vue'
import stakingRoutes from "@/router/stakingRoutes";
import { useUserStore } from "@/store/user.store";


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
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: false
    }
  },
  stakingRoutes,
  {
    path: '/governance',
    name: 'Governance',
    component: GovernanceView,
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
    name: 'Validators',
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
