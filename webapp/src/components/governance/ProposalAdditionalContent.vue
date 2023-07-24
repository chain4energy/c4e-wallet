<template>
  <div v-if="checkIfDisplay()" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DETAILS") }}</h2>
    <ProposalChanges v-if="proposal?.content?.type===ProposalType.PARAMETER_CHANGE" :proposal-changes="proposal.content?.changes"></ProposalChanges>
    <ProposalPlan v-if="proposal?.content?.type===ProposalType.SOFTWARE_UPGRADE" :proposal-plan="proposal.content.plan"></ProposalPlan>
    <ProposalCommunityPoolSpend v-if="proposal?.content?.type===ProposalType.COMMUNITY_POOL_SPEND" :proposal-content="proposal.content"></ProposalCommunityPoolSpend>
    <ProposalNotLegacyContent v-if="proposal?.type!==ProposalType.LEGACY_CONTENT" :proposal="proposal"></ProposalNotLegacyContent>
  </div>
</template>
<script setup lang="ts">

import {Proposal, ProposalType} from "@/models/store/proposal";
import ProposalChanges from "@/components/governance/ProposalParameterChange.vue";
import ProposalPlan from "@/components/governance/ProposalSoftwareUpgrade.vue";
import ProposalCommunityPoolSpend from "@/components/governance/ProposalCommunityPoolSpend.vue";
import ProposalNotLegacyContent from "@/components/governance/ProposalNotLegacyContent.vue";

const props = defineProps<{
  proposal?: Proposal
}>();



const checkIfDisplay = () => {
  let type = props.proposal?.content?.type;
  if (type == ProposalType.COMMUNITY_POOL_SPEND || type == ProposalType.SOFTWARE_UPGRADE || type == ProposalType.PARAMETER_CHANGE
    || props.proposal?.type != ProposalType.LEGACY_CONTENT)
    return true;
  return false;
};

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 20px;

}


</style>
