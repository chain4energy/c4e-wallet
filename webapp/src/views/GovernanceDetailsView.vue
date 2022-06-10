<template>
  <div class="container">
    <div class="chart-container">
      <div class="top">
        <span>Total</span>
        <span>6.02M c4e</span>
      </div>
      <div class="chartdiv">
        <v-chart :option="option" autoresize />
      </div>
      <div class="voting-result">
        <div>
          <div>Yes</div>
          <div>{{ yesPercentage }}%</div>
        </div>
        <div>
          <div>Abstain</div>
          <div>{{ abstainPercentage }}%</div>
        </div>
        <div>
          <div>No</div>
          <div>{{ noPercentage }}%</div>
        </div>
        <div>
          <div>No with veto</div>
          <div>{{ noWithVetoPercentage }}%</div>
        </div>
      </div>
      <div class="bottom">
        <Button label="Vote" class="p-button-raised p-button-rounded" data-bs-toggle="modal" data-bs-target="#voteModal" />

        <VoteModal id="voteModal" :proposalId="proposal.proposal_id" :title="proposal.content.title"></VoteModal>

      </div>
    </div>
    <div class="details-container">
      <div class="id"><h3>#{{ proposal.proposal_id }}</h3> </div>
      <h4 style="padding-left:20px">{{ proposal.content.title }}</h4>
      <div class="info">
        <div class="left">
          <div>Total deposit:</div>
          <div>Voting start:</div>
          <div>Voting end:</div>
          <div>Type:</div>
          <div>Submit time:</div>
          <div>Deposit end time:</div>
          <div>Quorum:</div>
          <div>Threshold:</div>
          <div>Veto threshold:</div>
        </div>
        <div class="right">
          <div>{{ proposal.total_deposit[0].amount }} {{ proposal.total_deposit[0].denom }}</div>
          <div>{{formattedDate(proposal.voting_start_time) }}</div>
          <div>{{formattedDate(proposal.voting_end_time) }}</div>
          <div>{{ proposal.content['@type'] }}</div>
          <div>{{ formattedDate(proposal.submit_time) }}</div>
          <div>{{formattedDate(proposal.deposit_end_time) }}</div>
          <div>132</div>
          <div>123</div>
          <div>123</div>
        </div>
      </div>
      </div>

    <div class="description">
      <h2>Description</h2>
      <div>Author: </div>
      <div>Jan Kowalski</div>
      <div>Parameter being changed with this proposal</div>
      <div>
        {{ proposal.content.description }}
      </div>
    </div>



  </div>


</template>

<script setup lang="ts">
import {useProposalStore} from "@/store/proposal.store";
import {computed, ref} from "vue";
import { useRoute } from "vue-router";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";
import moment from "moment";
import VoteModal from "@/components/governance/VoteModal.vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const route = useRoute();
const proposalStore = useProposalStore();
const proposal = ref();
proposal.value = proposalStore.getProposalById(route.params.id);

const yesPercentage = computed(() => {
  let res:number = Number(proposal.value.final_tally_result.yes) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const noPercentage = computed(() => {
  let res:number = Number(proposal.value.final_tally_result.no) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const abstainPercentage = computed(() => {
  let res:number = Number(proposal.value.final_tally_result.abstain) / sumOfVotes.value * 100;
  return res.toFixed(2);
});


const noWithVetoPercentage = computed(() => {
  let res:number = Number(proposal.value.final_tally_result.no_with_veto) / sumOfVotes.value * 100;
  return res.toFixed(2);
});

const sumOfVotes = computed(() => {
  return Number(proposal.value.final_tally_result.yes) + Number(proposal.value.final_tally_result.no)
    + Number(proposal.value.final_tally_result.no_with_veto) + Number(proposal.value.final_tally_result.abstain);
});
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};

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
      }
    ],


  }],

} );

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.container{
  .details-container{
    text-align: left;
    box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
    max-width: 700px;
    border-radius: 10px;
    .id{
      padding: 15px 20px;
    }
    .info {
      display: flex;

      .left{
        padding-left: 20px;
      }
      .right {
        padding-left: 40px;

      }
    }


  }
  .description {
    text-align: left;
    box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
    max-width: 700px;
    border-radius: 10px;
  }
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
}
</style>

