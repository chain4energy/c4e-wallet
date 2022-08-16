<template>
    <div class="container-grid">
      <template v-if="everythingIsReady">
        <div class="goBack">
          <div class="goBack__btn" @click="router.push({name: 'proposalsList'})" ><Icon name="ArrowLeft"/>Back</div>
        </div>
        <div class="details">
          <ProposalDetails :proposal="proposal"></ProposalDetails>
        </div>
        <div class="chart">
          <DetailsChart :proposal="proposal"></DetailsChart>
        </div>
        <div class="description">
          <ProposalDescription :proposal="proposal"></ProposalDescription>
        </div>
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
import Icon from "@/components/features/IconComponent.vue";

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
.container-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(1, 2fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
    .details { grid-area: 2 / 1 / 2 / 5; }
    .chart { grid-area: 2 / 5 / 2 / 7; }
    .description { grid-area: 3 / 1 / 3 / 7; }
}
.goBack{

  &__btn{
    display: flex;
    cursor: pointer;
    flex-direction: row;
    width: 30%;
    align-items: flex-start;
    justify-content: space-evenly;
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

