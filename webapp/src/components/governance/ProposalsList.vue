<template>

  <div v-for="proposal in getProposals" :key="proposal" >
    <proposal-governance :proposal="proposal"></proposal-governance>
  </div>


</template>

<script setup lang="ts">

import ProposalGovernance from "@/components/governance/ProposalGovernance.vue";
import {onActivated, onBeforeMount, onDeactivated, onUnmounted} from "vue";
import ProposalService from "@/services/proposal.service";
import {useProposalStore} from "@/store/proposal.store";
import {storeToRefs} from "pinia";


const proposalService = new ProposalService();
const { getProposals } = storeToRefs(useProposalStore());

onActivated(() => {
  window.addEventListener('scroll', load);
});

onDeactivated(() => {
  window.removeEventListener('scroll', load);
});

onBeforeMount(()=> {
  proposalService.getDataToStore();
});

onUnmounted(() => {
  useProposalStore().deleteProposals();
});

const load = () => {
  let bottomOfWindow = Math.abs(Math.ceil(document.documentElement.scrollTop) + window.innerHeight - document.documentElement.offsetHeight) < 2;

  if (bottomOfWindow && useProposalStore().getPaginationKey) {
      proposalService.getDataToStore(useProposalStore().getPaginationKey);
  }
};

</script>

<style scoped>

</style>
