<template>
  <div v-if="proposalPlan">
    <div class="info">
      <span>{{ $t("GOVERNANCE_VIEW.HEIGHT") }}</span>
      <span>{{ proposalPlan.height }}</span>
      <span>{{ $t("GOVERNANCE_VIEW.INFO") }}</span>
      <span>{{ proposalPlan.info }}</span>
      <span>{{ $t("GOVERNANCE_VIEW.NAME") }}</span>
      <span>{{ proposalPlan.name }}</span>
      <template v-if="!alreadyDone">
        <div style="color:gray">{{ $t("GOVERNANCE_VIEW.ESTIMATED_TIME_LEFT") }}</div>
        <div><EstimatedTimeLeft :height="Number(props.proposalPlan.height)"/></div>
        <div style="color:gray">{{ $t("GOVERNANCE_VIEW.ESTIMATED_DATE") }}</div>
        <div><EstimatedUpgradeDate :height="Number(props.proposalPlan.height)"/></div>
      </template>
      <template v-else>
        <span>{{ $t("GOVERNANCE_VIEW.UPDATED_IN_BLOCK") }}</span>
        <span v-html="getLink(useConfigurationStore().config.explorerUrl + '/blocks/' + props.proposalPlan.height)"/>
      </template>

    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalsPlan} from "@/models/store/proposal";
import {computed} from "vue";
import EstimatedTimeLeft from "@/components/commons/EstimatedTimeLeft.vue";
import EstimatedUpgradeDate from "@/components/commons/EstimatedUpgradeDate.vue";
import {useConfigurationStore} from "../../store/configuration.store";
import {useBlockStore} from "@/store/block.store";


const props = defineProps<{
  proposalPlan?: ProposalsPlan
}>();

const alreadyDone = computed(() => {
  if (props.proposalPlan?.height) {
    return Number(props.proposalPlan?.height) - useBlockStore().getLatestBlock.height < 0;
  }
  return false;
});

const getLink = (link: string) => {
  return "<a href=" + link + " target='_blank'>" + link + "</a>";
};
</script>

<style scoped lang="scss">
.info {
  display: grid;
  grid-auto-rows: minmax(33px, auto);
  grid-template-columns: 1fr 1fr;
  //line-height: 1.8rem;
  //box-sizing: border-box;
  //text-overflow: ellipsis;
  //overflow: hidden;
  //white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;

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
