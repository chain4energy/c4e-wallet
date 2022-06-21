<template>
  <div class="chart-container">
    <div class="top">

      <span>{{ $t("GOVERNANCE_VIEW.TOTAL") }}</span>
      <span>6.02M c4e</span>
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
    <div class="bottom">
      <Button :label="$t('GOVERNANCE_VIEW.VOTE')" class="p-button-raised p-button-rounded" data-bs-toggle="modal" data-bs-target="#voteModal" :disabled="proposal.status!==ProposalStatusEnum.PROPOSAL_STATUS_VOTING_PERIOD" />

      <VoteModal id="voteModal" :proposalId="proposal.proposal_id" :title="proposal.content.title"></VoteModal>
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
import {Proposal} from "@/models/Proposal";
import {ProposalStatusEnum} from "@/models/proposalStatus-enum";


use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const props = defineProps({
  proposal: {
    type: Object(Proposal),
    required: true
  }
});

const icons  = new Map<string, string>([
  [ProposalStatusEnum.PROPOSAL_STATUS_PASSED, "CheckSquare"],
  [ProposalStatusEnum.PROPOSAL_STATUS_REJECTED, "XCircle"],
  [ProposalStatusEnum.PROPOSAL_STATUS_DEPOSIT_PERIOD, ""]
]);

const sumOfVotes = computed(() => {
  const val = Number(props.proposal.final_tally_result.yes) + Number(props.proposal.final_tally_result.no)
    + Number(props.proposal.final_tally_result.no_with_veto) + Number(props.proposal.final_tally_result.abstain)
  return val > 0 ? val : -1;
});

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

const option = ref({

  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },

  series: [{
    width: '90%',
    height: '90%',
    center: ['55%', '50%'],
    name: 'Pools',
    type: 'pie',
    radius: ['100%', '78%'],

    avoidLabelOverlap: true,
    label: {
      show: false,
      color: '#000',
      fontSize: '80',
      position: 'center'
    },

    data: [{

      value: yesPercentage.value,
      name: 'Yes',
      itemStyle: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        color: '#72bf44',
      }
    },
      {
        value: abstainPercentage.value,
        name: 'Abstain',
        itemStyle: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: '#27697f'
        }
      },
      {
        value: noPercentage.value,
        name: 'No',
        itemStyle: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: '#e02626'
        }
      },
      {
        value: noWithVetoPercentage.value,
        name: 'No with veto',
        itemStyle: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: '#fff1a9'
        }
      },
      {
        value: sumOfVotes.value === -1 ? 1 : 0,
        name: '',
        itemStyle: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: '#797777'
        }
      }
    ],


  }],

} );
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
