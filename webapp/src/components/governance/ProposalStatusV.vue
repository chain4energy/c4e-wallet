<template>
  <div class="proposal-status">
    <div v-if="proposal?.status == 'PROPOSAL_STATUS_VOTING_PERIOD'" class="voting">
      <Icon :name=icons.get(proposal.status)>
      </Icon>
      {{ $t("GOVERNANCE_VIEW." + proposal.status) }}
    </div>
    <div v-if="proposal?.status == 'PROPOSAL_STATUS_REJECTED'" class="rejected">
      <Icon :name=icons.get(proposal.status)>
      </Icon>
      {{ $t("GOVERNANCE_VIEW." + proposal.status) }}
    </div>
    <div v-if="proposal?.status == 'PROPOSAL_STATUS_PASSED'" class="accepted">
      <Icon :name=icons.get(proposal.status)>
      </Icon>
      {{ $t("GOVERNANCE_VIEW." + proposal.status) }}
    </div>
    <div v-if="proposal?.status == 'PROPOSAL_STATUS_DEPOSIT_PERIOD'" class="deposit">
      <Icon :name=icons.get(proposal.status)>
      </Icon>
      {{ $t("GOVERNANCE_VIEW." + proposal.status) }}
    </div>
    <div v-if="proposal?.status == 'PROPOSAL_STATUS_FAILED'" class="failed">
      <Icon :name=icons.get(proposal.status)>
      </Icon>
      {{ $t("GOVERNANCE_VIEW." + proposal.status) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {Proposal, ProposalStatus} from "@/models/store/proposal";
import Icon from "@/components/features/IconComponent.vue";

const icons = new Map<string, string>([
  [ProposalStatus.PASSED, "CheckSquare"],
  [ProposalStatus.REJECTED, "XCircle"],
  [ProposalStatus.DEPOSIT_PERIOD, ""],
  [ProposalStatus.FAILED, ""],
  [ProposalStatus.VOTING_PERIOD, ""],
  [ProposalStatus.UNSPECIFIED, ""]
]);

const props = defineProps<{
  proposal: Proposal
}>();

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.proposal-status {

  overflow: hidden;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    margin-right: 5px;
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
</style>
