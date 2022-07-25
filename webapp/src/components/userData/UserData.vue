<template>
<div class="userdata">
  <div class="userdata__accountData">
    <div class="userdata__accountData-base" >
    <div class="userdata__icon">
      <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.268 27.8207C11.4745 27.8139 8.74571 26.9973 6.42638 25.4741C4.10705 23.9509 2.30123 21.7894 1.23702 19.2627C0.172818 16.7359 -0.102009 13.9573 0.447245 11.2779C0.996499 8.59846 2.34519 6.13838 4.32296 4.20841C6.30073 2.27844 8.81884 0.965187 11.5592 0.434548C14.2995 -0.0960907 17.1392 0.179693 19.7194 1.22705C22.2996 2.27441 24.5046 4.04637 26.0559 6.31907C27.6071 8.59177 28.4351 11.2632 28.4351 13.996C28.4258 17.6657 26.929 21.182 24.2732 23.7736C21.6174 26.3653 18.0192 27.8207 14.268 27.8207ZM14.268 1.22863C11.6881 1.23469 9.16786 1.98862 7.02574 3.3952C4.88362 4.80178 3.21571 6.79789 2.23271 9.13136C1.2497 11.4648 0.99571 14.031 1.50282 16.5056C2.00993 18.9802 3.25539 21.2522 5.08186 23.0347C6.90833 24.8172 9.23387 26.0302 11.7647 26.5203C14.2955 27.0105 16.918 26.7559 19.301 25.7886C21.6839 24.8214 23.7204 23.185 25.1531 21.086C26.5858 18.9871 27.3504 16.5199 27.3504 13.996C27.3421 10.6071 25.9602 7.35972 23.5076 4.96624C21.0551 2.57277 17.7323 1.22862 14.268 1.22863Z" fill="#0F3153"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.84768 4.82898C6.84768 5.29619 6.71115 5.75293 6.45536 6.14141C6.19956 6.52988 5.83601 6.83266 5.41064 7.01146C4.98527 7.19025 4.51721 7.23704 4.06564 7.1459C3.61408 7.05474 3.19928 6.82975 2.87372 6.49938C2.54815 6.169 2.32645 5.74809 2.23663 5.28985C2.1468 4.8316 2.1929 4.35662 2.36909 3.92497C2.54529 3.49332 2.84365 3.12437 3.22647 2.8648C3.60929 2.60523 4.05937 2.46667 4.51979 2.46667C5.13719 2.46667 5.7293 2.71556 6.16586 3.15857C6.60243 3.60159 6.84768 4.20245 6.84768 4.82898Z" fill="#0F3153"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6658 27.1787C14.6658 27.6459 14.5293 28.1026 14.2735 28.4911C14.0177 28.8796 13.6541 29.1824 13.2288 29.3612C12.8034 29.54 12.3353 29.5868 11.8838 29.4956C11.4322 29.4045 11.0174 29.1795 10.6918 28.8491C10.3663 28.5187 10.1446 28.0978 10.0547 27.6396C9.96492 27.1813 10.011 26.7063 10.1872 26.2747C10.3634 25.843 10.6618 25.4741 11.0446 25.2145C11.4274 24.9549 11.8775 24.8164 12.3379 24.8164C12.9553 24.8164 13.5474 25.0653 13.984 25.5083C14.4205 25.9513 14.6658 26.5522 14.6658 27.1787Z" fill="#0F3153"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M28.971 9.56161C28.971 10.0288 28.8345 10.4855 28.5787 10.874C28.3229 11.2625 27.9593 11.5653 27.5339 11.7441C27.1086 11.9229 26.6405 11.9697 26.1889 11.8785C25.7374 11.7874 25.3226 11.5624 24.997 11.232C24.6714 10.9016 24.4497 10.4807 24.3599 10.0225C24.2701 9.56423 24.3162 9.08925 24.4924 8.65759C24.6686 8.22594 24.967 7.857 25.3498 7.59742C25.7326 7.33785 26.1827 7.19931 26.6431 7.19931C27.2605 7.19931 27.8526 7.44819 28.2892 7.89121C28.7257 8.33423 28.971 8.93509 28.971 9.56161Z" fill="#0F3153"/>
        <path d="M17.9726 22.255C18.9363 21.7668 19.801 21.099 20.5216 20.2865V8.6482C19.802 7.83464 18.9371 7.16668 17.9726 6.67961V13.8886H10.2401V6.73867C9.2812 7.2409 8.42326 7.92057 7.71045 8.74268V15.1918C7.71074 15.3632 7.74367 15.533 7.80744 15.6918C7.87076 15.8452 7.96153 15.9854 8.07515 16.1052C8.18719 16.2189 8.31866 16.3109 8.46314 16.3769C8.62318 16.4486 8.79645 16.4848 8.97139 16.4832H17.9571L17.9726 22.255Z" fill="#0F3153"/>
      </svg>
    </div>
    <div class="userdata__amounts">
      <p>{{ $t('USER_DATA.TOTAL') }}</p>
      <p>{{total || 0}}</p>
    </div>
    <div class="userdata__amounts">
      <p>{{ $t('USER_DATA.AVAILABLE') }}</p>
      <p>{{useUserStore().getBalanceViewAmount() || 0}}</p>
    </div>
    <div class="userdata__amounts">
      <p>{{ $t('USER_DATA.STACKED') }}</p>
      <p>{{useUserStore().getTotalDelegatedViewAmount() || 0}}</p>
    </div>
    <div class="userdata__amounts">
      <p>{{ $t('USER_DATA.UNSTACKING') }}</p>
      <p>{{useUserStore().getTotalUndelegatingViewAmount() || 0}}</p>
    </div>
    </div>
    <div class="userdata__accountData-vesting" v-if="useUserStore().isContinuousVestingAccount">
      <div>
        <p>{{locked}}</p>
      </div>
      <div>
        <p>{{ useUserStore().getAccount.continuousVestingData?.startTime.toLocaleString() }}</p>
      </div>
      <div>
        <p>{{ useUserStore().getAccount.continuousVestingData?.endTime.toLocaleString() }}</p>
      </div>
    </div>
  </div>

  <div class="userdata__rewards">
    <div class="userdata__rewardAmount">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12V22H4V12" stroke="#72BF44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 7H2V12H22V7Z" stroke="#72BF44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 22V7" stroke="#72BF44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#72BF44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#72BF44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>{{useUserStore().getTotalRewardsViewAmount() || '0'}}</p>
    </div>
    <button @click="claimRewards">{{ $t('USER_DATA.CLAIM_REWARDS') }}</button>

  </div>

