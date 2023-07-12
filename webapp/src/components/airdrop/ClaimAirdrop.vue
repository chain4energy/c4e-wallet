<template>
  <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
  <div class="claimAirDrop" v-if="isLoggedIn && address">
      <ClaimingOptionsPopup
        :initial-claim="currentClaimIsInitial"
        :campaign-id="selectedCampaignId"
        :mission-id="selectedMissionId"
        :isFinal="isFinal"
        v-if="claimingProcessStarted" @close="claimingProcessStarted = false"
        @final = 'handleFinal'
      />
      <div class="claimAirDrop__total">
        <div class="claimAirDrop__container">
          <h4 class="claimAirDrop__header claimAirDrop__mainTxt">{{$t('AIRDROP.TOTAL_HEADER')}}</h4>
          <div class="claimAirDrop__summaryData claimAirDrop__basicText">
            <ClaimInfo :header="$t('AIRDROP.TOTAL')" class="claimAirDrop__boldText claimAirDrop__summaryTile">
              <CoinAmount :amount="convertAmount(summary.totalAmount)" :show-denom="true" :show-tooltip="true" :precision="2"/>
            </ClaimInfo>
            <ClaimInfo :header="$t('AIRDROP.TOTAL_CLAIMED')" class="claimAirDrop__boldText claimAirDrop__summaryTile" :percentage-vale="summary.claimedPercent">
              <CoinAmount :amount="convertAmount(summary.totalClaimed)" :show-denom="true" :show-tooltip="true" :precision="2"/>
            </ClaimInfo>
            <div class="vl"/>
            <ClaimInfo :header="$t('AIRDROP.ACTIVE')" class="claimAirDrop__boldText claimAirDrop__summaryTile">
              <CoinAmount :amount="convertAmount(summary.activeCampaigns)" :show-denom="true" :show-tooltip="true" :precision="2"/>
            </ClaimInfo>
            <!-- :percentage-vale="summary.claimedPercentage" -->
            <ClaimInfo :header="$t('AIRDROP.TO_CLAIM')" class="claimAirDrop__boldText claimAirDrop__summaryTile" :percentage-vale="summary.toClaimPercent">
              <CoinAmount :amount="convertAmount(summary.toClaim)" :show-denom="true" :show-tooltip="true" :precision="2"/>
            </ClaimInfo>
          </div>
        </div>
      </div>
      <div class="claimAirDrop__total claimAirDrop__basicText" v-for="campaignRecord in airdropClaimRecord" :key="campaignRecord.id">
          <div class="claimAirDrop__container">
            <h4 class="claimAirDrop__header">{{campaignRecord.name}}</h4>
            <hr class="claimAirDrop__hr"/>
            <div class="claimAirDrop__progressHeader">
              <h5 style="margin: 0 0 20px 10px" v-if="checkCampaignStatus(campaignRecord.start_time, campaignRecord.end_time) !== CampainStatus.Past">{{$t('CLAIM_AIRDROP.PROGRESS')}}</h5>
              <h5 v-else style="margin: 0 0 20px 10px">{{$t('CLAIM_AIRDROP.FINISHED')}}</h5>
            </div>


            <PercentageBar
              v-if="checkCampaignStatus(campaignRecord.start_time, campaignRecord.end_time) !== CampainStatus.Past"
              ref="percentsBar"
              :key="updateComponent"
              :amount="calculateProgress(campaignRecord.start_time, campaignRecord.end_time)"
              :status="checkCampaignStatus(campaignRecord.start_time, campaignRecord.end_time)"
              :time-to-pass="calculateTimeToPass(campaignRecord.start_time, campaignRecord.end_time)"
            />
            <div class="claimAirDrop__data">
              <ClaimInfo :header="$t('AIRDROP.CLAIMED')">
                <div class="claimAirDrop__data-text">
                  <CoinAmount :amount="calculateMissions(campaignRecord)" :show-denom="true" :precision="2"></CoinAmount>
                  /
                  <CoinAmount :amount="campaignRecord.amount" :show-denom="true" :precision="2"></CoinAmount>
                </div>
              </ClaimInfo>
              <ClaimInfo :header="$t('AIRDROP.MISSION_COMPLETED')">
                <p class="claimAirDrop__data-text">{{getAmountOfClaimedMissions(campaignRecord)}}/{{campaignRecord.missions.length}}</p>
              </ClaimInfo>
              <ClaimInfo :header="getTextForTimeColumn(campaignRecord)">
                <p class="claimAirDrop__data-text">{{calculateTimeToPass(campaignRecord.start_time, campaignRecord.end_time)}}</p>
              </ClaimInfo>
              <ClaimInfo :header="$t('AIRDROP.TOTAL_DISTRIBUTION')">
                <div class="claimAirDrop__data-text">
                  <CoinAmount :amount="campaignRecord.totalDistribution" :show-denom="true" :precision="2"></CoinAmount>
                </div>
              </ClaimInfo>
            </div>
            <div class="claimAirDrop__body">
              <button v-if="campaignRecord.missions.length > 0" @click="setActiveCampaign(campaignRecord)" class="claimAirDrop__showBtn claimAirDrop__basicText">
                <ChevronDown :size="15" v-if="activeCampaign !== campaignRecord"/>
                <ChevronUp :size="15" v-else/>
                <p>{{ activeCampaign === campaignRecord ? $t('AIRDROP.HIDE_MISSIONS') : $t('AIRDROP.SHOW_MISSIONS') }}</p>
              </button>
              <div v-if="activeCampaign === campaignRecord" class="claimAirDrop__missions">
                <div class="claimAirDrop__missions-body" v-for="(missions, id) in campaignRecord.missions" v-bind:key="id">
                  <div class="claimAirDrop__leftCol">
                    <div class="claimAirDrop__smallTxt">
                      {{ $t('AIRDROP.MISSION')}} {{`#${missions.id}`}}
                    </div>
                    <div>
                      {{missions.description === 'Initial mission - basic mission that must be claimed first' ? $t('AIRDROP.INITIAL') : missions.description}}
                       ({{missions.weightInPerc}}%) -
                      <CoinAmount :amount="missions.weight" :show-denom="true" :precision="2"></CoinAmount>
                    </div>
                  </div>

                    <Button
                      v-if="!missions.claimed"
                      :disabled="!isDisabled(campaignRecord, missions)"
                      class="p-button p-component secondary claimAirDrop__missions-btn"
                      :label="getTextForMissionsBtn(missions, missions.mission_type)"
                      @click="redirectMission(campaignRecord, missions, missions.mission_type)"
                    />

                  <Button
                    v-else
                    class="p-button p-component secondary claimAirDrop__missions-shareBtn"
                    @click.prevent="() => {popupMission = missions; popupCampaign = campaignRecord; generateSocialMediaMessage(); sharePopupStatus = true;}"
                  >
                    Share
                  </Button>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div class="claimAirDrop" v-else>
    <div class="claimAirDrop__total">
      <div class="claimAirDrop__container">
        <div class="claimAirDrop__header claimAirDrop__mainTxt">
          <h4>{{$t('AIRDROP.CONNECT_INFO')}}</h4>
          <Button v-if="!useUserStore().isLoggedIn" class="secondary h-3rem" @click="loginPopupStatus =! loginPopupStatus">
            {{$t('COMMON.CONNECT') }}
          </Button>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="sharePopupStatus" modal header="Congratulations!" :style="{ width: '50vw' }">
    <div class="sharePopup">
      <h3>Share this claim on your social media!</h3>
      <p>{{socialMediaMessage}}</p>
      <a :href='`https://twitter.com/intent/tweet?text=${socialMediaMessage}`' target="_blank">
        <button>
          <svg width="32" height="25" viewBox="0 0 32 25" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.2481 0C30.0294 0.723392 27.5842 1.70927 26.1468 1.99363C26.1046 2.00456 26.0702 2.01862 26.0296 2.02956C24.7594 0.776514 23.0189 0 21.0924 0C17.2099 0 14.0616 3.14824 14.0616 7.03081C14.0616 7.23548 14.0444 7.61202 14.0616 7.81201C8.82289 7.81201 4.83564 5.06843 1.97644 1.5624C1.66552 2.3436 1.52959 3.5779 1.52959 4.7372C1.52959 6.92613 3.24042 9.076 5.90432 10.4087C5.41372 10.5353 4.87313 10.6259 4.31067 10.6259C3.40291 10.6259 2.44204 10.3869 1.5624 9.6619C1.5624 9.68846 1.5624 9.71346 1.5624 9.74158C1.5624 12.8008 4.80907 14.8834 7.69639 15.4631C7.11049 15.8084 5.92932 15.8428 5.35279 15.8428C4.94657 15.8428 3.50916 15.6568 3.1248 15.585C3.92788 18.0926 6.82457 19.5019 9.58534 19.5519C7.4261 21.2455 5.92775 21.8736 1.50616 21.8736H0C2.79358 23.6641 6.35117 25 9.91657 25C21.5252 25 28.1232 16.1521 28.1232 7.81201C28.1232 7.67764 28.1201 7.39641 28.1154 7.11362C28.1154 7.08549 28.1232 7.05893 28.1232 7.03081C28.1232 6.98863 28.1107 6.948 28.1107 6.90582C28.1061 6.69333 28.1014 6.49491 28.0967 6.39179C29.331 5.50122 30.4012 4.39035 31.2481 3.1248C30.1153 3.6279 28.8998 3.96538 27.6233 4.11849C28.9263 3.33729 30.7778 1.47491 31.2481 0Z" fill="white"/>
          </svg>
          Tweet
        </button>
      </a>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useAirDropStore } from "@/store/airDrop.store";
