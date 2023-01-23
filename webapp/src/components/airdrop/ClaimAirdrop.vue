<template>
    <div class="claimAirDrop">
      <div class="claimAirDrop__total">
        <div class="claimAirDrop__container">
          <h4 class="claimAirDrop__header">Total</h4>
          <div class="claimAirDrop__data">
            <ClaimInfo header="Total">
              <p class="claimAirDrop__data-text">20,000,000 C4E</p>
            </ClaimInfo>
            <ClaimInfo header="Total claimed (45%)">
              <p class="claimAirDrop__data-text">8,254,200 C4E</p>
            </ClaimInfo>
            <ClaimInfo header="Active campaigns">
              <p class="claimAirDrop__data-text">10,000,000 C4E</p>
            </ClaimInfo>
            <ClaimInfo header="To claim (5%)">
              <p class="claimAirDrop__data-text">542,220 C4E</p>
            </ClaimInfo>
          </div>
        </div>
      </div>
      <div class="claimAirDrop__total" v-for="campaignRecord in airdropClaimRecord" :key="campaignRecord.id">
        <div class="claimAirDrop__container">
          <h4 class="claimAirDrop__header">{{campaignRecord.description}}</h4>
          <PercentageBar
            ref="percentsBar"
            :key="updateComponent"
            :amount="calculateProgress(campaignRecord.start_time, campaignRecord.end_time)"
            :status="checkCampaignStatus(campaignRecord.start_time, campaignRecord.end_time)"
            :time-to-pass="calculateTimeToPAss(campaignRecord.start_time, campaignRecord.end_time)"
          />
          <div class="claimAirDrop__data">
            <ClaimInfo header="Claimed">
              <div class="claimAirDrop__data-text">
                <CoinAmount :amount="calculateMissions(campaignRecord)" :show-denom="false" :precision="2"></CoinAmount>
                /
                <CoinAmount :amount="campaignRecord.amount" :show-denom="true" :precision="2"></CoinAmount>
              </div>
            </ClaimInfo>
            <ClaimInfo header="Mission Complitted">
              <p class="claimAirDrop__data-text">{{getAmountOfClaimedMissions(campaignRecord)}}/{{campaignRecord.missions.length}}</p>
            </ClaimInfo>
            <ClaimInfo header="Time to start claiming">
              <p class="claimAirDrop__data-text">{{calculateTimeToPAss(campaignRecord.start_time, campaignRecord.end_time)}}</p>
            </ClaimInfo>
            <ClaimInfo header="Total Distribution">
              <div class="claimAirDrop__data-text">
                <CoinAmount :amount="campaignRecord.amount" :show-denom="true" :precision="2"></CoinAmount>
              </div>
            </ClaimInfo>
          </div>
          <div class="claimAirDrop__body">
            <button @click="setActiveCampaign(campaignRecord)" class="claimAirDrop__showBtn">{{activeCampain === campaignRecord? 'Hide missions' : 'Show Missions'}}</button>
            <div v-if="activeCampain === campaignRecord" class="claimAirDrop__missions">
              <div class="claimAirDrop__missions-body" v-for="(missions, id) in campaignRecord.missions" v-bind:key="id">
                <div class="claimAirDrop__leftCol">
                  <div class="claimAirDrop__smallTxt">{{`Mission# ${missions.mission_id}`}}</div>
                  <div>{{missions.description}}</div>
                </div>
                <div>
                  <Button :disabled="
                  missions.mission_type !== MissionStatus.INITIAL
                  && checkCampaignStatus(campaignRecord.start_time, campaignRecord.end_time) !== CampainStatus.Now"
                          class="p-button p-component secondary claimAirDrop__btn"
                          :label="getTextForMissionsBtn(missions.mission_type)">

                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import {useAirDropStore} from "@/store/airDrop.store";
