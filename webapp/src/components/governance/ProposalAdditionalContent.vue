<template>
  <div v-if="proposal" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.ADDITIONAL_CONTENT") }}</h2>
    <ProposalChanges :proposal-changes="proposal.content?.changes"></ProposalChanges>
    <ProposalPlan :proposal-plan="proposal.content.plan"></ProposalPlan>
  </div>
</template>
<script setup lang="ts">

import {Proposal} from "@/models/store/proposal";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import ProposalChanges from "@/components/governance/ProposalChanges.vue";
import ProposalPlan from "@/components/governance/ProposalPlan.vue";
const props = defineProps<{
  proposal?: Proposal
}>();

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 20px;

}


</style>
