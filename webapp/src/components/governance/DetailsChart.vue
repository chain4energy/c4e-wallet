<template>
  <div  v-if="selectedProposal.proposal && option !== false" class="chart-container">
    <div class="top">
<!--      {{selectedProposal.proposalDetailsTally}}-->
      <span>{{ $t("GOVERNANCE_VIEW.TOTAL_VOTED") }} / {{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>
<!--        <CoinAmount :amount="useProposalsStore().getSelectedProposalTally.total" :reduce-big-number="true" :precision="2"/> /-->
        <CoinAmount :amount="wrapBigInt(totalVotes)" :reduce-big-number="true" :precision="2"/> /
        <CoinAmount :amount="wrapBigInt(bondedTokens)" :reduce-big-number="true" :precision="2"/>
      </span>

    </div>
    <div class="top">
      <span>
        {{ $t("GOVERNANCE_VIEW.CURRENT_TURNOUT") }}
      </span>
      <span>
        {{calculatePercents(Number(totalVotes), Number(bondedTokens), 2)}}%
      </span>
    </div>

    <ShadowedSvgChart id="voteschartdiv" class="chartdiv">
        <v-chart :option="option" autoresize />
        <div class="inside">
          <Icon :name=icons.get(getProposalStatus())></Icon>
          {{ $t("GOVERNANCE_VIEW."+getProposalStatus())}}
        </div>
    </ShadowedSvgChart>
<!--    <ProgressBarComponent v-if="getProposalStatus()===ProposalStatus.VOTING_PERIOD" ref="childRef" @refresh="updateVotes" :loading-time="useConfigurationStore().getConfig.proposalVotingRefreshTimeout" style="width: 100%"></ProgressBarComponent>-->
    <div class="voting-result">
      <div style="display: flex; align-items: center">
        <div class="dot yes"></div>
        <div class="bar-legend">
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div style="font-weight: bold">
            <PercentsView :amount="yesPercentage" :precision="2"></PercentsView>
          </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.yes" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="wrapBigInt(yes)" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot abstain"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="abstainPercentage" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.abstain" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="wrapBigInt(abstain)" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="noPercentage" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.no" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="wrapBigInt(no)" :reduce-big-number="true" :precision="2"/>)
      </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no-with-veto"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="noWithVetoPercentage" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.noWithVeto" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="wrapBigInt(noWithVeto)" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
    </div>
    <div class="bottom">
      <Button
        class="p-button-raised p-button-rounded"
        data-bs-toggle="modal" data-bs-target="#voteModal"
        :disabled="
        selectedProposal.proposal?.status !== ProposalStatus.VOTING_PERIOD"
      >
        <GovernanceIcon icon="vote"/>
        {{$t('GOVERNANCE_VIEW.VOTE')}}
      </Button>
      <VoteModal id="voteModal" :proposalId="selectedProposal.proposal?.proposalId" :title="getProposalTitle()"></VoteModal>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, onBeforeMount, onMounted, ref} from "vue";
