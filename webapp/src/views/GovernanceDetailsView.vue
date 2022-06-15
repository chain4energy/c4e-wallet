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
import {onBeforeMount, onMounted, ref} from "vue";
import { useRoute } from "vue-router";
import ProposalService from "@/services/proposal.service";
import DetailsChart from "@/components/governance/DetailsChart.vue";
import ProposalDetails from "@/components/governance/ProposalDetails.vue";
import ProposalDescription from "@/components/governance/ProposalDescription.vue";
import TallyingService from "@/services/tallying.service";

const route = useRoute();
const proposalService = new ProposalService();
const tallyingService = new TallyingService();
onBeforeMount(async () => {

  await proposalService.getProposalById(route.params.id.toString())
    .then((data) => {
      proposal.value = data.proposal;
      everythingIsReady.value = true;

    });

  tallyingService.getDataToStore();
});

const proposal = ref(Object);
const everythingIsReady = ref(false);

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.container{
}
</style>

