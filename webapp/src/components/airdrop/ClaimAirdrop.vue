<template>
  <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
  <div class="claimAirDrop" v-if="useUserStore().isLoggedIn && useUserStore().getAccount.address">
    <ClaimingOptionsPopup v-if="claimingProcessStarted" @close="claimingProcessStarted = false" @claim='claim'/>
    <div class="claimAirDrop__total">
      <div class="claimAirDrop__container">
        <h4 class="claimAirDrop__header claimAirDrop__mainTxt">{{ $t('AIRDROP.TOTAL_HEADER') }}</h4>
        <div class="claimAirDrop__summaryData claimAirDrop__basicText">
          <ClaimInfo :header="$t('AIRDROP.TOTAL')" class="claimAirDrop__boldText claimAirDrop__summaryTile">
            <CoinAmount :amount="useAirDropStore().getSummary.totalAmount" :show-denom="true" :show-tooltip="true" :precision="2"/>
          </ClaimInfo>
          <ClaimInfo :header="$t('AIRDROP.TOTAL_CLAIMED')" class="claimAirDrop__boldText claimAirDrop__summaryTile" :percentage-vale="useAirDropStore().getSummary.claimedPercent">
            <CoinAmount :amount="useAirDropStore().getSummary.totalClaimed" :show-denom="true" :show-tooltip="true" :precision="2"/>
          </ClaimInfo>
          <div class="vl"/>
          <ClaimInfo :header="$t('AIRDROP.ACTIVE')" class="claimAirDrop__boldText claimAirDrop__summaryTile">
            <CoinAmount :amount="useAirDropStore().getSummary.activeCampaigns" :show-denom="true" :show-tooltip="true" :precision="2"/>
          </ClaimInfo>
          <ClaimInfo :header="$t('AIRDROP.TO_CLAIM')" class="claimAirDrop__boldText claimAirDrop__summaryTile" :percentage-vale="useAirDropStore().getSummary.toClaimPercent">
            <CoinAmount :amount="useAirDropStore().getSummary.toClaim" :show-denom="true" :show-tooltip="true" :precision="2"/>
          </ClaimInfo>
        </div>
      </div>
    </div>
    <div class="claimAirDrop__total claimAirDrop__basicText" v-for="(campaign, index) in airDropStore.getCampaigns" :key="index">
      <div class="claimAirDrop__container">
        <h4 class="claimAirDrop__header">{{ campaign.name }}</h4>
        <hr class="claimAirDrop__hr"/>
        <div class="claimAirDrop__progressHeader">
          <h5 style="margin: 0 0 20px 10px" v-if="checkCampaignStatus(campaign.start_time, campaign.end_time) !== CampainStatus.Past">
            {{ $t('CLAIM_AIRDROP.PROGRESS') }}</h5>
          <h5 v-else style="margin: 0 0 20px 10px">{{ $t('CLAIM_AIRDROP.FINISHED') }}</h5>
        </div>

        <PercentageBar
          v-if="checkCampaignStatus(campaign.start_time, campaign.end_time) !== CampainStatus.Past"
          :key="updateComponent"
          :amount="calculateProgress(campaign.start_time, campaign.end_time)"
          :status="checkCampaignStatus(campaign.start_time, campaign.end_time)"
          :time-to-pass="calculateTimeToPass(campaign.start_time, campaign.end_time)"
        />
        <div class="claimAirDrop__data">
          <ClaimInfo :header="$t('AIRDROP.CLAIMED')">
            <div class="claimAirDrop__data-text">
              <CoinAmount :amount="calculateMissions(campaign)" :show-denom="true" :precision="2"></CoinAmount>
              /
              <CoinAmount :amount="campaign.amount" :show-denom="true" :precision="2"></CoinAmount>
            </div>
          </ClaimInfo>
          <ClaimInfo :header="$t('AIRDROP.MISSION_COMPLETED')">
            <p class="claimAirDrop__data-text">
              {{ getAmountOfClaimedMissions(campaign) }}/{{ campaign.missions.length }}</p>
          </ClaimInfo>
          <ClaimInfo :header="getTextForTimeColumn(campaign)">
            <p class="claimAirDrop__data-text" v-if="calculateTimeToPass(campaign.start_time, campaign.end_time)">
              {{ calculateTimeToPass(campaign.start_time, campaign.end_time) }}</p>
            <DateCommon :date="new Date(campaign.end_time)" :show-time="false" :show-tooltip="true" v-else/>
          </ClaimInfo>
          <ClaimInfo :header="$t('AIRDROP.TOTAL_DISTRIBUTION')">
            <div class="claimAirDrop__data-text">
              <CoinAmount :amount="campaign.totalDistribution" :show-denom="true" :precision="2"></CoinAmount>
            </div>
          </ClaimInfo>
        </div>
        <div class="claimAirDrop__body">
          <button v-if="campaign.missions.length > 0" @click="setActiveCampaign(campaign)" class="claimAirDrop__showBtn claimAirDrop__basicText">
            <ChevronDown :size="15" v-if="activeCampaign?.id !== campaign.id"/>
            <ChevronUp :size="15" v-else/>
            <p>{{ activeCampaign?.id === campaign.id ? $t('AIRDROP.HIDE_MISSIONS') : $t('AIRDROP.SHOW_MISSIONS') }}</p>
          </button>
          <div v-if="activeCampaign?.id === campaign.id" class="claimAirDrop__missions">
            <div class="claimAirDrop__missions-body" v-for="(missions, id) in campaign.missions" v-bind:key="id">
              <div class="claimAirDrop__leftCol">
                <div class="claimAirDrop__smallTxt">
                  {{ $t('AIRDROP.MISSION') }} {{ `#${missions.id}` }}
                </div>
                <div>
                  {{ missions.description === 'Initial mission - basic mission that must be claimed first' ? $t('AIRDROP.INITIAL') : missions.description }}
                  ({{ missions.weightInPerc }}%) -
                  <CoinAmount :amount="missions.weight" :show-denom="true" :precision="2"></CoinAmount>
                </div>
              </div>
              <Button v-if="!missions.claimed" :disabled="!isDisabled(campaign, missions)" class="p-button p-component secondary claimAirDrop__missions-btn"
                      :label="getTextForMissionsBtn(missions, missions.mission_type)"
                      @click="redirectMission(campaign, missions, missions.mission_type)"/>

              <Button v-else class="p-button p-component secondary claimAirDrop__missions-shareBtn"
                      label="Share"
                      @click.prevent="onClickedShareButton(campaign, missions)"/>
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
          <h4>{{ $t('AIRDROP.CONNECT_INFO') }}</h4>
          <Button v-if="!useUserStore().isLoggedIn" class="secondary h-3rem connectBtn" @click="loginPopupStatus =! loginPopupStatus">
            {{ $t('COMMON.CONNECT') }}
          </Button>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="sharePopupStatus" modal :header="$t('AIRDROP.SHARE_MESSAGE_HEADER')" :style="{ width: '50vw', 'min-width': '300px' }">
    <div class="sharePopup">
      <h3>{{ $t('AIRDROP.SHARE_MESSAGE_BASE') }}</h3>
      <p>{{ socialMediaMessage }}</p>
      <a :href='`https://twitter.com/intent/tweet?text=${socialMediaMessage}`' target="_blank">
        <button>
          <svg  width="32" height="24" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1668.56 1221.19" xml:space="preserve">
              <path d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
                    fill="white"/>
          </svg>
          Tweet
        </button>
      </a>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {useAirDropStore} from "@/store/airDrop.store";
