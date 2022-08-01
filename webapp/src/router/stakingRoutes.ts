import StakingView from "@/views/StakingView.vue";
import NewBaseAccount from '@/components/staking/NewBaseAcc.vue';
import VestingAcc from "@/components/staking/VestingAcc.vue"
import { useUserStore } from "@/store/user.store";

const stakingRoutes = {
  path: '/staking',
  name: 'staking',
  component: NewBaseAccount,
};
export default stakingRoutes;
