import StakingView from "@/views/StakingView.vue";
import NewBaseAccount from '@/components/stacking/NewBaseAcc.vue';
import VestingAcc from "@/components/stacking/VestingAcc.vue"
import { useUserStore } from "@/store/user.store";

/**
 * @type {import('vue-router').RouteConfig}
 */
const stakingRoutes = {
  path: '/staking',
  name: 'staking',
  component: StakingView,
  children:[
    {
      path: '',
      name: 'staking',
      component: NewBaseAccount,
    }
  ]
};

export default stakingRoutes;
