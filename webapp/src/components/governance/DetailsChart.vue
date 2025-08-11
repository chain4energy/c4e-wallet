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
        {{calculatePercents(Number(totalVotes ?? 0n), Number(bondedTokens ?? 0n), 2)}}%
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

import {computed, onUnmounted, ref, watch} from "vue";
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
import dataService from "@/services/data.service";

use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

// reactive access to currently selected proposal from the store
const selectedProposal = computed(() => useProposalsStore().selectedProposal);

// fetch latest vote counts for the selected proposal
const updateVotes = async () => {
  if (selectedProposal.value.proposal?.proposalId) {
    await dataService.onProposalUpdateVotes(selectedProposal.value.proposal.proposalId);
  }
};

let voteRefreshInterval: ReturnType<typeof setInterval> | undefined;

watch(selectedProposal, async (newProposal) => {
  clearInterval(voteRefreshInterval);

  if (newProposal?.proposal?.proposalId) {
    if (newProposal.proposal.status === ProposalStatus.VOTING_PERIOD) {
      await updateVotes(); // initial fetch
      voteRefreshInterval = setInterval(updateVotes, useConfigurationStore().getConfig.proposalVotingRefreshTimeout);
    } else if (newProposal.proposal.status) {
      await dataService.onProposalUpdateVotes(newProposal.proposal.proposalId);
    }
  }
}, { immediate: true });

onUnmounted(() => {
  clearInterval(voteRefreshInterval);
});

const icons = new Map<string, string>([
  [ProposalStatus.PASSED, 'CheckSquare'],
  [ProposalStatus.REJECTED, 'XCircle'],
  [ProposalStatus.VOTING_PERIOD, ''],
  [ProposalStatus.UNSPECIFIED, ''],
  [ProposalStatus.DEPOSIT_PERIOD, ''],
  [ProposalStatus.FAILED, ''],
]);

// computed properties for vote counts, total votes, bonded tokens, and percentages
// using the new api
const yes = computed(() => selectedProposal.value.proposalTally?.yes);
const no = computed(() => selectedProposal.value.proposalTally?.no);
const abstain = computed(() => selectedProposal.value.proposalTally?.abstain);
const noWithVeto = computed(() => selectedProposal.value.proposalTally?.noWithVeto);

const totalVotes = computed(() => selectedProposal.value.proposalTally?.total);
const bondedTokens = computed(() => useTokensStore().getStakingPool.bondedTokens);

const notVoted = computed(() => {
  const bonded = bondedTokens.value ?? 0n;
  const voted = totalVotes.value ?? 0n;
  return bonded > voted ? bonded - voted : 0n;
});

const yesPercentage = computed(() => selectedProposal.value.proposalTally?.getYesPercentage());
const noPercentage = computed(() => selectedProposal.value.proposalTally?.getNoPercentage());
const abstainPercentage = computed(() => selectedProposal.value.proposalTally?.getAbstainPercentage());
const noWithVetoPercentage = computed(() => selectedProposal.value.proposalTally?.getNoWithVetoPercentage());


// proposal chart //
const option = computed(() => {
  // Use 0n as default values for undefined vote counts
  const yesValue = yes.value ?? 0n;
  const abstainValue = abstain.value ?? 0n;
  const noValue = no.value ?? 0n;
  const noWithVetoValue = noWithVeto.value ?? 0n;
  const notVotedValue = notVoted.value ?? 0n;
  const currentTotalVotes = totalVotes.value ?? 0n;

  return createProposalDetailsChartData(
    useConfigurationStore().config.getConvertedAmount(yesValue),
    useConfigurationStore().config.getConvertedAmount(abstainValue),
    useConfigurationStore().config.getConvertedAmount(noValue),
    useConfigurationStore().config.getConvertedAmount(noWithVetoValue),
    useConfigurationStore().config.getConvertedAmount(notVotedValue),
    currentTotalVotes
  );
});

function wrapBigInt(value: bigint | undefined) {
  return value !== undefined ? new BigIntWrapper(value) : new BigIntWrapper(0n);
}

function getProposalTitle() {
  return selectedProposal.value?.proposal?.content?.title ?? '';
}

function calculatePercents(a?: number, b?: number, precision?: number) {
  if (a === undefined || b === undefined || b === 0) {
    return (0).toFixed(precision || 0);
  }
  const result = (a / b) * 100;
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

.not-voted {
  background: #cccccc;
}

.not-voted {
  background: #cccccc;
}

.gov-icon {
  padding-right: 0.5rem;
}

</style>