</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.store";
import { Account } from "@/models/store/account";
import {useBlockStore} from "@/store/block.store";
import { computed, ref } from "vue";

function claimRewards(){
  useUserStore().claimRewards();
}
useBlockStore().fetchLatestBlock();
setInterval(useBlockStore().fetchLatestBlock, 6000);

const total = computed(() => useUserStore().getTotalViewAmount());
const locked = computed(()=> useUserStore().getVestingLockViewAmount());
// const startTime = computed(()=> useUserStore().getAccount.continuousVestingData?.getStartTimeDateString() || 'loading');
// const endTime = computed(()=> useUserStore().getAccount.continuousVestingData?.getStartTimeDateString() || 'loading');
console.log(useUserStore().getAccount.continuousVestingData);
</script>

<style scoped lang="scss">
.userdata{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  max-height: 80px;
  margin-left: auto;
  margin-right: auto;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  color: #090909;
  p{
    margin: 0;
  }
  &__accountData{
    display: flex;
    width: 60%;
    align-items: center;
    //padding: 20px 25px;
    justify-content: space-between;
    &-base{
      display: flex;
      align-items: center;
      max-width: 50%;
      margin-left: 20px;
    }
    &-vesting{
      padding-left: 3%;
      background: #E6FFF1;
      display: flex;
      align-items: center;
      width: 40%;
      min-height: 100%;
      clip-path: polygon(100% 0%, 100% 100%, 0 100%, 5% 50%, 0 0);
    }
  }
  &__amounts{
    text-align: left;
    margin-left: 64px;
  }
  &__rewards{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 25px;
    width: 40%;
    min-height: 100%;
    max-height: 80px;
    background: #0F3153;
  }
  &__rewardAmount{
    display: flex;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    text-align: center;
    color: #FFFFFF;
    :nth-child(1){
      margin-right: 16px;
    }
  }

  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    width: 161px;
    background-color: transparent;
    color: #FFFFFF;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
    }
  }
}

</style>
