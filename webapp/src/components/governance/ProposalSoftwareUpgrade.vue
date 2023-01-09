<template>
  <div v-if="proposalPlan">
    <div class="info">
      <span>{{ $t("GOVERNANCE_VIEW.HEIGHT") }}</span>
      <span>{{proposalPlan.height}}</span>
      <span>{{ $t("GOVERNANCE_VIEW.INFO") }}</span>
      <span v-html="getLink(proposalPlan.info)"></span>
      <span>{{ $t("GOVERNANCE_VIEW.NAME") }}</span>
      <span>{{proposalPlan.name}}</span>
      <span>{{ $t("GOVERNANCE_VIEW.TIME") }}</span>
      <span>{{proposalPlan.time}}</span>
      <span>{{ $t("GOVERNANCE_VIEW.UPGRADED_CLIENT_STATE") }}</span>
      <span>{{ proposalPlan.upgradedClientState }}</span>
    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalsPlan} from "@/models/store/proposal";

const props = defineProps<{
  proposalPlan?: ProposalsPlan
}>();

const getLink = (info: string) => {
  return info.replace(/##(.+?)##/g, (_, link) => `<a href="${link}" target="_blank">${link}</a>`);
};
</script>

<style scoped lang="scss">
.info {
  display: grid;
  grid-template-rows: 40px;
  grid-template-columns: 1fr 1fr;
  line-height: 1.8rem;
  box-sizing: border-box;
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


</style>
