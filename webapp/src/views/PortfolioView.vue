<script setup lang="ts">

import PortfolioSummary from "@/components/portfolio/PortfolioSummary.vue";
import PortfolioVesting from "@/components/portfolio/PortfolioVesting.vue";
import {onMounted} from "vue";
import {useUserStore} from "@/store/user.store";
import {usePublicSalesStore} from "@/store/publicSales.store";

const publicSalesStore = usePublicSalesStore();

onMounted(() => {
  publicSalesStore.fetchRoundInfo();
});

</script>

<template>

    <div>
      <Suspense>
        <PortfolioSummary/>
      </Suspense>
      <PortfolioVesting/>
    </div>

</template>

<style scoped lang="scss">

</style>
