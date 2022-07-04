<template>

  <div v-for="proposal in getProposals.elements" :key="proposal" >
    <proposal-governance :proposal="proposal"></proposal-governance>
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
import {storeToRefs} from "pinia";

const proposalsStore = useProposalsStore();
const { getProposals } = storeToRefs(useProposalsStore());

onActivated(() => {
  window.addEventListener('scroll', load);
});

onDeactivated(() => {
  window.removeEventListener('scroll', load);
});

onBeforeMount(()=> {
  proposalsStore.fetchProposals();
});

onUnmounted(() => {
  proposalsStore.$reset();
});

const load = () => {
  let bottomOfWindow = Math.abs(Math.ceil(document.documentElement.scrollTop) + window.innerHeight - document.documentElement.offsetHeight) < 2;

  if (bottomOfWindow && useProposalsStore().getPaginationKey) {

    proposalsStore.fetchProposals();
  }
};

</script>

<style scoped>

</style>
