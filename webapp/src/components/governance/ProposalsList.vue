<template>
  <div class="proposals-grid">
      <proposal-governance v-for="proposal in useProposalsStore().getProposals" :key="proposal" :proposal="proposal"></proposal-governance>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ProposalsList',
  inheritAttrs: false,
  customOptions: {}
};
</script>
<script setup lang="ts">

import ProposalGovernance from "@/components/governance/ProposalGovernance.vue";
import {onActivated, onBeforeMount, onDeactivated, onUnmounted} from "vue";
import {useProposalsStore} from "@/store/proposals.store";
import dataService from "@/services/data.service";

onActivated(() => {
 window.addEventListener('scroll', load);
});

onDeactivated(() => {
 window.removeEventListener('scroll', load);
});

onBeforeMount(()=> {
  dataService.onGovernanceSelected();
});

onUnmounted(() => {
  dataService.onGovernanceUnselected();
});

const load = () => {
 let bottomOfWindow = Math.abs(Math.ceil(document.documentElement.scrollTop) + window.innerHeight - document.documentElement.offsetHeight) < 2;
 if (bottomOfWindow) {
    dataService.onGovernanceScroll();
 }
};

</script>

<style lang='scss' scoped>
.proposals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  box-sizing: border-box;
  width: 100%;
}

@media screen and (max-width: 990px) {
  .proposals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
