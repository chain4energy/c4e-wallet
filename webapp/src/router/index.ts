import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import FaqView from '../views/FaqView.vue';
import TermsConditionsView from '../views/TermsConditionsView.vue';
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue';
import GovernanceView from '../views/GovernanceView.vue';
import GovernanceDetailsView from '../views/GovernanceDetailsView.vue';
import ProposalsList from '@/components/governance/ProposalsList.vue';
import stakingRoutes from "@/router/stakingRoutes";
import AirDropView from "@/views/AirDropView.vue";
import FaucetView from "@/views/FaucetView.vue";
import buyTokensRoutes from "@/router/buyTokens";
import profileRoutes from "@/router/profile";
import KycView from "@/views/KycView.vue";
import SignInView from "@/views/buyTokens/SignInView.vue";
import SignUpView from "@/views/buyTokens/SignUpView.vue";
import PortfolioView from "@/views/PortfolioView.vue";
import ProvideVerificationCodeView from "@/views/buyTokens/ProvideVerificationCodeView.vue";
import {portfolioRoutes} from "@/router/portfolioRoutes";

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
    path:'/airdrop',
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
    path: '/kyc',
    name: 'kyc',
    component: KycView,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
  {
    path: '/faucet',
    name: 'faucet',
    component: FaucetView,
    meta: {
      requiresNotMainNetwork: true
    }
  },
  buyTokensRoutes,
  profileRoutes,
  {
    path: '/buyTokens/signIn',
    name: 'signIn',
    component: SignInView
  },
  {
    path: '/buyTokens/signUp',
    name: 'signUp',
    component: SignUpView
  },
  {
    path: '/profile/provideVerificationCode',
    name: 'provideVerificationCode',
    component: ProvideVerificationCodeView,
    meta: {
      requiresAuth: true
    },
  },
  portfolioRoutes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
