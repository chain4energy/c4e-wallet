<template>
    <span v-if="proposal">{{ getProposalInfo() }}</span>
</template>

<script setup lang="ts">
import { Proposal } from "@/models/store/proposal";
import i18n from "@/plugins/i18n";

const props = defineProps<{
  proposal?: Proposal
}>();

function getProposalInfo() {
  let type = undefined;
  if(props.proposal?.messages) {
    type = props.proposal.messages[0].type;
  } else {
    if(props.proposal?.content?.type) {
      type = props.proposal?.content?.type;
    } else {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.TEXT_PROPOSAL');
    }
  }
  switch(type) {
    case '/cosmos.params.v1beta1.ParameterChangeProposal': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.PARAMETER_CHANGE_PROPOSAL');
    }
    case '/cosmos.staking.v1beta1.MsgUpdateParams': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.PARAMETER_CHANGE_PROPOSAL');
    }
    case '/chain4energy.c4echain.cfeminter.MsgUpdateParams': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.PARAMETER_CHANGE_PROPOSAL');
    }
    case '/chain4energy.c4echain.cfedistributor.MsgUpdateSubDistributorDestinationShareParam': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.PARAMETER_CHANGE_PROPOSAL');
    }
    case '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.COMMUNITY_POOL_SPEND_PROPOSAL');
    }
    case '/cosmos.distribution.v1beta1.CommunityPoolSpendProposalWithDeposit': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.COMMUNITY_POOL_SPEND_PROPOSAL_WITH_DEPOSIT');
    }
    case '/cosmos.gov.v1beta1.TextProposal': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.TEXT_PROPOSAL');
    }
    case '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.CANCEL_SOFTWARE_UPGRADE_PROPOSAL');
    }
    case '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal': {
      return i18n.global.t('GOVERNANCE_VIEW.PROPOSAL_TYPE.SOFTWARE_UPGRADE_PROPOSAL');
    }
    default: {
      return type;
    }
  }
}

</script>

<style scoped lang="scss">

</style>
