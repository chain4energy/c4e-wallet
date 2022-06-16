<template>
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
        <div>{{ Number(proposalsStore.getTallyParams.quorum).toFixed(2) }}%</div>
        <div>{{ Number(proposalsStore.getTallyParams.threshold).toFixed(2) }}%</div>
        <div>{{ Number(proposalsStore.getTallyParams.veto_threshold).toFixed(2) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import moment from "moment";
import {useProposalsStore} from "@/store/proposals.store";

const props = defineProps({
  proposal: {
    type: Object,
    required: true
  }
});

const proposalsStore = useProposalsStore();
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};

</script>

<style scoped lang="scss">
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
</style>
