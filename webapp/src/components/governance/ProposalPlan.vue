<template>
  <div v-if="proposalPlan">
    <div class="info">
      <span>Height</span>
      <span>{{proposalPlan.height}}</span>
      <span>Info</span>
      <span>{{proposalPlan.info}}</span>
      <span>Name</span>
      <span>{{proposalPlan.name}}</span>
      <span>Time</span>
      <span>{{proposalPlan.time}}</span>
      <span>Upgraded client state</span>
      <span>{{ proposalPlan.upgradedClientState }}</span>
    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalsPlan} from "@/models/store/proposal";
const props = defineProps<{
  proposalPlan?: ProposalsPlan
}>();

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
