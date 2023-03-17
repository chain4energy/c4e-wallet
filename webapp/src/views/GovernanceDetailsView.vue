<template>
<span>
        <div class="goBack">
          <div class="goBack__btn" @click="router.push({name: 'proposalsList'})" ><Icon name="ArrowLeft"/>Back</div>
        </div>
    <div class="container-grid">
      <template v-if="everythingIsReady">
        <div class="details">
          <ProposalDetails :proposal="proposal"></ProposalDetails>
        </div>
        <div class="chart">
          <DetailsChart :proposal-detail-tally="proposalDetailsTally" :proposal="proposal"></DetailsChart>
        </div>
      </template>
    </div>
    <div class="description">
      <ProposalDescription :proposal="proposal"></ProposalDescription>
    </div>
      <div class="description">
        <ProposalAdditionalContent :proposal="proposal"></ProposalAdditionalContent>
    </div>
</span>

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
import Icon from "@/components/features/IconComponent.vue";
import ProposalAdditionalContent from "@/components/governance/ProposalAdditionalContent.vue";

const route = useRoute();

onBeforeMount(() => {
  dataService.onProposalSelected(
    Number(route.params.id.toString()),
    () => {
      everythingIsReady.value = true;
    },
    () => {
      router.push({name: 'proposalsList'});
    }
  );
});

onUnmounted(() => {
  dataService.onProposalUnselected();
});

const proposal = computed(()=> {
  return useProposalsStore().getProposal;
});

const proposalDetailsTally = computed(()=> {
  return useProposalsStore().getProposalDetailsTally;
});
const everythingIsReady = ref(false);

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.container-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  .details { grid-area: 1 / 1 / 2 / 5; }
  .chart { grid-area: 1 / 5 / 2 / 7; }
}
  .description {
    width: 100%;
    margin-top: 20px;
  }

.goBack {

  &__btn{
    display: flex;
    cursor: pointer;
    flex-direction: row;
    align-items: flex-start;
  }
}

@media screen and (max-width: 1100px) {
  .container-grid {
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
}
</style>

