<template>
  <div class="info">
    <PublicSaleInfo />
    <div class="info__details">
      <h2>Chain4Energy token sale</h2>
      <h3>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_FIRST_HEADER')}}</h3>
      <p>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_FIRST_CONTENT')}}</p>
      <h3>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_SECOND_HEADER')}}</h3>
      <p>{{$t('BUY_TOKENS_VIEW.DESCRIPTION_SECOND_CONTENT')}}</p>
    </div>
    <div class="info__links">
      <span>{{$t('BUY_TOKENS_VIEW.TOKENOMICS')}}</span>
      <span>{{$t('BUY_TOKENS_VIEW.WHITE_PAPER')}}</span>
    </div>
    <InvestmentCalculator @onBuy="onBuyClick" />
    <div v-for="items in transactions" :key="items" class="userProfile__holder">
      <AllocationInfo :transaction="items" @pay="onPay(items)"/>
    </div>
  </div>
<!--  <PayModal v-model:display="showModal" v-model:reservation="selectedReservation" @close="showModal = false" />-->
  <BuyTokensModal :visible="showModal"  @closeModal="showModal = false" @confirm="onPayReservation" :reservation="selectedReservation" />

  <Dialog v-model:visible="transactionContextStore.orderModalVisible" closeIcon="false" modal :header="i18n.t('BUY_TOKENS_VIEW.ORDER_SUMMARY')" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px', 'z-index': 500}">
    <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
      <h5 style="font-weight:700">{{$t('BUY_TOKENS_VIEW.YOU_INVEST')}} {{transactionContextStore.amountToBuy}} C4E</h5>
      <div class="requirements_container">
        <div>
          {{$t('BUY_TOKENS_VIEW.PASS_KYC')}} {{transactionContextStore.getRequiredKycLevel}}
          <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.KYC')"/>
        </div>
        <div v-if="isKycLevelRequired">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else><Button @click="onKycStart" class="p-button p-component secondary-link button-w7">{{$t('BUTTONS.START_KYC')}}</Button></div>
        <div>{{$t('BUY_TOKENS_VIEW.ACCEPT_SALE_TERMS')}} <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.TERMS')"/></div>
        <div v-if="isTermsAccepted">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else ><Button class="p-button p-component secondary-link button-w7" @click="showApprovalModalFunc">{{$t('BUTTONS.ACCEPT')}}</Button></div>
        <div>{{$t('BUY_TOKENS_VIEW.PROVIDE_CLAIMER_ADDRESS')}} <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.CLAIMER_ADDRESS')"/></div>
        <div v-if="claimerAddress != undefined">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else-if="!isLoggedIn && claimerAddress == undefined">
          <Button @click="loginPopupStatus=true"
                  class="p-button p-component secondary-link button-w7">
          {{ $t('COMMON.CONNECT') }}
          </Button>
        </div>
        <div v-else><Button @click="provideClaimerAddress" class="p-button p-component secondary-link button-w7">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button></div>
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE">{{$t('BUY_TOKENS_VIEW.PROVIDE_SOURCE_ADDRESS')}} <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.SOURCE_ADDRESS')"/></div>
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE && sourceAddress != undefined">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else-if="transactionContextStore.paymentCurrency==Currency.STABLE"><Button @click="provideSourceAddress" class="p-button p-component secondary-link button-w7">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button></div>
      </div>
      <div style="display: flex">
        <Button class="p-button p-component cancel" @click="transactionContextStore.orderModalVisible=false">{{$t('BUTTONS.CANCEL_ORDER')}}</Button>
        <Button class="p-button p-component secondary" :disabled="!canConfirmOrder" @click="onConfirm">{{$t('BUTTONS.CONFIRM_ORDER')}}</Button>
      </div>
    </div>
  </Dialog>
  <ApprovalModal @close="hideApprovalModal" @submit="hideApprovalModal" v-if="showApprovalModal"/>
  <ProvideAddresInfoModal :address-type="showAddressInfoModalAddressType" :address="addressToConnect" :display="showAddressInfoModal" @confirm="addressConfirmed" @close="closeProvideAddressModalClose"/>
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
import PayModal from "@/components/buyTokens/PayModal.vue";
import Dialog from "primevue/dialog";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {useRouter} from "vue-router";
import {Currency} from "@/models/currency";
import {useToast} from "vue-toastification";
import IconComponent from "@/components/features/IconComponent.vue";
import TooltipComponent from "@/components/TooltipComponent.vue";
import ApprovalModal from "@/components/buyTokens/modals/ApprovalModal.vue";
import {useI18n} from "vue-i18n";
import {ethereum} from "@cosmostation/extension-client";
import ProvideAddresInfoModal from "@/components/buyTokens/modals/ProvideAddresInfoModal.vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useUserStore} from "@/store/user.store";
import {useContextStore} from "@/store/context.store";
import {SignParingAddressResult} from "@/models/user/emailPairing";
import BuyTokensModal from "@/components/buyTokens/modals/BuyTokensModal.vue";
import dataService from "@/services/data.service";
import Button from "primevue/button";
import SynapsVerify from '@synaps-io/vue3-verify';
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";

