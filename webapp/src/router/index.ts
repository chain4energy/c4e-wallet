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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
