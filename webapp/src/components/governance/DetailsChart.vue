<template>
  <div v-if="proposal" class="chart-container">
    <div class="top">

      <span>{{ $t("GOVERNANCE_VIEW.TOTAL_VOTED") }} / {{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>
        <CoinAmount :amount="useProposalsStore().getSelectedProposalTally.total" :reduce-big-number="true" :precision="2"/> /
        <CoinAmount :amount="tokensStore.totalSupply" :reduce-big-number="true" :precision="2"/>
      </span>
    </div>
    <ShadowedSvgChart id="voteschartdiv" class="chartdiv">
        <v-chart :option="option" autoresize />
        <div class="inside">
          <Icon :name=icons.get(getProposalStatus())></Icon>
          {{ $t("GOVERNANCE_VIEW."+getProposalStatus())}}
        </div>
    </ShadowedSvgChart>
    <div class="voting-result">
      <div style="display: flex; align-items: center">
        <div class="dot yes"></div>
        <div class="bar-legend">
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div style="font-weight: bold">
            <PercentsView :amount="useProposalsStore().getSelectedProposalTally.getYesPercentage()" :precision="2"></PercentsView>
          </div>
          (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.yes" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot abstain"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getSelectedProposalTally.getAbstainPercentage()" :precision="2"></PercentsView>
        </div>
        (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.abstain" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getSelectedProposalTally.getNoPercentage()" :precision="2"></PercentsView>
        </div>
        (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.no" :reduce-big-number="true" :precision="2"/>)
      </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="dot no-with-veto"></div>
        <div class="bar-legend">
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
        <div style="font-weight: bold">
          <PercentsView :amount="useProposalsStore().getSelectedProposalTally.getNoWithVetoPercentage()" :precision="2"></PercentsView>
        </div>
        (<CoinAmount :amount="useProposalsStore().getSelectedProposalTally.noWithVeto" :reduce-big-number="true" :precision="2"/>)
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

import {computed} from "vue";
import {PieChart} from "echarts/charts";
import VChart from "vue-echarts";
import {use} from "echarts/core";
import {SVGRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";
import VoteModal from "@/components/governance/VoteModal.vue";
import Icon from "../features/IconComponent.vue";
import {Proposal} from "@/models/store/proposal";
import {ProposalStatus} from "@/models/store/proposal";
import { useConfigurationStore } from "@/store/configuration.store";
import { createProposalDetailsChartData } from "@/charts/governance";
import { useProposalsStore } from "@/store/proposals.store";
import ShadowedSvgChart from "../commons/ShadowedSvgChart.vue";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView.vue";
import GovernanceIcon from "../commons/GovernanceIcon.vue";
import {useTokensStore} from "@/store/tokens.store";

use([
  SVGRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);


const tokensStore = useTokensStore();

const props = defineProps<{
  proposal?: Proposal
}>();

const icons  = new Map<string, string>([
  [ProposalStatus.PASSED, 'CheckSquare'],
  [ProposalStatus.REJECTED, 'XCircle'],
  [ProposalStatus.VOTING_PERIOD, '']
]);

const sumOfVotes = computed(() => {
  const val = useProposalsStore().getSelectedProposalTally.total;
  return (val && val > 0) ? val : -1n;
});


const yes = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getSelectedProposalTally.yes);
});

const no = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getSelectedProposalTally.no);
});

const abstain = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getSelectedProposalTally.abstain);
});

const noWithVeto = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getSelectedProposalTally.noWithVeto);
});

const option = computed(() => {
  if (!yes.value || !abstain.value || !no.value || !noWithVeto.value) {
    return '';
  }
  return createProposalDetailsChartData(yes.value, abstain.value, no.value, noWithVeto.value, sumOfVotes.value);
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

.bar-legend {
  text-align: left;
  margin-left: 10px;
}

.chart-container {
  height: 560px;
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
    height: 70%;
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