onBeforeMount(() => {

  publicSaleStore.fetchTokenReservations();
});
const router = useRouter();
const toast = useToast();
const publicSaleStore = usePublicSalesStore();
const transactionContextStore = useTransactionContextStore();
const publicSalesStore = usePublicSalesStore();

const i18n = useI18n();
const showAddressInfoModal = ref(false);
const showAddressInfoModalAddressType = ref(AddressType.KEPLR);
const addressToConnect = ref();
const kycModalVisible = ref(false);
const loginPopupStatus = ref(false);

const showApprovalModal = ref(false);
const isLoggedIn = computed(() =>{
  return useUserStore().isLoggedIn;
});
function hideApprovalModal(){
  showApprovalModal.value = false;
}
function showApprovalModalFunc(){
  showApprovalModal.value = true;
}

const claimerAddress = computed(() => {
  return useUserServiceStore().claimAddress;
});
const sourceAddress = computed(() => {
  return useUserServiceStore().ethereumAddress;
});

const isTermsAccepted = computed(() =>{
  return useUserServiceStore().isTermsAccepted;
});

const isKycLevelRequired = computed(() => {
  return useUserServiceStore().kycLevel >= transactionContextStore.getRequiredKycLevel;
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

const onConfirm = () => {
  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    transactionContextStore.orderModalVisible = true;
    publicSaleStore.reserveTokens(Number(transactionContextStore.getAmountToBuyUc4e), onSuccess, onFail);
  }
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
const onSuccess = (orderId: number) => {
  transactionContextStore.setOrderId(orderId);
  transactionContextStore.orderModalVisible = false;
  usePublicSalesStore().fetchTokenReservations();
  toast.success('Tokens reserved successfully');
  if(transactionContextStore.paymentCurrency != Currency.STABLE) {
    router.push({name: 'fiatPaymentConfirmation'});
  } else {
    router.push({name: 'paymentConfirmation'});
  }
};

const onFail = (errorMessage?: string) => {
  let toastMessage = 'An error occurred \n';
  if (errorMessage) toastMessage+=errorMessage;
  toast.error(toastMessage);
};

const onKycStart = () => {
  useUserServiceStore().initKycSession(true).then(() => {
    kycModalVisible.value = true;
   // router.push({name: 'kyc'});
  });

};
const usersWallet = computed(() => {
  return useUserStore().getAccount.address;
});
function provideClaimerAddress(){
  showAddressInfoModalAddressType.value = AddressType.KEPLR;
  addressToConnect.value = useUserStore().getAccount.address;
  showAddressInfoModal.value = true;
}
function provideSourceAddress(){
  showAddressInfoModalAddressType.value = AddressType.METAMASK;
  useUserStore().connectMetamask().then(async (address) => {
    if (address) {
      addressToConnect.value = address;
    }
  });
  showAddressInfoModal.value = true;
}
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
    useUserServiceStore().initEmailMetamaskPairing(addressToConnect.value, onSuccessConnect, onFail);
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

const canConfirmOrder = computed(() => {
  const isSourceAddressRequired = transactionContextStore.paymentCurrency == Currency.STABLE;
  if(isSourceAddressRequired) {
    return isKycLevelRequired.value && isTermsAccepted.value && claimerAddress.value != undefined && sourceAddress.value != undefined;
  }
  return isKycLevelRequired.value && isTermsAccepted.value && claimerAddress.value != undefined;
});

</script>

<style scoped lang="scss">
.info{
  padding: 25px 54px;
  &__details{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 36px;
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
  }
  &__links{
    display: inline-flex;
    width: 100%;
    justify-content: flex-end;
    span {
      padding: 10px 20px;
      font-family: Poppins, sans-serif;
      font-size: 18px;
    }
  }
}
.requirements_container {
  padding: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;

  font-size: 18px;
  div {
    height: 60px;
    display: flex;
    align-items: center;
  }
  div:nth-child(even) {
    justify-content: center;
  }

}
:deep(.p-dropdown .p-dropdown-label) {
  font-size: 18px;
  font-weight: bold;
}
:deep(.p-dropdown .p-dropdown-trigger){
  display: none !important;
}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
.button {
  &-w7{
    width: 80%;
  }

}
</style>
