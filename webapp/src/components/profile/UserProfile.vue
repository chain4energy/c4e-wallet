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
            <AllocationInfo :transaction="items" @pay="onPay(items)"/>
          </div>
        </TabPanel>
        <TabPanel>
          <template #header>Transactions</template>
        </TabPanel>
      </TabView>
      <div class="ari10-widget-wrapper" data-widget-id='41875703-9ee2-4729-9d51-e574c61467c3'></div>
    </div>

    <div class="userProfile__extra">
      <Button
        class="p-button p-component secondary userProfile__btn"
        @click="useUserStore().logOut()">Logout</Button>
    </div>
    <PayModal v-model:display="showModal" @close="showModal = false" />
  </div>
</template>

<script lang="ts" setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import AccountInfo from "@/components/transactions/AccountInfo.vue";
import { useUserStore } from "@/store/user.store";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import {computed, onBeforeMount, ref} from "vue";
import AllocationInfo from "@/components/transactions/AllocationInfo.vue";
import {useSaleServiceStore} from "@/store/saleService.store";
import PayModal from "@/components/buyTokens/PayModal.vue";

onBeforeMount(() => {
  usePublicSalesStore().fetchTokenReservations();
});

const showModal = ref<boolean>(false);
const transactions = computed(() => {
  return usePublicSalesStore().getTransactions;
});

const onPay = (transaction: TokenReservation) => {
  showModal.value = true;
  // useSaleServiceStore().initPaymentSession({offeredAmount: Number(transaction.amount.amount), offeredCurrencyCode: '', orderId: 1})
  //   .then(transactionId => {
  //     if(transactionId)
  //       window.dispatchEvent(
  //         new CustomEvent('ari10-widget-start-commodities-payment-request', {
  //           detail: {
  //             transactionId: transactionId,
  //           }
  //         })
  //       );
  //   });
};
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