import {computed, onBeforeMount, onMounted, onUnmounted, ref, watch} from "vue";
import {useUserStore} from "@/store/user.store";
import {CampainStatus} from "@/models/airdrop/airdrop";
import {Campaign, Mission, MissionTypeSt} from "@/models/store/airdrop";
import PercentageBar from "@/components/commons/PercentageBar.vue";
import ClaimInfo from "@/components/airdrop/dropComponents/ClaimInfo.vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import router from "@/router";
import ClaimingOptionsPopup from "@/components/airdrop/ClaimingOptionsPopup.vue";
import {useI18n} from "vue-i18n";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import {ChevronDown, ChevronUp} from "lucide-vue-next";
import dataService from "@/services/data.service";
import Dialog from 'primevue/dialog';
import DateCommon from "@/components/commons/DateCommon.vue";
import {useToast} from "vue-toastification";
import {formatBigNumberLocalized, reduceBigNumberLocalized} from "@/utils/locale-number-formatter";

let isFinal = false;
let currentClaimIsInitial = false;
let intervalId = 0;

const loginPopupStatus = ref<boolean>(false);
const sharePopupStatus = ref<boolean>(false);

const claimingProcessStarted = ref<boolean>(false);
const activeCampaign = ref<Campaign>();
const updateComponent = ref(false);

const selectedMission = ref<Mission>();
const selectedCampaign = ref<Campaign>();

const socialMediaMessage = ref<string>();

const i18n = useI18n();
const airDropStore = useAirDropStore();

const userLoggedIn = computed(() => {
  return useUserStore().getAccount.address != '';
});

onBeforeMount(()=>{
  intervalId = window.setInterval(() => { updateComponent.value = !updateComponent.value;}, 1000);
});

