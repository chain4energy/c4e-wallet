<template>
  <span>
    <div class="goBack">
      <div class="goBack__btn" @click="router.push({name: 'proposalsList'})">
        <Icon name="ArrowLeft"/>
        Back
      </div>
    </div>
    <template v-if="everythingIsReady">
      <div class="container-grid">
        <div class="details">
          <ProposalDetails/>
        </div>
        <div class="chart">
          <DetailsChart/>
        </div>
      </div>
      <div class="description">
        <ProposalDescription/>
      </div>
      <div class="description">
        <ProposalAdditionalContent/>
      </div>
    </template>
  </span>
</template>

<script setup lang="ts">
import {onBeforeMount, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import DetailsChart from "@/components/governance/DetailsChart.vue";
import ProposalDetails from "@/components/governance/ProposalDetails.vue";
import ProposalDescription from "@/components/governance/ProposalDescription.vue";
import dataService from "@/services/data.service";
import router from "@/router";
import Icon from "@/components/features/IconComponent.vue";
import ProposalAdditionalContent from "@/components/governance/ProposalAdditionalContent.vue";

const route = useRoute();
const everythingIsReady = ref(false);

onBeforeMount(async () => {
  await dataService.onProposalSelected(
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

</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.container-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  .details {
    grid-area: 1 / 1 / 2 / 5;
  }

  .chart {
    grid-area: 1 / 5 / 2 / 7;
  }
}

.description {
  width: 100%;
  margin-top: 20px;
}

.goBack {

  &__btn {
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

