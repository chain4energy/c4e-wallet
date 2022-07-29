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
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import DetailsChart from "@/components/governance/DetailsChart.vue";
import ProposalDetails from "@/components/governance/ProposalDetails.vue";
import ProposalDescription from "@/components/governance/ProposalDescription.vue";
import {useProposalsStore} from "@/store/proposals.store";
import {Proposal} from "@/models/store/proposal";
import dataService from "@/services/data.service";

const route = useRoute();

const proposalsStore = useProposalsStore();
onBeforeMount(() => {
  dataService.onProposalSelected(Number(route.params.id.toString()), () => {
    everythingIsReady.value = true;
  });
  // await proposalsStore.fetchProposalById(Number(route.params.id.toString())).then( () => {
  //   proposal.value = proposalsStore.getProposal;
  //   everythingIsReady.value = true;
  // });

});
// onBeforeMount(() => {
//   useProposalsStore().fetchTallyParams();
// });

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

