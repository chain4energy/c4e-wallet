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
  component: NewBaseAccount,
  // children:[
  //   {
  //     path: '',
  //     name: 'base',
  //     component: NewBaseAccount,
  //   },
  //   // {
  //   //   path: '',
  //   //   name: 'vesting',
  //   //   component: VestingAcc,
  //   // }
  // ],
};

// function checkAccType(){
//   if(!useUserStore().isContinuousVestingAccount){
//     return {name: 'base'}
//   } else {
//     return {name: 'stakingVesting'}
//   }
// }
// function loger(to:any){
//   if(useUserStore().getAccType==='/cosmos.vesting.v1beta1.ContinuousVestingAccount'){
//     router.replace({name: 'base'})
//     console.log(to)
//   } else {
//     router.replace({name: 'stakingVesting'})
//   }
// }
// router.stakingRoutes.beforeEach((to, from) => {
//
//   if (to.meta.requiresVesting && !useUserStore().isLoggedIn) {
//     return {
//       name: 'stacking',
//       // save the location we were at to come back later
//     }
//   } else {
//     return {
//       name: 'stakingVesting'
//     }
//   }
// })
export default stakingRoutes;
