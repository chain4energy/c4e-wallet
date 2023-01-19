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
      <div class="claimAirDrop__total" v-for="campaignRecord in airdropClaimRecord.campaign_records" :key="campaignRecord.campaign.campaign_id">
        <div class="claimAirDrop__container">
          <h4 class="claimAirDrop__header">{{campaignRecord.campaign.description}}</h4>
          <PercentageBar
            ref="percentsBar"
            :key="updateComponent"
            :amount="calculateProgress(campaignRecord.campaign.start_time, campaignRecord.campaign.end_time)"
            :status="checkCampaignStatus(campaignRecord.campaign.start_time, campaignRecord.campaign.end_time)"
            :time-to-pass="calculateTimeToPAss(campaignRecord.campaign.start_time, campaignRecord.campaign.end_time)"
          />
          <div class="claimAirDrop__data">
            <ClaimInfo header="Claimed">
              <p class="claimAirDrop__data-text">0/34.99 C4E</p>
            </ClaimInfo>
            <ClaimInfo header="Mission Complitted">
              <p class="claimAirDrop__data-text">0/3</p>
            </ClaimInfo>
            <ClaimInfo header="Time to start claiming">
              <p class="claimAirDrop__data-text">{{calculateTimeToPAss(campaignRecord.campaign.start_time, campaignRecord.campaign.end_time)}}</p>
            </ClaimInfo>
            <ClaimInfo header="Total Distribution">
              <p class="claimAirDrop__data-text">9,000,000 C4E</p>
            </ClaimInfo>
          </div>
          <div class="claimAirDrop__body">
            <button @click="setActiveCampain(campaignRecord)" class="claimAirDrop__showBtn">{{activeCampain === campaignRecord? 'Hide missions' : 'Show Missions'}}</button>
            <div v-if="activeCampain === campaignRecord" class="claimAirDrop__missions">
              <div class="claimAirDrop__missions-body" v-for="(missions, id) in campaignRecord.missions" v-bind:key="id">
                <div class="claimAirDrop__leftCol">
                  <div class="claimAirDrop__smallTxt">{{`Mission# ${id+1}`}}</div>
                  <div>{{missions.description}}</div>
                </div>
                <div>
                  <Button :disabled="missions.status !== MissionStatus.INITIAL && checkCampaignStatus(campaignRecord.campaign.start_time, campaignRecord.campaign.end_time) !== CampainStatus.Now" class="p-button p-component secondary claimAirDrop__btn" :label="'Stake'"></Button>
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
import {computed, nextTick, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {CampaignRecord, CampainStatus} from "@/models/airdrop/airdrop";
import PercentageBar from "@/components/commons/PercentageBar.vue";
import i18n from "@/plugins/i18n";
import ClaimInfo from "@/components/airdrop/dropComponents/ClaimInfo.vue";
import {MissionStatus} from '@/models/airdrop/airdrop';
import CountDownTime from "@/components/commons/CountDownTime.vue";
import {emitted} from "@vue/test-utils/dist/emit";

const percentsBar = ref();

const currentLang = computed(() => {
  return i18n.global.locale;
});

{
  useAirDropStore().fetchAirdropClaimRecord(useUserStore().getAccount.address, true);
}
const activeCampain = ref();
function setActiveCampain(campain: CampaignRecord){
  if(campain !== activeCampain.value){
    activeCampain.value = campain;
  } else {
    activeCampain.value = undefined;
  }
}
const airdropClaimRecord = computed(() => {
  return useAirDropStore().getAirdropClaimRecord;
});

function checkCampaignStatus(startTime: Date, endTime: Date) {
  if(startTime.getTime() < new Date(Date.now()).getTime() && endTime.getTime()> new Date(Date.now()).getTime()){
    return CampainStatus.Now;
  }else if(startTime.getTime() > new Date(Date.now()).getTime()){
    return CampainStatus.Future;
  } else {
    return CampainStatus.Past;
  }
}

function calculateProgress(startTime: Date, endTime: Date){
  if(startTime.getTime() < Date.now() && endTime.getTime()> Date.now()){
    const startEndDiff = endTime.getTime() - startTime.getTime();
    const difference = Date.now() - endTime.getTime();
    return Math.abs(100 - ((Math.abs(difference)/Math.abs(startEndDiff)) * 100));
  }
  else if(startTime.getTime() > Date.now()){
    return undefined;
  }
}
const childComponentRef = ref(null);
const updateComponent = ref(false);
function calculateTimeToPAss(startDate: Date, endDate: Date){
  if(startDate.getTime() < new Date(Date.now()).getTime() && endDate.getTime()> new Date(Date.now()).getTime()){
    const now = new Date(Date.now());
    const diference = endDate.getTime() - now.getTime();
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
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
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