import {PieChart} from "echarts/charts";
import VChart from "vue-echarts";
import {use} from "echarts/core";
import {SVGRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";
import VoteModal from "@/components/governance/VoteModal.vue";
import Icon from "../features/IconComponent.vue";
import {Proposal, ProposalDetailsTally, ProposalStatus} from "@/models/store/proposal";
import {useConfigurationStore} from "@/store/configuration.store";
import {createProposalDetailsChartData} from "@/charts/governance";
import {useProposalsStore} from "@/store/proposals.store";
import ShadowedSvgChart from "../commons/ShadowedSvgChart.vue";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView.vue";
import GovernanceIcon from "../commons/GovernanceIcon.vue";
import {useTokensStore} from "@/store/tokens.store";
import {BigIntWrapper} from "@/models/store/common";
import ProgressBarComponent from "@/components/features/ProgressBarComponent.vue";
import dataService from "@/services/data.service";

use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

onBeforeMount(async () => {
  if (selectedProposal.value?.proposal?.status && selectedProposal.value?.proposal.status !== ProposalStatus.VOTING_PERIOD) {
    await dataService.onProposalUpdateVotes(selectedProposal.value?.proposal.proposalId);
  }
});

onBeforeMount(()=>{
  console.log("Selected proposal:" + JSON.stringify(selectedProposal.value));
  console.log("Selected proposal - yes:" + yes.value);
  console.log("Selected proposal - no:" + yes.value);
  console.log("Selected proposal - abstain:" + abstain.value);
  console.log("Selected proposal - noWithVeto:" + noWithVeto.value);
  console.log("Selected proposal - notVoted:" + notVoted.value);
});

const selectedProposal = computed(()=>{
  return useProposalsStore().selectedProposal;
});

function wrapBigInt(value :bigint| undefined){
  return value!==undefined ? new BigIntWrapper(value) : 0;
}

if(selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD) {
  setInterval(() => {
    updateVotes();
  },useConfigurationStore().getConfig.proposalVotingRefreshTimeout);
}

const childRef = ref<InstanceType<typeof ProgressBarComponent>>();


const icons  = new Map<string, string>([
  [ProposalStatus.PASSED, 'CheckSquare'],
  [ProposalStatus.REJECTED, 'XCircle'],
  [ProposalStatus.VOTING_PERIOD, ''],
  [ProposalStatus.UNSPECIFIED, ''],
  [ProposalStatus.DEPOSIT_PERIOD, ''],
  [ProposalStatus.FAILED, ''],
]);

const proposalsStore = useProposalsStore();
const sumOfVotes = computed(() => {
  // const val = useProposalsStore().getProposalDetailsTally?.totalChart;
  const val = selectedProposal.value.proposalDetailsTally?.totalChart;
  return (val && val > 0) ? val : -1n;
});

const updateVotes = async () => {
  if(selectedProposal.value.proposal?.proposalId) {
    console.log('refresh');
    await dataService.onProposalUpdateVotes(selectedProposal.value.proposal.proposalId);
  }
  childRef.value?.startFillingBar();
};

const yes = computed(() => {
  const value = selectedProposal.value;
  return selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.yes : value.proposalDetailsTally?.getYes();
  // const res = selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
  //   selectedProposal.value.proposal.finalTallyResult?.yes : proposalsStore.getProposalDetailsTally?.getYes();
  // if(res != undefined) {
  //   return res;
  // }
  // return undefined;
});

const no = computed(() => {
  const value = selectedProposal.value;
  return selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.no : value.proposalDetailsTally?.getNo();
  // const res = selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
  //   selectedProposal.value.proposal.finalTallyResult?.no : proposalsStore.getProposalDetailsTally?.getNo();
  // if(res != undefined) {
  //   return res;
  // }
  // return undefined;
});

const abstain = computed(() => {
  const value = selectedProposal.value;
  return selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.abstain : value.proposalDetailsTally?.getAbstain();
  // const res = selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
  //   selectedProposal.value.proposal.finalTallyResult?.abstain : proposalsStore.getProposalDetailsTally?.getAbstain();
  // if(res != undefined) {
  //   return res;
  // }
  // return undefined;
});

const noWithVeto = computed(() => {
  const value = selectedProposal.value;
  return selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.noWithVeto : value.proposalDetailsTally?.getNoWithVeto();
  // const res = selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
  //   selectedProposal.value.proposal.finalTallyResult?.noWithVeto : proposalsStore.getProposalDetailsTally?.getNoWithVeto();
  // if(res != undefined) {
  //   return res;
  // }
  // return undefined;
});

const notVoted = computed(() => {
  const total = selectedProposal.value.proposalDetailsTally?.total ?? 0n;
  return selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    (useTokensStore().getStakingPool.bondedTokens - total) : selectedProposal.value.proposalDetailsTally?.getNotVoted();
  // return  useTokensStore().getStakingPool.bondedTokens - total;
  // const res = selectedProposal.value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
  //   useTokensStore().getStakingPool.bondedTokens - total : proposalsStore.getProposalDetailsTally?.getNotVoted();
  // if(res != undefined) {
  //   return res;
  // }
  // return undefined;
});

const yesPercentage = computed(() => {
  const value = selectedProposal.value;
  return value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.getYesPercentage() : value.proposalDetailsTally?.getYesPercentage();
});

const noPercentage = computed(() => {
  const value = selectedProposal.value;
  return value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.getNoPercentage() : value.proposalDetailsTally?.getNoPercentage();
});

const abstainPercentage = computed(() => {
  const value = selectedProposal.value;
  return value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.getAbstainPercentage() : value.proposalDetailsTally?.getAbstainPercentage();
});

const noWithVetoPercentage = computed(() => {
  const value = selectedProposal.value;
  return value.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    value.proposalTally?.getNoWithVetoPercentage() : value.proposalDetailsTally?.getNoWithVetoPercentage();
});

const totalVotes = computed(() => {
  let total: bigint | undefined;
  if(selectedProposal.value.proposal?.status == ProposalStatus.VOTING_PERIOD) {
    total = selectedProposal.value.proposalTally?.total;
  } else {
    total = selectedProposal.value.proposalDetailsTally?.total;
  }
  return total;
});

const bondedTokens = computed(() => {
  let bonded: bigint | undefined;
  if(selectedProposal.value.proposal?.status == ProposalStatus.VOTING_PERIOD) {
    bonded = useTokensStore().getStakingPool.bondedTokens;
  } else {
    //bonded = useProposalsStore().getProposalDetailsTally?.stakingPool.bondedTokens;
    bonded = selectedProposal.value.proposalDetailsTally?.stakingPool.bondedTokens;
  }
  return bonded;
});

const option = computed(() => {
  if (yes.value==undefined || abstain.value==undefined || no.value==undefined || noWithVeto.value==undefined || notVoted.value==undefined) {
    return false;
  }

  return createProposalDetailsChartData(useConfigurationStore().config.getConvertedAmount(yes.value),
    useConfigurationStore().config.getConvertedAmount(abstain.value),
    useConfigurationStore().config.getConvertedAmount(no.value),
    useConfigurationStore().config.getConvertedAmount(noWithVeto.value),
    useConfigurationStore().config.getConvertedAmount(notVoted.value),
    sumOfVotes.value);
});

function getProposalTitle() {
  return selectedProposal.value?.proposal?.content?.title ?? '';
  // const result = useProposalsStore().getProposal?.content?.title;
  // return result ? result : '';
}

function calculatePercents(a, b, precision){
  const result= (a/b) *100;
  return result.toFixed(precision);
}

function getProposalStatus(): ProposalStatus{
  return selectedProposal.value.proposal?.status ?? ProposalStatus.UNSPECIFIED;
}

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.bar-legend {
  text-align: left;
  margin-left: 10px;
}

.chart-container {
  height: 620px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 10px;
  .top {
    height: 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1em;
    font-weight: bold;
  }
  .chartdiv {
    width: 100%;
    height: 65%;
    position: relative;
    .inside{
      width: 50%;
      position: absolute;
      top: 42%;
      display: flex;
      align-items: center;
      justify-content: center;
      // -ms-transform: translateY(-50%);
      // transform: translateY(-50%);
      margin:auto;
      text-align: center;
      left: 0;
      right: 0;

    }
  }
  .voting-result {
    border-bottom: 1px solid;
    padding: 5px 0;
    border-top: 1px solid;
    display: flex;
    justify-content: space-around;
    font-size: 0.8em;
  }
  .bottom {
    button {
      width: 150px;
    }
  }
}

.yes {
  background: $primary-green-color;
}

.no {
  background: $error-red-color;
}

.no-with-veto {
  background: #FDDB2A;
}

.abstain {
  background: #27697f;
}

.gov-icon {
  padding-right: 0.5rem;
}

</style>

