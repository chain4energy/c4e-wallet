<template>

  <div v-for="proposal in getProposals" :key="proposal">

    <proposal-governance :proposal="proposal"></proposal-governance>

  </div>


</template>

<script setup lang="ts">

import ProposalGovernance from "@/components/governance/ProposalGovernance.vue";
import {onBeforeMount, onUnmounted, ref} from "vue";
import ProposalService from "@/services/proposal.service";
import {useProposalStore} from "@/store/proposal.store";
import {storeToRefs} from "pinia";

const proposalService = new ProposalService();
const { getProposals } = storeToRefs(useProposalStore());

onBeforeMount(()=> {
  proposalService.getDataToStore();
  window.addEventListener('scroll', load);
});

onUnmounted(() => {
  useProposalStore().deleteProposals();
});

onUnmounted(() => {
  window.removeEventListener('scroll', load);
});
const page = ref(1);

const load = () => {
  let bottomOfWindow = Math.ceil(document.documentElement.scrollTop) + window.innerHeight === document.documentElement.offsetHeight;
  if (bottomOfWindow) {
    console.log(useProposalStore().getPaginationKey)
    proposalService.getDataToStore(useProposalStore().getPaginationKey);
    page.value += 1;
  }
};

</script>

<style scoped>

</style>