onMounted(() => {
  dataService.onClaimAirdropSelected();
});

onUnmounted(() => {
  window.clearInterval(intervalId);
  dataService.onClaimAirdropUnselected();
});

watch(userLoggedIn, () => {
  console.log("watch: userLoggedIn - CHANGED");
  claimingProcessStarted.value = false;
  sharePopupStatus.value = false;
  loginPopupStatus.value = false;
});



function onClickedShareButton(campaignRecord: Campaign, mission: Mission) {
  generateSocialMediaMessage(campaignRecord, mission);
  sharePopupStatus.value = true;
}

function setActiveCampaign(campaign: Campaign) {
  if (campaign !== activeCampaign.value) {
    activeCampaign.value = campaign;
  } else {
    activeCampaign.value = undefined;
  }
}

function calculateMissions(campaign: Campaign) {
  let total = 0;
  campaign.missions.forEach((el) => {
    if (el.claimed) {
      total += Number(el.weight);
    }
  });
  return total;
}

function getAmountOfClaimedMissions(campaign: Campaign) {
  let total = 0;
  campaign.missions.forEach((el) => {
    if (el.claimed) {
      total++;
    }
  });
  return total;
}

function checkCampaignStatus(startTime: number | string, endTime: number | string) {
  if (new Date(startTime).getTime() < new Date(Date.now()).getTime() && new Date(endTime).getTime() > new Date(Date.now()).getTime()) {
    return CampainStatus.Now;
  } else if (new Date(startTime).getTime() > new Date(Date.now()).getTime()) {
    return CampainStatus.Future;
  } else {
    return CampainStatus.Past;
  }
}

function calculateProgress(startTime: number | string, endTime: number | string) {
  if (new Date(startTime).getTime() < Date.now() && new Date(endTime).getTime() > Date.now()) {
    const startEndDiff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const difference = Date.now() - new Date(endTime).getTime();
    return Math.abs(100 - ((Math.abs(difference) / Math.abs(startEndDiff)) * 100));
  } else {
    return null;
  }
}

function getTextForTimeColumn(campaign: Campaign) {
  const res = checkCampaignStatus(campaign.start_time, campaign.end_time);
  switch (res) {
    case CampainStatus.Past:
      return i18n.t('AIRDROP.CAMPAIGN_PASSED');
    case CampainStatus.Now:
      return i18n.t('AIRDROP.CAMPAIGN_END');
    case CampainStatus.Future:
      return i18n.t('AIRDROP.CAMPAIGN_START');
  }
}

function calculateTimeToPass(startDate: number | string, endDate: number | string) {
  if (new Date(startDate).getTime() < new Date(Date.now()).getTime() && new Date(endDate).getTime() > new Date(Date.now()).getTime()) {
    const now = new Date(Date.now());
    const difference = new Date(endDate).getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  } else if (new Date(endDate).getTime() > new Date(Date.now()).getTime()) {
    return i18n.t('AIRDROP.SOON');
  } else {
    return '';
  }
}

function getTextForMissionsBtn(mission: Mission, type: MissionTypeSt) {
  let text;
  switch (type) {
    case MissionTypeSt.INITIAL_CLAIM:
      text = i18n.t('AIRDROP.CLAIM');
      break;
    case MissionTypeSt.DELEGATE:
      text = i18n.t('AIRDROP.DELEGATE');
      break;
    case MissionTypeSt.VOTE:
      text = i18n.t('AIRDROP.VOTE');
      break;
    case MissionTypeSt.CLAIM:
      text = i18n.t('AIRDROP.CLAIM');
      break;
    case MissionTypeSt.TO_DEFINE:
      text = i18n.t('AIRDROP.TO_DEFINE');
      break;
  }
  if (mission.completed && !mission.claimed) {
    text = i18n.t('AIRDROP.CLAIM');
  }
  return text;
}

