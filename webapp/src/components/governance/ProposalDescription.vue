<template>
  <div v-if="proposal" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DESCRIPTION") }}</h2>
    <div style="margin-top: 20px;">
      <MarkdownRender :source="getDescription()"/>
    </div>
  </div>
</template>
<script setup lang="ts">

import {Proposal} from "@/models/store/proposal";
import MarkdownRender from "@/components/commons/MarkdownRender.vue";

const props = defineProps<{
  proposal?: Proposal
}>();

const getDescription = () => {
  if(props.proposal?.content?.description)
    return props.proposal.content.description;
  else if(props.proposal?.metaData)
    try {
      return JSON.parse(props.proposal.metaData).description;
    } catch(e) {
      console.log(e);
      return '';
    }

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
