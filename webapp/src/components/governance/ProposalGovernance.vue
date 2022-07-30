<template>
  <div class="proposal-container" v-on:click="showDetailsClick">
    <div class="top">
      <span class="id fw-bold"><h2>#{{ proposal.proposalId }}</h2> </span>
      <div class="voting-status">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}</div>
    </div>
    <div class="middle">
      <div>
        <h5 class="fw-bold">{{ proposal.content.title }}</h5>
      </div>

      <div class="voting-date">
        <div class="start-date">
          <div>
            {{ formattedDate( proposal.isDepositPeriod() ? proposal.submitTime : proposal.votingStartTime ) }}
          </div>
          <div class="green-background">{{ proposal.isDepositPeriod() ? $t("GOVERNANCE_VIEW.SUBMIT_TIME") : $t("GOVERNANCE_VIEW.VOTING_START") }}</div>
        </div>
        <div class="end-date">
          <div>
            {{ formattedDate(proposal.isDepositPeriod() ? proposal.depositEndTime : proposal.votingEndTime ) }}
          </div>
          <div class="blue-background">{{ proposal.isDepositPeriod() ? $t("GOVERNANCE_VIEW.DEPOSIT_END_TIME") : $t("GOVERNANCE_VIEW.VOTING_END") }}</div>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="proposal.status !== ProposalStatus.DEPOSIT_PERIOD">
      <div style="width:100%; height:20px" class="chartdiv">
        <v-chart :option="option" autoresize />
      </div>
      <div class="voting-result">
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div>{{ yesPercentage }}%</div>
          <div>({{props.proposal.finalTallyResult.getYesView(2, true)}})</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
          <div>{{ abstainPercentage }}%</div>
          <div>({{props.proposal.finalTallyResult.getAbstainView(2, true)}})</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
          <div>{{ noPercentage }}%</div>
          <div>({{props.proposal.finalTallyResult.getNoView(2, true)}})</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
          <div>{{ noWithVetoPercentage }}%</div>
          <div>({{props.proposal.finalTallyResult.getNoWithVetoView(2, true)}})</div>
        </div>
      </div>

    </div>

  </div>


</template>

<script setup lang="ts">
import moment, { now } from 'moment';
import {computed, ref} from "vue";
import {BarChart} from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent, GridComponent} from "echarts/components";
import {useRouter} from "vue-router";
import {Proposal, ProposalStatus} from "@/models/store/proposal";
import { createProposalListChartData } from '@/charts/governance';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const props = defineProps<{
  proposal: Proposal
}>();


const router = useRouter();

const icons  = new Map<string, string>([
  [ProposalStatus.PASSED, "CheckSquare"],
  [ProposalStatus.REJECTED, "XCircle"],
  [ProposalStatus.DEPOSIT_PERIOD, ""],
  [ProposalStatus.FAILED, ""],
  [ProposalStatus.VOTING_PERIOD, ""],
  [ProposalStatus.UNSPECIFIED, ""]
]);

const yesPercentage = computed(() => {
  return props.proposal.finalTallyResult.getYesPercentageView();
});

const noPercentage = computed(() => {
  return props.proposal.finalTallyResult.getNoPercentageView();
});

const abstainPercentage = computed(() => {
  return props.proposal.finalTallyResult.getAbstainPercentageView();
});

const noWithVetoPercentage = computed(() => {
  return props.proposal.finalTallyResult.getNoWithVetoPercentageView();
});

const yes = computed(() => {
  return props.proposal.finalTallyResult.getYesView();
});

const no = computed(() => {
  return props.proposal.finalTallyResult.getNoView();
});

const abstain = computed(() => {
  return props.proposal.finalTallyResult.getAbstainView();
});

const noWithVeto = computed(() => {
  return props.proposal.finalTallyResult.getNoWithVetoView();
});

const sumOfVotes = computed(() => {
  const val = props.proposal.finalTallyResult.total
  return val > 0n ? val : -1n;
});
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};

const showDetailsClick = () => {
  router.push({name: 'governanceDetails', params: {id: props.proposal.proposalId}});
};

const option = computed(() => {
  return createProposalListChartData(
    {
      amount: yes.value,
      percentage: yesPercentage.value
    },
    {
      amount: abstain.value,
      percentage: abstain.value
    },
    {
      amount: no.value,
      percentage: noPercentage.value
    },
    {
      amount: noWithVeto.value,
      percentage: noWithVetoPercentage.value
    },
    sumOfVotes.value
  );
})


</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.proposal-container {
  max-width: 562px;
  min-height: 317px;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  .top {
    overflow: auto;
    .id {
      float: left;
      padding-top: 15px;
      padding-left: 25px;
    }
    .voting-status {
      float: right;
      height: 50px;
      min-width: 150px;
      padding: 15px 0px;
      margin-left: auto;
      margin-right: auto;
      background-color: $primary-blue-color;
      color: white;
      border-radius: 0 10px 0 10px;
    }
  }
  .middle {
    height: 50%;
    padding: 20px 30px;
    h5 {


    }
    .voting-date {
      padding-top: 15px;
      display: flex;
      .start-date {
        padding-right: 20px;
        border-right: 1px solid;
        .green-background {
          padding: 3px 10px;
          background-color: $success-color;
          width: fit-content;
          border-radius: 20px;
        }
      }
      .end-date {
        padding-left: 20px;
        .blue-background {
          padding: 3px 10px;
          background-color: $accents-link-color;
          width: fit-content;
          border-radius: 20px;
        }
      }
    }
  }
  .bottom {
    height: 25%;
    width: 100%;

    .voting-result {
      display: flex;
      justify-content: space-around;
    }
    .chartdiv {
      margin-bottom: 15px;
    }
  }
}
</style>
