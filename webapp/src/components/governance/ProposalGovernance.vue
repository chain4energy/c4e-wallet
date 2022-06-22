<template>
  <div class="proposal-container" v-on:click="showDetailsClick">
    <div class="top">
      <span class="id fw-bold"><h2>#{{ proposal.proposal_id }}</h2> </span>
      <div class="voting-status">    <Icon :name=icons.get(proposal.status)></Icon> {{ $t("GOVERNANCE_VIEW."+proposal.status)  }}</div>
    </div>
    <div class="middle">
      <div>
        <h5 class="fw-bold">{{ proposal.content.title }}</h5>
      </div>

      <div class="voting-date">
        <div class="start-date">
          <div>
            {{ formattedDate(proposal.voting_start_time ) }}
          </div>
          <div class="green-background">{{ $t("GOVERNANCE_VIEW.VOTING_START") }}</div>
        </div>
        <div class="end-date">
          <div>
            {{ formattedDate(proposal.voting_end_time ) }}
          </div>
          <div class="blue-background">{{ $t("GOVERNANCE_VIEW.VOTING_END") }}</div>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="proposal.status !== ProposalStatusEnum.PROPOSAL_STATUS_DEPOSIT_PERIOD">
      <div style="width:100%; height:20px" class="chartdiv">
        <v-chart :option="option" autoresize />
      </div>
      <div class="voting-result">
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</div>
          <div>{{ yesPercentage }}%</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</div>
          <div>{{ abstainPercentage }}%</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</div>
          <div>{{ noPercentage }}%</div>
        </div>
        <div>
          <div>{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</div>
          <div>{{ noWithVetoPercentage }}%</div>
        </div>
      </div>

    </div>

  </div>


</template>

<script setup lang="ts">
import moment from 'moment';
import {computed, ref} from "vue";
import {BarChart} from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent, GridComponent} from "echarts/components";
import {useRouter} from "vue-router";
import {Proposal} from "@/models/Proposal";
import {ProposalStatusEnum} from "@/models/proposalStatus-enum";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const props = defineProps({
  proposal: {
    type: Object(Proposal),
    required: true
  }
});
const router = useRouter();

const icons  = new Map<string, string>([
  [ProposalStatusEnum.PROPOSAL_STATUS_PASSED, "CheckSquare"],
  [ProposalStatusEnum.PROPOSAL_STATUS_REJECTED, "XCircle"],
  [ProposalStatusEnum.PROPOSAL_STATUS_DEPOSIT_PERIOD, ""]
]);

const yesPercentage = computed(() => {
  let res:number = Number(props.proposal.final_tally_result.yes) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const noPercentage = computed(() => {
  let res:number = Number(props.proposal.final_tally_result.no) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const abstainPercentage = computed(() => {
  let res:number = Number(props.proposal.final_tally_result.abstain) / sumOfVotes.value * 100;
  return res.toFixed(2);
});


const noWithVetoPercentage = computed(() => {
  let res:number = Number(props.proposal.final_tally_result.no_with_veto) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const sumOfVotes = computed(() => {
  const val = Number(props.proposal.final_tally_result.yes) + Number(props.proposal.final_tally_result.no)
    + Number(props.proposal.final_tally_result.no_with_veto) + Number(props.proposal.final_tally_result.abstain)
  return val > 0 ? val : -1;
});
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};

const showDetailsClick = () => {
  router.push({name: 'governanceDetails', params: {id: props.proposal.proposal_id}});
};

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  xAxis: {
    type: 'value',
    show:false
  },
  yAxis: {
    type: 'category',
    show:false
  },
  itemStyle: {
    barBorderRadius: [50,50,50,50]
  },
  series: [
    {
      name: 'Yes',
      type: 'bar',

      color:'#72bf44',
      stack: 'total',
      emphasis: {
        focus: 'series'
      },
      data: [yesPercentage.value]
    },
    {
      name: 'Abstain',
      type: 'bar',
      stack: 'total',
      color: '#27697f',
      emphasis: {
        focus: 'series'
      },
      data: [abstainPercentage.value]
    },
    {
      name: 'No',
      type: 'bar',
      stack: 'total',

      emphasis: {
        focus: 'series'
      },
      color: '#e02626',
      data: [noPercentage.value]
    },
    {
      name: 'No with veto',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series'
      },
      color: '#fff1a9',
      data: [noWithVetoPercentage.value]
    },
    {
      name: '',
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series'
      },
      color: '#797777',
      data: [sumOfVotes.value === -1 ? 1 : 0]
    }
  ],

} );

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
