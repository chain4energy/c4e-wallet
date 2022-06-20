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
import {onBeforeMount, ref} from "vue";
import { useRoute } from "vue-router";
import DetailsChart from "@/components/governance/DetailsChart.vue";
import ProposalDetails from "@/components/governance/ProposalDetails.vue";
import ProposalDescription from "@/components/governance/ProposalDescription.vue";
import {useProposalsStore} from "@/store/proposals.store";
import {Proposal} from "@/models/Proposal";

const route = useRoute();

const proposalsStore = useProposalsStore();
onBeforeMount(async () => {
  await proposalsStore.fetchProposalById(route.params.id.toString()).then( () => {
    proposal.value = proposalsStore.getProposal;
    everythingIsReady.value = true;
  });

});
onBeforeMount(() => {
  useProposalsStore().fetchTallyParams();
});


const proposal = ref<Proposal>(Object);
const everythingIsReady = ref(false);

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.container{
}
</style>

