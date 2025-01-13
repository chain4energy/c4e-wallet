<template>
  <div v-if="proposal" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DESCRIPTION") }}</h2>
    <div style="margin-top: 20px;">
      <MarkdownRender :source="getDescription()"/>
    </div>
    <div v-if="getVotingOption()" style="margin-top: 20px;">
      <MarkdownRender :source="getVotingOption()"/>
    </div>
    <div v-if="getProposalForumUrl()">
      <span>{{ $t("GOVERNANCE_VIEW.VIEW_ON_FORUM") }}:</span>
      <span style="padding-left: 4px"><a v-bind:href="getProposalForumUrl()" target="_blank">{{getProposalForumUrl()}}</a></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import MarkdownRender from "@/components/commons/MarkdownRender.vue";
import {computed} from "vue";
import {useProposalsStore} from "@/store/proposals.store";

const proposal = computed(() => {
  return useProposalsStore().getSelectedProposal.proposal;
});

function getProposalForumUrl(){
  if (proposal.value?.proposalInfoIps?.proposal_forum_url) {
    return proposal.value?.proposalInfoIps.proposal_forum_url;
  }
  return undefined;
}

function getVotingOption(){
  if (proposal.value?.proposalInfoIps?.vote_option_context) {
    return proposal.value?.proposalInfoIps.vote_option_context;
  }
  return undefined;
}

const getDescription = () => {
  if (proposal.value?.proposalInfoIps) {
    return proposal.value?.proposalInfoIps.details;
  } else if (proposal.value?.summary) {
    return proposal.value?.summary;
  } else if (proposal.value?.content?.description) {
    return proposal.value.content.description;
  } else if (proposal.value?.metaData)
    try {
      return JSON.parse(proposal.value.metaData).description;
    } catch (e) {
      console.log(e);
      return '';
    }
};

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
}
</style>