import {computed, onMounted, onUnmounted, ref} from "vue";
import { useUserStore } from "@/store/user.store";
import { CampainStatus } from "@/models/airdrop/airdrop";
import { Campaign, Mission, MissionTypeSt } from "@/models/store/airdrop";
import PercentageBar from "@/components/commons/PercentageBar.vue";
import ClaimInfo from "@/components/airdrop/dropComponents/ClaimInfo.vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import router from "@/router";
import ClaimingOptionsPopup from "@/components/airdrop/ClaimingOptionsPopup.vue";
import {useI18n} from "vue-i18n";
import {BigDecimal} from "@/models/store/big.decimal";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import {ChevronDown, ChevronUp} from "lucide-vue-next";
import dataService from "@/services/data.service";
import Dialog from 'primevue/dialog';

const percentsBar = ref();
const i18n = useI18n();
const loginPopupStatus = ref(false);
const sharePopupStatus = ref(false);
const isFinal = ref(false);
// const currentLang = computed(() => {
//   return i18n.global.locale;
// });
const airDropStore = useAirDropStore();

const claimingProcessStarted = ref();
const isLoggedIn = computed(() =>{
  return useUserStore().isLoggedIn;
});
const address = computed(() => {
  return useUserStore().getAccount.address;
});

onMounted(() => {
  dataService.enterClaimAirdrop();

});

