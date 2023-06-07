<template>
<!--  <AddressModal style="position: fixed; z-index: 99999" @close="hideAddAddress" @submit="submitEmail" v-if="showAddressAdd" />-->
  <ApprovalModal @close="hideApprovalModal" @submit="console.log(1)" v-if="showApprovalModal"/>
  <div class="userProfile">
    <div class="userProfile__holder">
      <TabView>
        <TabPanel class="userProfile__tabHeader">
          <template #header>Account info</template>
          <AccountInfo :accordion="false" @open-modal="showAddressAddModal" @open-approval="showApprovalModalFunc"/>
        </TabPanel>
        <TabPanel>
          <template #header>Transactions</template>
        </TabPanel>
      </TabView>
    </div>

    <div class="userProfile__extra">
      <Button v-if="useUserServiceStore().isLoggedIn"
        class="p-button p-component secondary userProfile__btn"
        @click="useUserServiceStore().logOutAccount()">Logout</Button>
    </div>
<!--    <PayModal v-model:display="showModal" v-model:reservation="selectedReservation" @close="showModal = false" />-->
  </div>
</template>

<script lang="ts" setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import AccountInfo from "@/components/transactions/AccountInfo.vue";
import { useUserStore } from "@/store/user.store";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import AllocationInfo from "@/components/transactions/AllocationInfo.vue";
import PayModal from "@/components/buyTokens/PayModal.vue";
import {useUserServiceStore} from "@/store/userService.store";
import AddressModal from "@/components/buyTokens/modals/AddressModal.vue";
import ApprovalModal from "@/components/buyTokens/modals/ApprovalModal.vue";

const showAddressAdd = ref(false);
const showApprovalModal = ref(false);

onBeforeMount(() => {
  usePublicSalesStore().fetchTokenReservations();
});

onMounted(() =>{
  useUserServiceStore().getAccount(()=>{console.log(1)}, ()=>{console.log(2)})
})


const currency = computed(() => {
  return usePublicSalesStore().getC4eToUSDC;
});
const showModal = ref<boolean>(false);
const selectedReservation = ref();
const transactions = computed(() => {
  return usePublicSalesStore().getTransactions;
});
function submitEmail(){
  hideAddAddress();
}

function showAddressAddModal(){
  showAddressAdd.value = true;
}
function hideAddAddress(){
  showAddressAdd.value = false;
}

function showApprovalModalFunc(){
  showApprovalModal.value = true;
}
function hideApprovalModal(){
  showApprovalModal.value = false;
}


const onPay = (transaction: TokenReservation) => {
  selectedReservation.value = transaction;
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
