<template>
  <Dialog v-model:visible="transactionContextStore.orderModalVisible" closeIcon="false" modal :header="i18n.t('BUY_TOKENS_VIEW.ORDER_SUMMARY')" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '800px', 'z-index': 500}">
    <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
      <h5 style="font-weight:700">{{$t('BUY_TOKENS_VIEW.YOU_INVEST')}} {{transactionContextStore.amountToBuy.amount.toString()}} C4E</h5>
      <div class="requirements_container">
        <div>
          <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.KYC')">{{$t('BUY_TOKENS_VIEW.PASS_KYC')}} {{transactionContextStore.getRequiredKycLevel}}</TooltipComponent><br>
          <span class="additional_info">Level {{useUserServiceStore().kycLevel}} - verified</span> <br>
          <span v-if="!isKycLevelRequired" class="additional_info">Level {{transactionContextStore.getRequiredKycLevel}} - required</span>
        </div>
        <div v-if="isKycLevelRequired">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else>
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
          <Button @click="onKycStart" class="p-button p-component secondary-link button-w7">{{$t('BUTTONS.START_KYC')}} - level {{transactionContextStore.getRequiredKycLevel}}</Button>
        </div>
        <div>
          <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.TERMS')">{{$t('BUY_TOKENS_VIEW.ACCEPT_SALE_TERMS')}}</TooltipComponent> <br>
          <span v-if="isTermsAccepted" class="additional_info">Accepted</span>
          <span v-else class="additional_info">Not accepted</span>
        </div>
        <div v-if="isTermsAccepted">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else ><Button class="p-button p-component secondary-link button-w7" @click="showApprovalModalFunc">{{$t('BUTTONS.ACCEPT')}}</Button></div>
        <div>
          <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.CLAIMER_ADDRESS')" :text="i18n.t('BUY_TOKENS_VIEW.PROVIDE_CLAIMER_ADDRESS')" tooltip-link="https://docs.c4e.io/usersGuide/auth.html" /> <br>
          <span v-if="claimerAddress" class="additional_info">{{addDotsInsideTooLongString(claimerAddress, 28)}}</span>
          <span v-else class="additional_info">Not provided</span>
        </div>
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
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE">
          <TooltipComponent style="margin-left:10px" :tooltip-text="i18n.t('TOOLTIPS.HINTS.SOURCE_ADDRESS')">{{$t('BUY_TOKENS_VIEW.PROVIDE_SOURCE_ADDRESS')}}</TooltipComponent><br>
          <span v-if="sourceAddress" class="additional_info">{{addDotsInsideTooLongString(sourceAddress, 28)}}</span>
          <span v-else class="additional_info">Not provided</span>
        </div>
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE && sourceAddress != undefined">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else-if="transactionContextStore.paymentCurrency==Currency.STABLE && useUserStore().metamaskConnectionInfo.address != ''"><Button @click="provideSourceAddress" class="p-button p-component secondary-link button-w7">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button></div>
        <Button v-else-if="transactionContextStore.paymentCurrency==Currency.STABLE" class="p-button p-component secondary-link button-w7" @click="connectMetamask">Connect MetaMask</Button>

      </div>
      <div style="display: flex">
        <Button class="p-button p-component cancel" @click="transactionContextStore.orderModalVisible=false">{{$t('BUTTONS.CANCEL_ORDER')}}</Button>
        <Button class="p-button p-component secondary" :disabled="!canConfirmOrder" @click="onConfirm">{{$t('BUTTONS.CONFIRM_ORDER')}}</Button>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">

import {Currency} from "@/models/currency";
import {useUserStore} from "@/store/user.store";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {addDotsInsideTooLongString} from "@/utils/string-formatter";
import Dialog from "primevue/dialog";
import IconComponent from "@/components/features/IconComponent.vue";
import TooltipComponent from "@/components/TooltipComponent.vue";
import Button from "primevue/button";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {useTransactionContextStore} from "@/store/transactionContext.store";
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useConfigurationStore} from "@/store/configuration.store";

const router = useRouter();
const toast = useToast();
const publicSaleStore = usePublicSalesStore();
const transactionContextStore = useTransactionContextStore();

const i18n = useI18n();
const showAddressInfoModal = ref(false);
const showAddressInfoModalAddressType = ref(AddressType.KEPLR);

const kycModalVisible = ref(false);
const loginPopupStatus = ref(false);

const showApprovalModal = ref(false);
const connectMetamask = () => {
  useUserStore().connectMetamask();
};
const isLoggedIn = computed(() =>{
  return useUserStore().isLoggedIn;
});
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

const onConfirm = () => {
  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    transactionContextStore.orderModalVisible = true;
    publicSaleStore.reserveTokens(useConfigurationStore().config.currentPublicSaleRoundId,Number(transactionContextStore.getAmountToBuyUc4e), onSuccess, onFail);
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

function provideClaimerAddress(){
  showAddressInfoModalAddressType.value = AddressType.KEPLR;
  showAddressInfoModal.value = true;
}
function provideSourceAddress(){
  showAddressInfoModalAddressType.value = AddressType.METAMASK;
  useUserStore().connectMetamask();
  showAddressInfoModal.value = true;
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
  grid-gap: 10px;

  font-size: 18px;
  div {
    min-height: 60px;
    align-items: center;
  }
  .additional_info {
    color: #8c8c8c;
    padding-left:15px;
  }
  div:nth-child(even) {
    text-align: center;
  }

}
.button {
  &-w7{
    width: 90%;
  }

}
</style>
<style lang="scss" scoped>
.dropdown {
  border: 1px solid #81CF1F !important;
  border-left-width: 0 !important;
  border-radius: 0 8px 8px 0 !important;

}
:deep(.p-dropdown .p-dropdown-label) {
  font-size: 18px;
  font-weight: bold;
}
//:deep(.p-dropdown .p-dropdown-trigger){
//  display: none !important;
//}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
