<template>
  <div class="container">

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
          <div>{{ proposal.voting_start_time }}</div>
          <div>{{ proposal.voting_end_time }}</div>
          <div>{{ proposal.content['@type'] }}</div>
          <div>{{ proposal.submit_time }}</div>
          <div>{{ proposal.deposit_end_time }}</div>
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
import { ref} from "vue";
import { useRoute } from "vue-router";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {LegendComponent, TitleComponent, TooltipComponent} from "echarts/components";

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

</script>

<style scoped lang="scss">
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
}
</style>
