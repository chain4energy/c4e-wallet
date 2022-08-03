<template>
  <div v-if="proposal" class="chart-container">
    <div class="top">

      <span>{{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>{{ useProposalsStore().getSelectedProposalTally.getTotalView(2, true) }} {{ useConfigurationStore().config.getViewDenom() }}</span>
    </div>
    <div class="chartdiv">
      <v-chart :option="option" autoresize />
      <div class="inside">
        <Icon :name=icons.get(getProposalStatus())></Icon>
        {{ $t("GOVERNANCE_VIEW."+getProposalStatus())}}
      </div>
    </div>
    <div class="voting-result">
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
        <div>{{ useProposalsStore().getSelectedProposalTally.getYesPercentageView() }}%</div>
        <div>({{ useProposalsStore().getSelectedProposalTally.getYesView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
        <div>{{ useProposalsStore().getSelectedProposalTally.getAbstainPercentageView() }}%</div>
        <div>({{useProposalsStore().getSelectedProposalTally.getAbstainView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
        <div>{{ useProposalsStore().getSelectedProposalTally.getNoPercentageView() }}%</div>
        <div>({{useProposalsStore().getSelectedProposalTally.getNoView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
        <div>{{ useProposalsStore().getSelectedProposalTally.getNoWithVetoPercentageView() }}%</div>
        <div>({{useProposalsStore().getSelectedProposalTally.getNoWithVetoView(2, true)}})</div>
      </div>
    </div>
    <div class="bottom">
      <Button
        :label="$t('GOVERNANCE_VIEW.VOTE')"
        class="p-button-raised p-button-rounded"
        data-bs-toggle="modal" data-bs-target="#voteModal" :disabled="useProposalsStore().getProposal?.status !== ProposalStatus.VOTING_PERIOD" />
      <VoteModal id="voteModal" :proposalId="proposal.proposalId" :title="getProposalTitle()"></VoteModal>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import {PieChart} from "echarts/charts";
import VChart from "vue-echarts";
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";
import VoteModal from "@/components/governance/VoteModal.vue";
import Icon from "../features/IconComponent.vue";
import {Proposal} from "@/models/store/proposal";
import {ProposalStatus} from "@/models/store/proposal";
import { useConfigurationStore } from "@/store/configuration.store";
import { createProposalDetailsChartData } from "@/charts/governance";
import { useProposalsStore } from "@/store/proposals.store";


use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const props = defineProps<{
  proposal?: Proposal
}>();

const icons  = new Map<string, string>([
  [ProposalStatus.PASSED, 'CheckSquare'],
  [ProposalStatus.REJECTED, 'XCircle'],
  [ProposalStatus.VOTING_PERIOD, '']
]);

const sumOfVotes = computed(() => {
  const val = useProposalsStore().getSelectedProposalTally.total
  return (val && val > 0) ? val : -1n;
});


const yes = computed(() => {
  return useProposalsStore().getSelectedProposalTally.getYesView();
});

const no = computed(() => {
  return useProposalsStore().getSelectedProposalTally.getNoView();
});

const abstain = computed(() => {
  return useProposalsStore().getSelectedProposalTally.getAbstainView();
});

const noWithVeto = computed(() => {
  return useProposalsStore().getSelectedProposalTally.getNoWithVetoView();
});

const option = computed(() => {
  if (!yes.value || !abstain.value || !no.value || !noWithVeto.value) {
    return '';
  }
  return createProposalDetailsChartData(yes.value, abstain.value, no.value, noWithVeto.value, sumOfVotes.value)
});

function getProposalTitle() {
  const result = useProposalsStore().getProposal?.content.title;
  return result ? result : '';
}

function getProposalStatus(): ProposalStatus{
  const result = useProposalsStore().getProposal?.status;
  return result ? result : ProposalStatus.UNSPECIFIED;
}

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.chart-container {
  height: 560px;
  width: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  .top {
    height: 5%;
  }
  .chartdiv {
    width: 100%;
    height: 70%;
    position: relative;
    .inside{
      position: absolute;
      top: 42%;
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
  }
  .bottom {
    button {
      width: 150px;
    }
  }
}
</style>
