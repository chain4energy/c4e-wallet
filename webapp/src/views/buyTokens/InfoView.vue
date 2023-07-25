<template>
  <div class="info">
    <div class="info__top">
      <div>
        <PublicSaleInfo />
      </div>
      <div>
        <InvestmentCalculator @onBuy="onBuyClick" v-if="activeRound"/>
      </div>
    </div>

    <div class="info__details">
      <div class="header">
        <div style="display: inline-flex;">About C4E Tokens</div>
        <div class="links">
          <span>{{$t('BUY_TOKENS_VIEW.TOKENOMICS')}}</span>
          <span>{{$t('BUY_TOKENS_VIEW.WHITE_PAPER')}}</span>
        </div>
      </div>
<!--      <h3>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_FIRST_HEADER')}}</h3>-->
      <p>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_FIRST_CONTENT')}}</p>
<!--      <h3>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_SECOND_HEADER')}}</h3>-->
      <p>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_SECOND_CONTENT')}}</p>
    </div>


    <div v-if="activeRound">
      <div v-for="items in transactions" :key="items" class="userProfile__holder" >
        <AllocationInfo :transaction="items" @pay="onPay(items)"/>
      </div>
    </div>
  </div>
  <BuyTokensModal :visible="showModal"  @closeModal="showModal = false" @confirm="onPayReservation" :reservation="selectedReservation" />
  <OrderModal @onConnect="loginPopupStatus=true" @onAcceptTerms="showApprovalModalFunc" @on-kyc-start="onKycStart" @onProvideClaimerAddress="provideClaimerAddress" @onProvideSourceAddress="provideSourceAddress" />


  <ApprovalModal @close="hideApprovalModal" @submit="hideApprovalModal" v-if="showApprovalModal"/>
  <ProvideAddresInfoModal :address-type="showAddressInfoModalAddressType" :address="showAddressInfoModalAddressType == AddressType.METAMASK ? useUserStore().metamaskConnectionInfo.address : c4eAddress" :display="showAddressInfoModal" @confirm="addressConfirmed" @close="closeProvideAddressModalClose"/>
  <Dialog v-model:visible="kycModalVisible" @hide="useUserServiceStore().getKycStatus()" modal header="KYC" :style="{ width: '95vw', 'max-width': '600px' }">
    <div style="display: flex; align-items: center; justify-content:center; flex-direction: column">
      <synaps-verify
        :sessionId="sessionId"
        :color="{ primary: '72bf44', secondary: 'ffffff' }"
        lang="en"
        :tier="useTransactionContextStore().getRequiredKycTierId"
        service="individual"
        @ready="console.log('ready')"
        @finish="kycModalVisible = false"
      />
    </div>

  </Dialog>
  <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
</template>

<script lang="ts" setup>

import PublicSaleInfo from "@/components/buyTokens/PublicSaleInfo.vue";
import InvestmentCalculator from "@/components/buyTokens/InvestmentCalculator.vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import {computed, onBeforeMount, ref} from "vue";
import AllocationInfo from "@/components/transactions/AllocationInfo.vue";
import Dialog from "primevue/dialog";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import { useUserServiceStore} from "@/store/userService.store";
import {useRouter} from "vue-router";
import {Currency} from "@/models/currency";
import {useToast} from "vue-toastification";
import ApprovalModal from "@/components/buyTokens/modals/ApprovalModal.vue";
import ProvideAddresInfoModal from "@/components/buyTokens/modals/ProvideAddresInfoModal.vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useUserStore} from "@/store/user.store";
import {useContextStore} from "@/store/context.store";
import BuyTokensModal from "@/components/buyTokens/modals/BuyTokensModal.vue";
import SynapsVerify from '@synaps-io/vue3-verify';
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import dataService from "@/services/data.service";
import OrderModal from "@/components/buyTokens/modals/OrderModal.vue";

onBeforeMount(() => {
  dataService.onInfoView();

});
const router = useRouter();
const toast = useToast();
const publicSaleStore = usePublicSalesStore();
const transactionContextStore = useTransactionContextStore();

