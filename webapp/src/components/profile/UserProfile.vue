<template>
  <div class="userProfile">
    <div class="userProfile__holder">
      <TabView>
        <TabPanel class="userProfile__tabHeader">
          <template #header>Account info</template>
          <AccountInfo :accordion="false"/>
          <div class="userProfile__holder">
            <InvestmentCalculator :rate="0.1"/>
          </div>
          <div v-for="items in transactions" :key="items" class="userProfile__holder">
            <AllocationInfo :transaction="items"/>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>Transactions</template>
        </TabPanel>
      </TabView>
    </div>

    <div class="userProfile__extra">
      <Button
        class="p-button p-component secondary userProfile__btn"
        @click="useUserStore().logOut()">Logout</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import AccountInfo from "@/components/transactions/AccountInfo.vue";
import { useUserStore } from "@/store/user.store";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import { usePublicSalesStore } from "@/store/publicSales.store";
import { computed } from "vue";
import AllocationInfo from "@/components/transactions/AllocationInfo.vue";

usePublicSalesStore().setTransactions();

const transactions = computed(() => {
  return usePublicSalesStore().getTransactions;
});

</script>

<style scoped lang="scss">
.userProfile{
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 25px 46px;
  border-radius: 5px;
  align-items: flex-end;
  &__holder{
    width: 100%;
    align-items: center;
  }
  &__extra{
    padding: 83px 0 0 0;
    display: flex;
    align-items: flex-end;
    right: 0;
  }
  &__btn{
    border-radius: 24px;
    width: 161px;
    min-height: 40px;
    font-family: 'Work Sans',sans-serif;
  }

}
</style>
