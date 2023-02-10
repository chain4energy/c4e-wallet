<template>
  <div v-if="proposal" class="details-container">
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
        <span>
          <DateCommon :date="proposal.votingStartTime"/>
        </span>
        <span>{{ $t("GOVERNANCE_VIEW.VOTING_END") }}:</span>
        <span>
          <DateCommon :date="proposal.votingEndTime"/>
        </span>
        <span>{{ $t("GOVERNANCE_VIEW.TYPE") }}:</span>
        <ProposalType :proposal="proposal" />
        <span>{{ $t("GOVERNANCE_VIEW.SUBMIT_TIME") }}:</span>
        <span>
          <DateCommon :date="proposal.submitTime"/>
        </span>
        <span>{{ $t("GOVERNANCE_VIEW.DEPOSIT_END_TIME") }}:</span>
        <span>
          <DateCommon :date="proposal.depositEndTime"/>
        </span>
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
      <span>{{ $t("GOVERNANCE_VIEW.VIEW_IN_EXPLORER") }}:</span>
      <span><a v-bind:href="url" target="_blank">{{url}}</a></span>

    </div>
  </div>
</template>

<script setup lang="ts">

import moment from "moment";
import {useProposalsStore} from "@/store/proposals.store";
import {Proposal, ProposalStatus} from "@/models/store/proposal";
import { VoteOption } from "@/models/store/proposal";
import { computed, onMounted } from "vue";
import CoinAmount from "../commons/CoinAmount.vue";
import PercentsView from "@/components/commons/PercentsView";
import DateCommon from "@/components/commons/DateCommon.vue";
import ProposalType from "./ProposalType.vue";
import {useConfigurationStore} from "@/store/configuration.store";

const props = defineProps<{
  proposal?: Proposal
}>();

onMounted(() => {
  console.log(props.proposal);
});

const proposalsStore = useProposalsStore();
const url = useConfigurationStore().config.explorerUrl + "/proposals/" + props.proposal?.proposalId;
const formattedDate = (value: Date) => {
  return moment(value).format('DD MMMM YYYY HH:mm:ss');
};

const voted = computed(() => {
  return useProposalsStore().userVote;
});
const icons  = new Map<string, string>([
  [ProposalStatus.PASSED, "CheckSquare"],
  [ProposalStatus.REJECTED, "XCircle"],
  [ProposalStatus.DEPOSIT_PERIOD, ""],
  [ProposalStatus.FAILED, ""],
  [ProposalStatus.VOTING_PERIOD, ""],
  [ProposalStatus.UNSPECIFIED, ""]
]);
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.details-container{
  box-sizing: border-box;
  text-align: left;
  height: 100%;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  .voting-status {
    float: right;
    height: 50px;
    width: 150px;
    padding: 15px 0px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0 10px 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 5px;
    }
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
  .id{
    padding: 15px 20px;
  }

  .vote {
    margin: 0 20px;
    padding: 5px 0;
    margin-bottom: 10px;
    border-radius: 15px;
    text-align: center;
    -webkit-box-shadow: inset 0 3px 27px -12px rgba(66, 68, 90, 1);
    -moz-box-shadow: inset 0 3px 27px -12px rgba(66, 68, 90, 1);
    box-shadow: inset 0 3px 27px -12px rgba(66, 68, 90, 1);
  }

  .user-vote-yes {
    background-color: #72bf44;
    color: white;
  }
  .user-vote-abstain {
    background-color: #27697f;
    color: white;
  }
  .user-vote-no {
    background-color: #e02626;
    color: white
  }
  .user-vote-veto {
    background-color: #FDDB2A;
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