function redirectMission(campaign: Campaign, mission: Mission, type: MissionTypeSt) {
  selectedCampaign.value = campaign;
  selectedMission.value = mission;
  isFinal = (campaign.missions.length - getAmountOfClaimedMissions(campaign) === 1);

  if (mission.mission_type === MissionTypeSt.INITIAL_CLAIM) {
    claimingProcessStarted.value = true;
    currentClaimIsInitial = true;
  } else if (mission.mission_type === MissionTypeSt.CLAIM) {
    currentClaimIsInitial = false;
    dataService.onClaimOtherAirdrop(campaign, mission);
  } else {
    currentClaimIsInitial = false;
    if (mission.completed && !mission.claimed) {
      dataService.onClaimOtherAirdrop(campaign, mission);
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
  if (!campaignRec.enabled) {
    return false;
  } else if (checkCampaignStatus(campaignRec.start_time, campaignRec.end_time) !== CampainStatus.Now) {
    return false;
  } else if (!isInitialMissionClaimed(campaignRec) && mission.mission_type !== MissionTypeSt.INITIAL_CLAIM) {
    return false;
  } else if (mission.claimed || mission.mission_type === MissionTypeSt.TO_DEFINE) {
    return false;
  }
  return true;
}

function isInitialMissionClaimed(campaign: Campaign) {
  const initialMission = campaign.missions.find((mission) => {
    return mission.mission_type === 'INITIAL_CLAIM';
  });
  return initialMission?.claimed;
}

function generateSocialMediaMessage(campaign: Campaign, mission?: Mission) {
  if (isFinal) {
    const campaignAmount = transformToExpView(campaign.amount.amount);
    socialMediaMessage.value = i18n.t('AIRDROP.SHARE_MESSAGE_CAMPAIGN_COMPLETED', {campaignName: campaign?.name, campaignAmount: campaignAmount});
    isFinal = false;
  } else {
    const missionAmount = transformToExpView(Number(mission?.weight) / 1000000);
    socialMediaMessage.value = i18n.t('AIRDROP.SHARE_MESSAGE_MISSION_COMPLETED', {campaignName: campaign?.name, missionName:mission?.name, missionAmount:missionAmount});
  }
}

function transformToExpView(amount: number | bigint) {
  return formatBigNumberLocalized(typeof amount === 'bigint' ? amount.toString() : amount.toFixed(6));
}

function handleMissionCompleted(campaign: Campaign, mission: Mission) {
  generateSocialMediaMessage(campaign, mission);
  claimingProcessStarted.value = false;
  sharePopupStatus.value = true;
}

function claim(address: string) {
  console.log("claim:", address);
  if (selectedCampaign.value && selectedMission.value) {
    if (currentClaimIsInitial) {
      dataService.onClaimInitialAirdrop(selectedCampaign.value, selectedMission.value, address, onSuccessClaim);
    } else {
      dataService.onClaimOtherAirdrop(selectedCampaign.value, selectedMission.value, onSuccessClaim);
    }
  } else {
    console.warn("claim: selectedCampaign or selectedMission not provided!!");
  }
}

function onSuccessClaim(campaign: Campaign, mission: Mission){
  useToast().success(i18n.t('AIRDROP.SUCCESS'));
  handleMissionCompleted(campaign, mission);
}

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.claimAirDrop {
  font-family: 'Inter', sans-serif;
  width: 100%;

  &__total {
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

  &__basicText {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
  }

  &__mainTxt {
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
    align-items: center;
  }

  &__summaryTile {
    flex: 2 1;
    margin: 5px;

    height: 120px;
    min-width: 120px;
  }

  &__data {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: space-between;
    &-text {
      margin: 0;
    }
  }

  &__header {

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

  &__progressHeader {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  &__body {
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__showBtn {
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

  &__missions {
    transition: 2s ease-in-out;
    width: 100%;

    &-body {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      background-color: #013C6C;
      padding: 3.5px 13px;
      box-shadow: 0 0 2px 2px #02447A;
      border-radius: 2px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    &-btn {
      width: 130px;
      max-height: 42px !important;
      margin: 8px auto !important;
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
      margin: 8px auto !important;
      border-radius: 5px !important;
      box-sizing: border-box !important;
      color: $secondary-color !important;
      border: $secondary-color 1px solid !important;
      background-color: #002C50 !important;
      transition: all 0.2s linear;
      box-sizing: border-box !important;


      &:hover {
        background-color: white !important;
        color: #002C50 !important;
      }
    }

  }

  &__percents {
    width: 100%;
    height: 30px;
  }

  &__smallTxt {
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 5px;
  }

  &__leftCol {
    text-align: initial;
    flex: 1 1;
    min-width: 250px;
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

  &__content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc((100% / 8) - 5px), 1fr));
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      grid-column-gap: 0;
      grid-row-gap: 10px;
    }
  }

  &__items {
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
  text-align: left;

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

.connectBtn {
  font-size: 1rem !important;
}

@media (max-width: 1400px) {
  .claimAirDrop__container {
    width: 90%;
  }

  .claimAirDrop__total {
    grid-area: auto;
  }

  .claimAirDrop__content {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }


}

@media (max-width: 1024px) {
  .claimAirDrop__container {
    width: 90%;

  }
  .claimAirDrop__content {
    width: 100%;
  }

  .claimAirDrop__content {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

}

@media (max-width: 660px) {
  .vl {
    display: none;
  }
  .claimAirDrop__summaryTile {
    width: 50%;
  }
}
</style>
