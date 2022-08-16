<template>
  <div class="proposal-container" v-on:click="showDetailsClick">
    <div class="top">
      <span class="id fw-bold">#{{ proposal.proposalId }} </span>
      <div v-if="proposal.status == 'PROPOSAL_STATUS_VOTING_PERIOD'" class="voting-status voting">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}
      </div>
      <div v-if="proposal.status == 'PROPOSAL_STATUS_REJECTED'" class="voting-status rejected">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}
      </div>
      <div v-if="proposal.status == 'PROPOSAL_STATUS_PASSED'" class="voting-status accepted">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}
      </div>
      <div v-if="proposal.status == 'PROPOSAL_STATUS_DEPOSIT_PERIOD'" class="voting-status deposit">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}
      </div>
      <div v-if="proposal.status == 'PROPOSAL_STATUS_FAILED'" class="voting-status failed">
        <Icon :name=icons.get(proposal.status)>
        </Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}
      </div>
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
        <v-chart :option="option" />
      </div>


      <div class="voting-result">
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div>
            <PercentsView :amount="yesPercentage" :precision="2"/>
          </div>
          (<CoinAmount :amount="useProposalsStore().getProposalTally(proposal).yes" :reduce-big-number="true" :precision="2"/>)
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
          <div>
            <PercentsView :amount="abstainPercentage" :precision="2"/>
          </div>
          (<CoinAmount :amount="useProposalsStore().getProposalTally(proposal).abstain" :reduce-big-number="true" :precision="2"/>)
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
          <div>
            <PercentsView :amount=" noPercentage" :precision="2"/>
          </div>
          (<CoinAmount :amount="useProposalsStore().getProposalTally(proposal).no" :reduce-big-number="true" :precision="2"/>)
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
          <div>
            <PercentsView :amount="noWithVetoPercentage" :precision="2"/>
          </div>
          (<CoinAmount :amount="useProposalsStore().getProposalTally(proposal).noWithVeto" :reduce-big-number="true" :precision="2"/>)
        </div>
      </div>

    </div>

  </div>


</template>

<script setup lang="ts">
import moment from 'moment';
import {computed} from "vue";
import {BarChart} from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import {SVGRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent, GridComponent} from "echarts/components";
import {useRouter} from "vue-router";
import {Proposal, ProposalStatus} from "@/models/store/proposal";
import { createProposalListChartData } from '@/charts/governance';
import { useProposalsStore } from '@/store/proposals.store';
import CoinAmount from '../commons/CoinAmount.vue';
import PercentsView from "@/components/commons/PercentsView"
import { useConfigurationStore } from '@/store/configuration.store';

use([
  SVGRenderer,
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
  return useProposalsStore().getProposalTally(props.proposal).getYesPercentage();
});

const noPercentage = computed(() => {
  return useProposalsStore().getProposalTally(props.proposal).getNoPercentage();
});

const abstainPercentage = computed(() => {
  return useProposalsStore().getProposalTally(props.proposal).getAbstainPercentage();
});

const noWithVetoPercentage = computed(() => {
  return useProposalsStore().getProposalTally(props.proposal).getNoWithVetoPercentage();
});

const yes = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getProposalTally(props.proposal).yes);
});

const no = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getProposalTally(props.proposal).no);
});

const abstain = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getProposalTally(props.proposal).abstain);
});

const noWithVeto = computed(() => {
  return useConfigurationStore().config.getConvertedAmount(useProposalsStore().getProposalTally(props.proposal).noWithVeto);
});

const sumOfVotes = computed(() => {
  const val = useProposalsStore().getProposalTally(props.proposal).total
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
      percentage: abstainPercentage.value
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
  min-height: 360px;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;

  &:hover {
    cursor: pointer;
    background: rgb(245, 245, 245);
  }

  .top {
    overflow: auto;
    .id {
      float: left;
      margin-top: 15px;
      margin-left: 25px;
      padding: 10px 15px;
      border: 2px solid black;
      border-radius: 15px;
    }
    .voting-status {
      float: right;
      height: 50px;
      min-width: 150px;
      padding: 15px 0px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 0 10px 0 10px;
    }

    .voting {
      background-color: $primary-blue-color;
      color: white;
    }

    .accepted {
      background-color: $primary-green-color;
      color: $primary-blue-color;
    }

    .rejected {
      background-color: $error-red-color;
      color: white;
    }

    .failed {
      background-color: black;
      color: white;
    }

    .deposit {
      background-color: grey;
      color: rgb(77, 77, 77);
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
      justify-content: center;

      .start-date {
        padding-right: 20px;
        border-right: 1px solid;
        display: flex;
        flex-direction: column;
        align-items: center;


        .green-background {
          padding: 3px 10px;
          background-color: $success-color;
          width: fit-content;
          border-radius: 20px;
        }
      }

      .end-date {
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

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
