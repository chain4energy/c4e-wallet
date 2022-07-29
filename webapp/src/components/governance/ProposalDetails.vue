<template>
  <div class="details-container">
    <div class="id"><h3>#{{ proposal.proposalId }}</h3> </div>
    <h4 style="padding-left:20px">{{ proposal.content.title }}</h4>
    <div class="info">
      <div class="left">
        <div>{{ $t("GOVERNANCE_VIEW.TOTAL_DEPOSIT") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_START") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.VOTING_END") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.TYPE") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.SUBMIT_TIME") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.DEPOSIT_END_TIME") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.QUORUM") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.THRESHOLD") }}:</div>
        <div>{{ $t("GOVERNANCE_VIEW.VETO_THRESHOLD") }}:</div>
      </div>
      <div class="right">
        <div>{{ proposal.getTotalDepositByDenom().getViewAmount() }} {{ proposal.getTotalDepositByDenom().getViewDenom()  }}</div>
        <div>{{formattedDate(proposal.votingStartTime) }}</div>
        <div>{{formattedDate(proposal.votingEndTime) }}</div>
        <div>{{ proposal.content.type }}</div>
        <div>{{ formattedDate(proposal.submitTime) }}</div>
        <div>{{ formattedDate(proposal.depositEndTime) }}</div>
        <div>{{ proposalsStore.getTallyParams.getQuorumPercentageView() }}%</div>
        <div>{{ proposalsStore.getTallyParams.getThresholdPercentageView() }}%</div>
        <div>{{ proposalsStore.getTallyParams.getVetoThresholdPercentageView() }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import moment from "moment";
import {useProposalsStore} from "@/store/proposals.store";
import { Proposal } from "@/models/store/proposal";

const props = defineProps<{
  proposal: Proposal
}>();

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
