<template>
  <div  v-if="proposal && option !== false" class="chart-container">
    <div class="top">
      {{props.proposalDetailsTally}}
      <span>{{ $t("GOVERNANCE_VIEW.TOTAL_VOTED") }} / {{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>
<!--        <CoinAmount :amount="useProposalsStore().getSelectedProposalTally.total" :reduce-big-number="true" :precision="2"/> /-->
        <CoinAmount :amount="useProposalsStore().getProposalDetailsTally?.proposalTally.total!==undefined ? new BigIntWrapper(useProposalsStore().getProposalDetailsTally.proposalTally.total) : 0" :reduce-big-number="true" :precision="2"/> /
        <CoinAmount :amount="useProposalsStore().getProposalDetailsTally?.stakingPool.bondedTokens !== undefined ? new BigIntWrapper(useProposalsStore().getProposalDetailsTally.stakingPool.bondedTokens) : 0" :reduce-big-number="true" :precision="2"/>
      </span>

    </div>
    <div class="top">
      <span>
        {{ $t("GOVERNANCE_VIEW.CURRENT_TURNOUT") }}
      </span>
      <span>
        {{calculatePercents(Number(useProposalsStore().getProposalDetailsTally?.proposalTally.total), Number(useProposalsStore().getProposalDetailsTally?.stakingPool.bondedTokens), 2)}}%
      </span>
    </div>

    <ShadowedSvgChart id="voteschartdiv" class="chartdiv">
        <v-chart :option="option" autoresize />
        <div class="inside">
          <Icon :name=icons.get(getProposalStatus())></Icon>
          {{ $t("GOVERNANCE_VIEW."+getProposalStatus())}}
        </div>
    </ShadowedSvgChart>
    <ProgressBarComponent v-if="getProposalStatus()===ProposalStatus.VOTING_PERIOD" ref="childRef" @refresh="updateVotes" :loading-time="useConfigurationStore().getConfig.proposalVotingRefreshTimeout" style="width: 100%"></ProgressBarComponent>
    <div class="voting-result">
      <div style="display: flex; align-items: center">
        <div class="dot yes"></div>
        <div class="bar-legend">
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div style="font-weight: bold">
            <PercentsView :amount="useProposalsStore().getProposalDetailsTally?.getYesPercentage()" :precision="2"></PercentsView>
          </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.yes" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="yes" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot abstain"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getProposalDetailsTally?.getAbstainPercentage()" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.abstain" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="abstain" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getProposalDetailsTally?.getNoPercentage()" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.no" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="no" :reduce-big-number="true" :precision="2"/>)
      </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no-with-veto"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getProposalDetailsTally?.getNoWithVetoPercentage()" :precision="2"></PercentsView>
        </div>
<!--          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.noWithVeto" :reduce-big-number="true" :precision="2"/>)-->
          (<CoinAmount :amount="noWithVeto" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
    </div>
    <div class="bottom">
      <Button
        class="p-button-raised p-button-rounded"
        data-bs-toggle="modal" data-bs-target="#voteModal"
        :disabled="
        useProposalsStore().getProposal?.status !== ProposalStatus.VOTING_PERIOD"
      >
        <GovernanceIcon icon="vote"/>
        {{$t('GOVERNANCE_VIEW.VOTE')}}
      </Button>
      <VoteModal id="voteModal" :proposalId="proposal.proposalId" :title="getProposalTitle()"></VoteModal>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, onBeforeMount, ref} from "vue";
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


const tokensStore = useTokensStore();

onBeforeMount(async () => {
  if (props.proposal?.status && props.proposal.status !== ProposalStatus.VOTING_PERIOD) {
    await dataService.onProposalUpdateVotes(props.proposal.proposalId);
  }
});

const childRef = ref<InstanceType<typeof ProgressBarComponent>>();
const props = defineProps<{
  proposal?: Proposal,
  proposalDetailsTally?: ProposalDetailsTally
}>();

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
  const val = useProposalsStore().getProposalDetailsTally?.total;
  return (val && val > 0) ? val : -1n;
});

const updateVotes = async () => {
  if(props.proposal?.proposalId) {
    await dataService.onProposalUpdateVotes(props.proposal.proposalId);
  }
  childRef.value?.startFillingBar();
};

const yes = computed(() => {
  const res = props.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    proposalsStore.proposalTally?.yes : proposalsStore.getProposalDetailsTally?.getYes();
  if(res != undefined) {
    return res;
  }
  return undefined;
});

const no = computed(() => {
  const res = props.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    proposalsStore.proposalTally?.no : proposalsStore.getProposalDetailsTally?.getNo();
  if(res != undefined) {
    return res;
  }
  return undefined;
});

const abstain = computed(() => {
  const res = props.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    proposalsStore.proposalTally?.abstain : proposalsStore.getProposalDetailsTally?.getAbstain();
  if(res != undefined) {
    return res;
  }
  return undefined;
});

const noWithVeto = computed(() => {
  const res = props.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    proposalsStore.proposalTally?.noWithVeto : proposalsStore.getProposalDetailsTally?.getNoWithVeto();
  if(res != undefined) {
    return res;
  }
  return undefined;
});

const notVoted = computed(() => {
  const total = proposalsStore.proposalTally?.total != undefined ? proposalsStore.proposalTally.total : 0n;
  const res = props.proposal?.status === ProposalStatus.VOTING_PERIOD ?
    useTokensStore().getStakingPool.bondedTokens - total : proposalsStore.getProposalDetailsTally?.getNotVoted();
  if(res != undefined) {
    return res;
  }
  return undefined;
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
  const result = useProposalsStore().getProposal?.content?.title;
  return result ? result : '';
}

function calculatePercents(a, b, precision){
  const result= (a/b) *100
  return result.toFixed(precision);
}

function getProposalStatus(): ProposalStatus{
  const result = useProposalsStore().getProposal?.status;
  return result ? result : ProposalStatus.UNSPECIFIED;
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

