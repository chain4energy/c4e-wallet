import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import FaqView from '../views/FaqView.vue';
import TermsConditionsView from '../views/TermsConditionsView.vue';
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue';
import StakingView from '../views/StakingView.vue';
import GovernanceView from '../views/GovernanceView.vue';
import GovernanceDetailsView from '../views/GovernanceDetailsView.vue';
import ValidatorsView from '../views/ValidatorsView.vue';
import ProposalsList from '@/components/governance/ProposalsList.vue';
import stakingRoutes from "@/router/stakingRoutes";
import AirDropView from "@/views/AirDropView.vue"
import { useUserStore } from "@/store/user.store";


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: "",
    redirect: '/dashboard',
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
    name: 'GOVERNANCE_PROPOSALSLIST',
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
  {
    path:'/airDrop',
    name: 'airdrop',
    component: AirDropView,
  },
  {
    path: '/faq',
    name: "faq",
    component: FaqView
  },
  {
    path: '/privacy_policy',
    name: "privacy_policy",
    component: PrivacyPolicyView
  },
  {
    path: '/terms_conditions',
    name: "terms_conditions",
    component: TermsConditionsView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
