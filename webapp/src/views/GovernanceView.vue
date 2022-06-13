<template>
  <span>Governance View</span>

  <div v-for="proposal in getProposals" :key="proposal">
    <proposal-governance :proposal="proposal"></proposal-governance>
  </div>
</template>

<script setup lang="ts">

import ProposalGovernance from "@/components/governance/ProposalGovernance.vue";
import {onMounted} from "vue";
import ProposalService from "@/services/proposal.service";
import {useProposalStore} from "@/store/proposal.store";
import {storeToRefs} from "pinia";

const proposalService = new ProposalService();
const { getProposals } = storeToRefs(useProposalStore());

onMounted(()=> {

  proposalService.getDataToStore();
});

</script>

<style scoped>

</style>