onUnmounted(() => {
  dataService.leaveClaimAirdrop();
});

const summary = computed(()=>{
  return useAirDropStore().getSummary;
});

const activeCampaign = ref();
function setActiveCampaign(campaign: Campaign){
  if(campaign !== activeCampaign.value){
    activeCampaign.value = campaign;
  } else {
    activeCampaign.value = undefined;
  }
}

function calculateMissions(campaign : Campaign){
  let total = 0;
  campaign.missions.forEach((el) => {
    if(el.claimed){
      total += Number(el.weight);
    }
  });
  return total;
}
function getAmountOfClaimedMissions(campaign : Campaign){
  let total = 0;
  campaign.missions.forEach((el) => {
    if(el.claimed){
      total++;
    }
  });
  return total;
}

const airdropClaimRecord = computed(() => {
  return airDropStore.getCampaigns;
});

function checkCampaignStatus(startTime: number | string, endTime: number | string) {
  if(new Date(startTime).getTime() < new Date(Date.now()).getTime() && new Date(endTime).getTime()> new Date(Date.now()).getTime()){
    return CampainStatus.Now;
  }else if(new Date(startTime).getTime() > new Date(Date.now()).getTime()){
    return CampainStatus.Future;
  } else {
    return CampainStatus.Past;
  }
}