import {computed, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {CampaignRecord, CampainStatus, MissionStatus} from "@/models/airdrop/airdrop";
import {Campaign} from "@/models/store/airdrop";
import PercentageBar from "@/components/commons/PercentageBar.vue";
import i18n from "@/plugins/i18n";
import ClaimInfo from "@/components/airdrop/dropComponents/ClaimInfo.vue";
import CoinAmount from '@/components/commons/CoinAmount.vue';
import {Coin} from "@/models/store/common";
import {MissionType} from "@/models/blockchain/airdrop";

const percentsBar = ref();

// const currentLang = computed(() => {
//   return i18n.global.locale;
// });

{
  useAirDropStore().fetchCampaigns(useUserStore().getAccount.address, true);
}
const activeCampain = ref();
function setActiveCampain(campain: Campaign){
  if(campain !== activeCampain.value){
    activeCampain.value = campain;
  } else {
    activeCampain.value = undefined;
  }
}

function calculateMissions(campaign : Campaign){
  let total = 0;
  campaign.missions.forEach((el) => {
    if(el.claimed){
      total += el.weight;
      console.log(total);
    }
  });
  return new Coin(total, campaign.amount.denom);
}
function getAmountOfClaimedMissions(campaign : Campaign){
  let total = 0;
  campaign.missions.forEach((el) => {
    if(el.claimed){
      total++;
      console.log(total);
    }
  });
  return total;
}

const airdropClaimRecord = computed(() => {
  return useAirDropStore().getCampaigns;
});

function getClaimedWeight(campain: CampaignRecord){
  return 2000000;
}

function checkCampaignStatus(startTime: Date, endTime: Date) {
  if(new Date(startTime).getTime() < new Date(Date.now()).getTime() && new Date(endTime).getTime()> new Date(Date.now()).getTime()){
    return CampainStatus.Now;
  }else if(new Date(startTime).getTime() > new Date(Date.now()).getTime()){
    return CampainStatus.Future;
  } else {
    return CampainStatus.Past;
  }
}

function calculateProgress(startTime: Date, endTime: Date){
  if(new Date(startTime).getTime() < Date.now() && new Date(endTime).getTime()> Date.now()){
    const startEndDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const difference = Date.now() - new Date(endTime).getTime();
    return Math.abs(100 - ((Math.abs(difference)/Math.abs(startEndDiff)) * 100));
  }
  else if(new Date(startTime).getTime() > Date.now()){
    return null;
  }
}
const childComponentRef = ref(null);
const updateComponent = ref(false);
function calculateTimeToPAss(startDate: Date, endDate: Date){
  if(new Date(startDate).getTime() < new Date(Date.now()).getTime() && new Date(endDate).getTime()> new Date(Date.now()).getTime()){
    const now = new Date(Date.now());
    const diference = new Date(endDate).getTime() - now.getTime();
    const days = Math.floor(diference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else {
    return '0';
  }
}
const emit = defineEmits(['timeChanged'])
setInterval(() => {
    updateComponent.value = !updateComponent.value;
},1000);

function getTextForMissionsBtn(type: MissionType){
  let text;
  switch (type){
    case MissionType.INITIAL_CLAIM: text = 'Claim';
    break;
    case MissionType.DELEGATE: text = 'Delegate';
    break;
    case MissionType.VOTE: text = 'Vote';
    break;
  }
  return text;
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.claimAirDrop{
  font-family: 'Inter', sans-serif;
  &__total{
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(100% / 8), 1fr));
    grid-area: 1/2/7/6;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 5;
    }
  }
  &__container {
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    padding: 1.5em;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    grid-area: 1/2/1/8;
    color: $header-text-color;
    background-color: $main-color;
    width:100%;
    @media (max-width: 1200px) {
      grid-area: 1 /1/ 1 / 9;
    }
  }
  &__data{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-column-gap: 9px;
    grid-row-gap: 9px;
    max-width: 100%;
    margin-bottom: 18px;
    &-text{
      margin: 0;
    }
  }
  &__header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
  }
  &__body{
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  &__showBtn{
    background: transparent;
    color: white;
    border: none;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 17px;
  }
  &__missions{
    transition: 2s ease-in-out;
    width: 100%;
    &-body{
      display: flex;
      justify-content: space-between;
      align-items:center;
      width: 100%;
      background-color: #013C6C;
      padding: 3.5px 13px;
      box-shadow: 0px 0px 2px 2px #02447A;
      border-radius: 2px;
      margin-bottom: 10px;
    }
  }
  &__percents{
    width: 100%;
    height: 30px;
  }
  &__smallTxt{
    font-weight: 400;
    font-size: 9px;
    line-height: 11px;
  }
  &__leftCol{
    text-align: initial;
  }

  &__content{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc((100%/ 8) - 5px), 1fr));
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      grid-column-gap:0;
      grid-row-gap: 10px;
    }
  }
  &__items{
    display: flex;
    flex-direction: column;
    font-size: 16px;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    border-radius: 5px;
    align-items: center;
    justify-content: space-between;
    padding: 15%;

  }
}
</style>
