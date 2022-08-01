<template>
    <div class="container">
      <template v-if="everythingIsReady">
        <DetailsChart :proposal="proposal"></DetailsChart>
        <ProposalDetails :proposal="proposal"></ProposalDetails>
        <ProposalDescription :proposal="proposal"></ProposalDescription>
      </template>
    </div>

</template>

<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import DetailsChart from "@/components/governance/DetailsChart.vue";
import ProposalDetails from "@/components/governance/ProposalDetails.vue";
import ProposalDescription from "@/components/governance/ProposalDescription.vue";
import dataService from "@/services/data.service";
import router from "@/router";
import { useProposalsStore } from "@/store/proposals.store";

const route = useRoute();

onBeforeMount(() => {
  dataService.onProposalSelected(
    Number(route.params.id.toString()), 
    () => {
      everythingIsReady.value = true;
    }, 
    () => {
      router.push({name: 'proposalsList'})
    }
  );
});

onUnmounted(() => {
  dataService.onProposalUnselected();
});

const proposal = computed(()=> {
  return useProposalsStore().getProposal
})
const everythingIsReady = ref(false);

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.container{
}
</style>