function calculateProgress(startTime: number | string, endTime: number | string){
  if(new Date(startTime).getTime() < Date.now() && new Date(endTime).getTime()> Date.now()){
    const startEndDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const difference = Date.now() - new Date(endTime).getTime();
    return Math.abs(100 - ((Math.abs(difference)/Math.abs(startEndDiff)) * 100));
  }
  else{
    return null;
  }
}

const updateComponent = ref(false);

function getTextForTimeColumn(campaign: Campaign){
  const res = checkCampaignStatus(campaign.start_time, campaign.end_time);
  switch (res){
    case CampainStatus.Past: return i18n.t('AIRDROP.CAMPAIGN_PASSED');
    case CampainStatus.Now: return i18n.t('AIRDROP.CAMPAIGN_END');
    case CampainStatus.Future: return i18n.t('AIRDROP.CAMPAIGN_START');
  }
}
function calculateTimeToPass(startDate: number | string, endDate: number | string){
  if(new Date(startDate).getTime() < new Date(Date.now()).getTime() && new Date(endDate).getTime()> new Date(Date.now()).getTime()){
    const now = new Date(Date.now());
    const difference = new Date(endDate).getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else if(new Date(endDate).getTime()> new Date(Date.now()).getTime()){
    const now = new Date(Date.now());
    const difference = new Date(startDate).getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else {
    return '';
  }
}

setInterval(() => {
    updateComponent.value = !updateComponent.value;
},1000);

function getTextForMissionsBtn(mission: Mission, type: MissionTypeSt){
  let text;
  switch (type){
    case MissionTypeSt.INITIAL_CLAIM: text = i18n.t('AIRDROP.CLAIM');
    break;
    case MissionTypeSt.DELEGATE: text = i18n.t('AIRDROP.DELEGATE');
    break;
    case MissionTypeSt.VOTE: text = i18n.t('AIRDROP.VOTE');
    break;
    case MissionTypeSt.CLAIM: text = i18n.t('AIRDROP.CLAIM');
    break;
  }
  if(mission.completed && !mission.claimed){
    text = i18n.t('AIRDROP.CLAIM');
  }
  return text;
}

const selectedMissionId = ref();
const selectedCampaignId = ref();
const currentClaimIsInitial = ref();
const selectedCampaignName = ref();

function redirectMission(campaign: Campaign, mission : Mission, type: MissionTypeSt) {
  selectedCampaignId.value = campaign.id;
  selectedMissionId.value = mission.id;
  isFinal.value = (campaign.missions.length - getAmountOfClaimedMissions(campaign) === 1);
  selectedCampaignName.value = campaign.name;

  if (mission.mission_type === MissionTypeSt.INITIAL_CLAIM) {
    claimingProcessStarted.value = true;
    currentClaimIsInitial.value = true;
  }else if(mission.mission_type === MissionTypeSt.CLAIM){
    claimingProcessStarted.value = true;
    currentClaimIsInitial.value = false;
  } else {
    currentClaimIsInitial.value = false;
    if (mission.completed && !mission.claimed) {
      claimingProcessStarted.value = true;
    } else {
      switch (type) {
        case MissionTypeSt.DELEGATE:
          router.push('staking');
          break;
        case MissionTypeSt.VOTE:
          router.push('governance');
          break;
      }
    }
  }
}



function isDisabled(campaignRec: Campaign, mission: Mission) {
  if (!campaignRec.enabled){
    return false;
  } else if(checkCampaignStatus(campaignRec.start_time, campaignRec.end_time) !== CampainStatus.Now){
    return false;
  } else if(!isInitialMissionClaimed(campaignRec) && mission.mission_type !== MissionTypeSt.INITIAL_CLAIM){
    return false;
  } else if(mission.claimed){
    return false;
  }
  return true;
}

function isInitialMissionClaimed(campaign: Campaign) {
  const initialMission = campaign.missions.find((mission)=> {
    return mission.mission_type === 'INITIAL_CLAIM';
  });
  return initialMission?.claimed;
}

function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}

const popupMission = ref<Mission>();
const popupCampaign = ref<Campaign>();
const socialMediaMessage = ref<string>();

const generateSocialMediaMessage = () => {
  socialMediaMessage.value = `I have completed mission ${popupMission.value?.name} with a value of ${Number(popupMission.value?.weight) / 1000000} C4E from campaign ${popupCampaign.value?.name} on Airdrop Allocation!`;
};


const handleFinal = () => {
  sharePopupStatus.value = true;
  socialMediaMessage.value = `I have completed the whole campaign ${selectedCampaignName.value}!`;
  isFinal.value = false;
};

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.claimAirDrop{
  font-family: 'Inter', sans-serif;
  width: 100%;
  &__total{
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    //grid-template-columns: repeat(auto-fill, minmax(calc(100% / 8), 1fr));
    //grid-area: 1/2/7/6;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 5;
    }
  }
  &__basicText{
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
  }
  &__mainTxt{
    font-weight: 700;
    font-size: 31px;
    line-height: 38px;
  }
  &__container {
    width: 60%;
    margin: 0 auto;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    padding: 1.5em 5%;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    color: $header-text-color;
    background-color: $main-color;
    @media (max-width: 1200px) {
      grid-area: 1 /1/ 1 / 9;
    }
  }
  &__summaryData {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__summaryTile {
    flex: 1 1;
    margin: 0 5px;
    height: 120px;
  }
  &__data{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
    grid-column-gap: 9px;
    grid-row-gap: 9px;
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
    font-size: 31px;
    line-height: 38px;
    margin: 15px 10px 25px;
    h4 {
      margin: 0;
    }
  }
  &__progressHeader{
    display: flex;
    align-items: flex-start;
    width: 100%;
  }
  &__body{
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  &__showBtn{
    width: 215px;
    background: transparent;
    border: none;
    margin-bottom: 17px;
    color: $header-text-color;
    font-weight: 400;
    font-size: 18px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 0;
    }
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
      box-shadow: 0 0 2px 2px #02447A;
      border-radius: 2px;
      margin-bottom: 10px;
    }
    &-btn {
      width: 130px;
      max-height: 42px !important;
      margin: 8px !important;
      border-radius: 5px !important;
      color: $header-text-color !important;
      background-color: $secondary-color !important;
      border-color: $secondary-color !important;
      box-sizing: border-box !important;

      &:not(.p-button-icon-only):not(.secondary):not(.outlined):not(.outlined-secondary):not(.preview):not(.delete) {
        background-color: $secondary-color !important;
        color: $header-text-color !important;
        border-color: $secondary-color !important;

        &:hover {
          background-color: $secondary-color !important;
        }
      }
    }
    &-shareBtn {
      width: 130px;
      max-height: 42px !important;
      margin: 8px !important;
      border-radius: 5px !important;
      box-sizing: border-box !important;
      color: $secondary-color !important;
      border: $secondary-color 1px solid !important;
      background-color: #002C50 !important;
      transition: all 0.2s linear;
      &:hover {
        background-color: white !important;
        color: #002C50 !important;
      }
    }

  }
  &__percents{
    width: 100%;
    height: 30px;
  }
  &__smallTxt{
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 5px;
  }
  &__leftCol{
    text-align: initial;
    width: 75%;
  }
  &__boldText {
    font-weight: 700;
  }
  &__hr {
    margin: 0 0 1em;
    color: $secondary-color;
    font-size: 1.5em;
    align-items: center;
    width: 100%;
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

.vl {
  height: 120px;
  border: 1px solid white;
  margin: 0 8px;
}

.sharePopup {
  padding: 15px 5%;
  text-align: justify;
  p {
    margin: 20px 0;
  }
  button {
    height: 50px;
    padding: 10px 40px;
    border-radius: 25px;
    border: none;
    background-color: #1DA1F2;
    color: white;
  }
}
</style>
