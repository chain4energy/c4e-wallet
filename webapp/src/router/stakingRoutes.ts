import StakingView from "@/views/StakingView.vue";
import StakingData from '@/components/staking/StakingData.vue';
import VestingAcc from "@/components/staking/VestingAcc.vue"
import { useUserStore } from "@/store/user.store";

const stakingRoutes = {
  path: '/staking',
  name: 'staking',
  component: StakingData,
};
export default stakingRoutes;
