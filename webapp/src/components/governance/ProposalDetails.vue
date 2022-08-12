<template>
  <div v-if="proposal" class="details-container">
    <div class="id"><h3>#{{ proposal.proposalId }}</h3> </div>
    <h4 style="padding-left:20px">{{ proposal.content.title }}</h4>
    <div v-if="voted === VoteOption.Yes" class="vote user-vote-yes">
      {{ $t("GOVERNANCE_VIEW.USER_VOTE") }} <b>{{ $t('GOVERNANCE_VIEW.VOTING_OPTIONS.YES') }}</b>
    </div>
    <div v-else-if="voted === VoteOption.Abstain" class="vote user-vote-abstain">
      {{ $t("GOVERNANCE_VIEW.USER_VOTE") }} <b>{{ $t('GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN') }}</b>
    </div>
    <div v-else-if="voted === VoteOption.No" class="vote user-vote-no">
      {{ $t("GOVERNANCE_VIEW.USER_VOTE") }} <b>{{ $t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO') }}</b>
    </div>
    <div v-else-if="voted === VoteOption.NoWithVeto" class="vote user-vote-veto">
      {{ $t("GOVERNANCE_VIEW.USER_VOTE") }} <b>{{ $t('GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO') }}</b>
    </div>
    <div class="info">
        <span>{{ $t("GOVERNANCE_VIEW.TOTAL_DEPOSIT") }}:</span>
        <CoinAmount :amount="proposal.getTotalDepositByDenom()" :show-denom="true"/>
        <span>{{ $t("GOVERNANCE_VIEW.VOTING_START") }}:</span>
        <span>{{formattedDate(proposal.votingStartTime) }}</span>
        <span>{{ $t("GOVERNANCE_VIEW.VOTING_END") }}:</span>
        <span>{{formattedDate(proposal.votingEndTime) }}</span>
        <span>{{ $t("GOVERNANCE_VIEW.TYPE") }}:</span>
        <ProposalType :proposal="proposal" />
        <span>{{ $t("GOVERNANCE_VIEW.SUBMIT_TIME") }}:</span>
        <span>{{ formattedDate(proposal.submitTime) }}</span>
        <span>{{ $t("GOVERNANCE_VIEW.DEPOSIT_END_TIME") }}:</span>
        <span>{{ formattedDate(proposal.depositEndTime) }}</span>
        <span>{{ $t("GOVERNANCE_VIEW.QUORUM") }}:</span>
        <span><PercentsView :amount="proposalsStore.getTallyParams.quorum" :precision="2"/></span>
        <span>{{ $t("GOVERNANCE_VIEW.THRESHOLD") }}:</span>
        <span>
          <PercentsView :amount="proposalsStore.getTallyParams.threshold" :precision="2"/>
        </span>
        <span>{{ $t("GOVERNANCE_VIEW.VETO_THRESHOLD") }}:</span>
        <span>
          <PercentsView :amount="proposalsStore.getTallyParams.vetoThreshold" :precision="2"/>
        </span>
    </div>
  </div>
</template>

<script setup lang="ts">

import moment from "moment";
import {useProposalsStore} from "@/store/proposals.store";
import { Proposal } from "@/models/store/proposal";
import { VoteOption } from "@/models/store/proposal";
import { computed } from "vue";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView"
import ProposalType from "./ProposalType.vue";

const props = defineProps<{
  proposal?: Proposal
}>();

const proposalsStore = useProposalsStore();
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};
const voted = computed(() => {return useProposalsStore().userVote})

</script>

<style scoped lang="scss">
.details-container{
  box-sizing: border-box;
  text-align: left;
  height: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  .id{
    padding: 15px 20px;
  }

  .vote {
    padding-left: 20px;
    margin-bottom: 10px;
  }

  .user-vote-yes {
    background-color: #72bf44;
  }
  .user-vote-abstain {
    background-color: #27697f;
  }
  .user-vote-no {
    background-color: #e02626;
  }
  .user-vote-veto {
    background-color: #fff1a9;
  }
  .info {
    display: grid;
    grid-template-columns: 1fr 2fr;
    line-height: 1.8rem;
    box-sizing: border-box;
    padding: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    span:nth-child(odd) {
      color: grey;
    }

  }

@media screen and (max-width: 900px) {
  .info {
    grid-template-columns: 2fr 3fr;
    font-size: 0.8em;
  }
}

}
</style>
