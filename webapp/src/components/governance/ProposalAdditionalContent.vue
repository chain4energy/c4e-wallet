<template>
  <div v-if="checkIfDisplay()" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DETAILS") }}</h2>
    <ProposalNewApiV1 v-if="isNewApiV1(proposal)" :proposal="proposal"/>
    <ProposalChanges v-else-if="proposal?.content?.type===ProposalType.PARAMETER_CHANGE" :proposal-changes="proposal.content?.changes"></ProposalChanges>
    <ProposalPlan v-else-if="proposal?.content?.type===ProposalType.SOFTWARE_UPGRADE" :proposal-plan="proposal.content.plan"></ProposalPlan>
    <ProposalCommunityPoolSpend v-else-if="proposal?.content?.type===ProposalType.COMMUNITY_POOL_SPEND" :proposal-content="proposal.content"></ProposalCommunityPoolSpend>
    <ProposalNotLegacyContent v-else-if="proposal?.type!==ProposalType.LEGACY_CONTENT" :proposal="proposal"></ProposalNotLegacyContent>
  </div>
</template>
<script setup lang="ts">

import {Proposal, ProposalType} from "@/models/store/proposal";
import ProposalChanges from "@/components/governance/ProposalParameterChange.vue";
import ProposalPlan from "@/components/governance/ProposalSoftwareUpgrade.vue";
import ProposalCommunityPoolSpend from "@/components/governance/ProposalCommunityPoolSpend.vue";
import {computed, onMounted} from "vue";
import {useProposalsStore} from "@/store/proposals.store";
import ProposalNotLegacyContent from "@/components/governance/ProposalNotLegacyContent.vue";
import ProposalNewApiV1 from "@/components/governance/ProposalNewApiV1.vue";
import {useConfigurationStore} from "@/store/configuration.store";

const proposal = computed(() => {
  return useProposalsStore().getSelectedProposal.proposal;
});

onMounted(() => {
  console.log("ProposalAdditionalContent proposal:" + JSON.stringify(proposal.value));
});

const checkIfDisplay = () => {
  let type = proposal.value?.content?.type;
  if (isNewApiV1(proposal.value)
    || type == ProposalType.COMMUNITY_POOL_SPEND
    || type == ProposalType.SOFTWARE_UPGRADE
    || type == ProposalType.PARAMETER_CHANGE
    || (proposal.value?.type != ProposalType.LEGACY_CONTENT && proposal.value?.type != ProposalType.TEXT ))
    return true;
  return false;
};

function isNewApiV1(proposal?: Proposal): boolean {
  if(proposal && proposal.messages){
    const proposalMappings = useConfigurationStore().getConfig.proposalMappings;
    const proposalTypes = proposal.messages.map((proposal) => proposal.type);
    return proposalTypes.some((type) =>
      proposalMappings.some((mapping) => mapping.proposalType === type)
    );
  } else {
    return false;
  }
}


</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
}

</style>
