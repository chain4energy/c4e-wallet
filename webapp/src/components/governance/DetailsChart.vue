<template>
  <div v-if="proposal" class="chart-container">
    <div class="top">

      <span>{{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>{{ proposal.finalTallyResult.getTotalView(2, true) }} {{ useConfigurationStore().config.getViewDenom() }}</span>
    </div>
    <div class="chartdiv">
      <v-chart :option="option" autoresize />
      <div class="inside">
        <Icon :name=icons.get(proposal.status)></Icon>
        {{ $t("GOVERNANCE_VIEW."+proposal.status)}}
      </div>
    </div>
    <div class="voting-result">
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
        <div>{{ proposal?.finalTallyResult.getYesPercentageView() }}%</div>
        <div>({{proposal.finalTallyResult.getYesView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
        <div>{{ proposal?.finalTallyResult.getAbstainPercentageView() }}%</div>
        <div>({{proposal.finalTallyResult.getAbstainView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
        <div>{{ proposal?.finalTallyResult.getNoPercentageView() }}%</div>
        <div>({{proposal.finalTallyResult.getNoView(2, true)}})</div>
      </div>
      <div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
        <div>{{ proposal?.finalTallyResult.getNoWithVetoPercentageView() }}%</div>
        <div>({{proposal.finalTallyResult.getNoWithVetoView(2, true)}})</div>
      </div>
    </div>
    <div class="bottom">
      <Button
        :label="$t('GOVERNANCE_VIEW.VOTE')"
        class="p-button-raised p-button-rounded"
        data-bs-toggle="modal" data-bs-target="#voteModal" :disabled="proposal.status !== ProposalStatus.VOTING_PERIOD" />

      <VoteModal id="voteModal" :proposalId="proposal.proposalId" :title="proposal.content.title"></VoteModal>
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
  const val = props.proposal?.finalTallyResult.total
  return (val && val > 0) ? val : -1n;
});


const yes = computed(() => {
  return props.proposal?.finalTallyResult.getYesView();
});

const no = computed(() => {
  return props.proposal?.finalTallyResult.getNoView();
});

const abstain = computed(() => {
  return props.proposal?.finalTallyResult.getAbstainView();
});

const noWithVeto = computed(() => {
  return props.proposal?.finalTallyResult.getNoWithVetoView();
});

const option = computed(() => {
  if (!yes.value || !abstain.value || !no.value || !noWithVeto.value) {
    return '';
  }
  return createProposalDetailsChartData(yes.value, abstain.value, no.value, noWithVeto.value, sumOfVotes.value)
});

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.chart-container {
  height: 543px;
  width: 437px;
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
    padding-top: 15px;
    button {
      width:170px;
      height: 40px;
      background-color: $primary-green-color;
      border: none;
    }
  }
}
</style>