const showAddressInfoModal = ref(false);
const showAddressInfoModalAddressType = ref(AddressType.KEPLR);

const kycModalVisible = ref(false);
const loginPopupStatus = ref(false);

const showApprovalModal = ref(false);

const onKycStart = () => {
  useUserServiceStore().initKycSession(true).then(() => {
    kycModalVisible.value = true;
    // router.push({name: 'kyc'});
  });

};
function provideClaimerAddress(){
  showAddressInfoModalAddressType.value = AddressType.KEPLR;
  showAddressInfoModal.value = true;
}
function provideSourceAddress(){
  showAddressInfoModalAddressType.value = AddressType.METAMASK;
  useUserStore().connectMetamask();
  showAddressInfoModal.value = true;
}
function hideApprovalModal(){
  showApprovalModal.value = false;
}
const c4eAddress = computed(() => {
  return useUserStore().getAccount.address;
});

const transactions = computed(() => {
  return usePublicSalesStore().getTransactions;
});
const showModal = ref<boolean>(false);
const selectedReservation = ref();

const sessionId = computed(() => {
  return useUserServiceStore().kycSessionId;
});

const onPay = (transaction: TokenReservation) => {
  selectedReservation.value = transaction;
  showModal.value = true;
};
const onBuyClick = () => {
  transactionContextStore.orderModalVisible = true;
};
const onPayReservation = () => {
  showModal.value = false;
  transactionContextStore.setOrderId(selectedReservation.value.orderId);
  if(transactionContextStore.paymentCurrency != Currency.STABLE) {
    router.push({name: 'fiatPaymentConfirmation'});
  } else {
    router.push({name: 'paymentConfirmation'});
  }
};
function showApprovalModalFunc(){
  showApprovalModal.value = true;
}

const onFail = (errorMessage?: string) => {
  let toastMessage = 'An error occurred \n';
  if (errorMessage) toastMessage+=errorMessage;
  toast.error(toastMessage);
};
const usersWallet = computed(() => {
  return useUserStore().getAccount.address;
});
function addressConfirmed(){
  showAddressInfoModal.value = false;
  if(showAddressInfoModalAddressType.value == AddressType.KEPLR) {
    console.log('Connect keplr account');
    if (usersWallet.value) {
      useUserServiceStore().initEmailKeplrPairing(useUserStore().getAccount.address, onSuccessConnect, onFail);
    } else {
      toast.error('You have to be logged in with Email');
    }
  }
  if(showAddressInfoModalAddressType.value == AddressType.METAMASK) {
    console.log('Connect metamask account');
    useUserServiceStore().initEmailMetamaskPairing(useUserStore().metamaskConnectionInfo.address, onSuccessConnect, onFail);
  }
}
const onSuccessConnect = () => {
  useContextStore().addressType = showAddressInfoModalAddressType.value;
  transactionContextStore.orderModalVisible = true;
  router.push({name: 'provideVerificationCode'});
};
function closeProvideAddressModalClose(){
  showAddressInfoModal.value = false;
}

const activeRound = computed(() => {
  if (publicSaleStore.roundInfo)
    return (new Date() < publicSaleStore.roundInfo?.endDate);
  else return false;
});

</script>

<style scoped lang="scss">
.info{
  padding: 25px 54px;
  &__top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap:20px;
    div {
      height:100%;
    }
  }
  &__details{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 36px;
    margin-top: 15px;
    h2{
      font-family: 'Poppins',sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #000000;
    }
    p{
      text-align: start;
      font-family: 'Poppins',sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
    .header {
      display: flex;
      width:100%;
      font-weight:800;
      margin-bottom: 10px;
      flex-wrap: wrap;

      .links{
        margin-right: 0;
        margin-left:auto;
        span {
          padding: 0 15px;
        }
      }
    }
  }

}

@media screen and (max-width: 1024px) {
  .info {
    padding: 25px 5px;
    &__top {
      display: block;
    }
  }
}



</style>
