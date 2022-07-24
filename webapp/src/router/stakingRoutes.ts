import StakingView from "@/views/StakingView.vue";
import NewBaseAccount from '@/components/stacking/NewBaseAcc.vue';
import VestingAcc from "@/components/stacking/VestingAcc.vue"
import { useUserStore } from "@/store/user.store";

const stakingRoutes = {
  path: '/staking',
  name: 'staking',
  component: NewBaseAccount,
};
export default stakingRoutes;
