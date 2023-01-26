<template>
  <div v-if="proposalPlan">
    <div class="info">
      <span>{{ $t("GOVERNANCE_VIEW.HEIGHT") }}</span>
      <span>{{ proposalPlan.height }}</span>
      <template v-if="!alreadyDone">
        <span>{{ $t("GOVERNANCE_VIEW.ESTIMATED_TIME_LEFT") }}</span>
        <span><EstimatedTimeLeft :height="Number(props.proposalPlan.height)"/></span>
      </template>
      <template v-else>
        <span>{{ $t("GOVERNANCE_VIEW.ESTIMATED_TIME_LEFT") }}</span>
        <span>blocks/{{props.proposalPlan.height}}</span>
      </template>
      <span>{{ $t("GOVERNANCE_VIEW.INFO") }}</span>
      <span>{{ proposalPlan.info }}</span>
      <span>{{ $t("GOVERNANCE_VIEW.NAME") }}</span>
      <span>{{ proposalPlan.name }}</span>
    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalsPlan} from "@/models/store/proposal";
import {computed} from "vue";
import {useBlockStore} from "@/store/block.store";
import EstimatedTimeLeft from "@/components/commons/EstimatedTimeLeft.vue";

const props = defineProps<{
  proposalPlan?: ProposalsPlan
}>();

const alreadyDone = computed(() => {
  // return true;
  if (props.proposalPlan?.height) {
    return Number(props.proposalPlan?.height) - useBlockStore().getLatestBlock.height < 0;
  }
  return false;
});

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
