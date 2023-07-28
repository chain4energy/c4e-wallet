<template>
  <div class="accountInfo">
    <div class="accountInfo__closedBar" v-if="!open && showClosedTab">
      <div class="accountInfo__closedItem">
        <div class="accountInfo__closedHeader">
          <div class="accountInfo__headMainTxt">{{$t('PROFILE_VIEW.YOUR_ACCOUNT')}}</div>
          <div class="accountInfo__headTxt" style="margin-left: 5px">{{$t('PROFILE_VIEW.TYPE')}}: {{getLoginType()}}</div>
        </div>
        <div class="accountInfo__headTxt">Email: {{useUserServiceStore().userEmail}}</div>
      </div>
      <div class="accountInfo__closedItem">
        <div class="accountInfo__closedHeader">
          <div class="accountInfo__headMainTxt">KYC level</div>
          <TooltipComponent style="z-index:50;" :tooltip-text="'aaa'"/>
        </div>
        <div class="accountInfo__headTxt">Level {{useUserServiceStore().getKycTier}}</div>
      </div>
      <div class="accountInfo__closedItem">
        <div class="accountInfo__closedHeader">
          <div class="accountInfo__headMainTxt">{{$t('PROFILE_VIEW.TERMS_ACCEPTANCE')}}</div>
        </div>
        <div class="accountInfo__headTxt">No</div>
      </div>
      <div class="accountInfo__closedItem">
        <div class="accountInfo__closedHeader">
          <div class="accountInfo__headMainTxt">{{$t('PROFILE_VIEW.CLAIMER_ADDRESS')}}</div>
        </div>
        <div v-if="address" class="accountInfo__headTxt">{{ address }}</div>
        <div v-else class="accountInfo__headTxt">{{$t('PROFILE_VIEW.NO_ADDRESS_PROVIDED')}}</div>
      </div>
      <div @click="open = !open" class="accountInfo__closedItem accountInfo__arrow">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 11.25L15 18.75L22.5 11.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div style="width: 100%; transition: .4s linear ;" v-if="open">
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div class="accountInfo__head">
          <p class="accountInfo__headMainTxt">{{$t('PROFILE_VIEW.YOUR_ACCOUNT')}}</p>
          <p class="accountInfo__headTxt">{{$t('PROFILE_VIEW.TYPE')}}: {{getLoginType()}}</p>
          <p class="accountInfo__headTxt">Email: {{useUserServiceStore().userEmail}}</p>
        </div>
        <div v-if="showClosedTab" @click="open = !open" class="accountInfo__closedItem accountInfo__arrow accountInfo__arrow-rotate" >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 11.25L15 18.75L22.5 11.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <hr class="accountInfo__line"/>
      <div class="accountInfo__body">
        <div class="accountInfo__head">
          <div class="accountInfo__headMainTxt">
            <p><TooltipComponent style=" z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.KYC')">{{$t('PROFILE_VIEW.KYC_LEVEL')}}</TooltipComponent></p>
          </div>
          <p class="accountInfo__headTxt">{{$t('PROFILE_VIEW.LEVEL')}} {{useUserServiceStore().getKycTier}}</p>
        </div>
        <div>
          <Button
            class="p-button p-component secondary accountInfo__btn"
            @click="onKycStart">{{$t('BUTTONS.START_KYC')}}</Button>
        </div>
      </div>
      <hr class="accountInfo__line"/>
      <div class="accountInfo__body">
        <div class="accountInfo__head">
          <div class="accountInfo__headMainTxt">
            <p><TooltipComponent style="z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.TERMS')">{{$t('PROFILE_VIEW.TERMS_ACCEPTANCE')}}</TooltipComponent></p>
          </div>
          <p class="accountInfo__headTxt" :class="{invalid: !isTermsAccepted }" >{{ isTermsAccepted ? $t('PROFILE_VIEW.ACCEPTED') : $t('PROFILE_VIEW.NOT_ACCEPTED') }}</p>
        </div>
        <div>
          <Button
            class="p-button p-component secondary accountInfo__btn"
            :disabled="isTermsAccepted"
            @click="$emit('openApproval')">{{$t('BUTTONS.ACCEPT')}}</Button>
        </div>
      </div>
      <hr class="accountInfo__line"/>
      <div class="accountInfo__body">
        <div class="accountInfo__head">
          <div class="accountInfo__headMainTxt">
            <p><TooltipComponent style=" z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.CLAIMER_ADDRESS')"  tooltip-link="https://docs.c4e.io/usersGuide/auth.html">{{$t('PROFILE_VIEW.CLAIMER_ADDRESS')}}</TooltipComponent></p>
          </div>
          <p style="white-space: nowrap" v-if="claimAddress" class="accountInfo__headTxt">{{ addDotsInsideTooLongString(claimAddress, 12) }}
            <IconComponent @click="onCopy(claimAddress)" name="Copy" class="copy" style="margin-left: 5px" />
          </p>
          <p v-else class="accountInfo__headTxt invalid">{{$t('PROFILE_VIEW.NO_ADDRESS_PROVIDED')}}</p>
        </div>
        <div>
          <Button
            v-if="!isLoggedIn && claimAddress == undefined"
            @click="loginPopupStatus=true"
                  class="p-button p-component secondary accountInfo__btn">
            {{ $t('COMMON.CONNECT') }}
          </Button>
          <Button
            v-else
            :disabled="!isLoggedIn || !isLogedInInService || claimAddress != undefined"
            class="p-button p-component secondary accountInfo__btn"
            @click="provideClaimerAddress">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button>
        </div>
      </div>
      <hr class="accountInfo__line"/>
      <div class="accountInfo__body">
        <div class="accountInfo__head">
          <div class="accountInfo__headMainTxt">
            <p><TooltipComponent style="z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.SOURCE_ADDRESS')">{{$t('PROFILE_VIEW.SOURCE_ADDRESS')}}</TooltipComponent></p>
          </div>
          <p style="white-space: nowrap" v-if="sourceAddress" class="accountInfo__headTxt">{{ addDotsInsideTooLongString(sourceAddress, 12) }}
            <IconComponent @click="onCopy(sourceAddress)" class="copy" name="Copy" style="margin-left: 5px" /></p>
          <p v-else class="accountInfo__headTxt invalid">{{$t('PROFILE_VIEW.NO_ADDRESS_PROVIDED')}}</p>
        </div>
        <div>
          <Button v-if="useUserStore().metamaskConnectionInfo.address == '' &&sourceAddress==undefined" class="p-button p-component secondary accountInfo__btn" @click="connectMetamask">Connect MetaMask</Button>
          <Button v-else
            :disabled="!isLogedInInService || sourceAddress != undefined"
            class="p-button p-component secondary accountInfo__btn"
            @click="provideSourceAddress">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button>
        </div>
      </div>
    </div>

  </div>
  <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>
  <ProvideAddresInfoModal :address-type="showAddressInfoModalAddressType" :address="showAddressInfoModalAddressType == AddressType.METAMASK ? useUserStore().metamaskConnectionInfo.address : c4eAddress" :display="showAddressInfoModal" @confirm="addressConfirmed" @close="closeProvideAddressModalClose"/>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import {useUserStore} from "@/store/user.store";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import ProvideAddresInfoModal from "@/components/buyTokens/modals/ProvideAddresInfoModal.vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useToast} from "vue-toastification";
import {useContextStore} from "@/store/context.store";
import TooltipComponent from "@/components/TooltipComponent.vue";
import Button from "primevue/button";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import {addDotsInsideTooLongString} from "../../utils/string-formatter";
import IconComponent from "@/components/features/IconComponent.vue";

const emit = defineEmits(['openModal', 'openApproval']);

const props = defineProps<{
  accordion: boolean
}>();

const toast = useToast();
const loginPopupStatus = ref(false);
const isLoggedIn = computed(() =>{
  return useUserStore().isLoggedIn;
});

const isLogedInInService = computed(() => {
  return useUserServiceStore().isLoggedIn;
});

const isTermsAccepted = computed(() =>{
  return useUserServiceStore().isTermsAccepted;
});

const usersWallet = computed(() => {
  return useUserStore().getAccount.address;
});

const router = useRouter();
const showClosedTab = ref(true);

onMounted(() => {
  if(!props.accordion){
    open.value = true;
    showClosedTab.value = false;
  }
});

const showAddressInfoModal = ref(false);
const showAddressInfoModalAddressType = ref(AddressType.KEPLR);
const connectMetamask = () => {
  useUserStore().connectMetamask();
};
function provideClaimerAddress(){
  showAddressInfoModalAddressType.value = AddressType.KEPLR;
  showAddressInfoModal.value = true;
}

function closeProvideAddressModalClose(){
  showAddressInfoModal.value = false;
}
function provideSourceAddress(){
  showAddressInfoModalAddressType.value = AddressType.METAMASK;
  useUserStore().connectMetamask();
  showAddressInfoModal.value = true;
}




const c4eAddress = computed(() => {
  return useUserStore().getAccount.address;
});

function addressConfirmed(){
  showAddressInfoModal.value = false;
  if(showAddressInfoModalAddressType.value == AddressType.KEPLR) {
    if (usersWallet.value) {
      useUserServiceStore().initEmailKeplrPairing(c4eAddress.value, onSuccessConnect, onFail);
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
  router.push({name: 'provideVerificationCode'});
};

function onFail(){
//
}

const open = ref(false);

const address = computed(() =>{
  return useUserStore().getAccount.address;
});

const sourceAddress = computed(() =>{
  return useUserServiceStore().ethereumAddress;
});

const claimAddress = computed(() =>{
  return useUserServiceStore().claimAddress;
});
const onKycStart = () => {
  useUserServiceStore().initKycSession(true).then(() => {
    router.push({name: 'kyc'});
  });

};
const i18n = useI18n();
const getLoginType = () => {
  const loginType = useUserServiceStore().getLoginType;
  if(loginType == LoginTypeEnum.EMAIL) {
    return i18n.t('ENUMS.LOGIN_TYPE.EMAIL');
  } else if(loginType == LoginTypeEnum.KEPLR) {
    return i18n.t('ENUMS.LOGIN_TYPE.KEPLR');
  } else if(loginType == LoginTypeEnum.METAMASK) {
    return i18n.t('ENUMS.LOGIN_TYPE.METAMASK');
  }
  return i18n.t('ENUMS.LOGIN_TYPE.NONE');
};

function onCopy(txt: string){
  navigator.clipboard.writeText(txt);
}
</script>

<style scoped lang="scss">
.accountInfo{
  display: flex;
  flex-direction: column;
  align-items: start;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 32px 33px 26px 116px;
  border-radius: 5px;
  @media (max-width: 1024px) {
    padding: 20px;
  }
  &__closedBar{
    transition: .4s linear ;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__closedItem{
    display: flex;
    flex-direction: column;
  }
  &__closedHeader{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__head{
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  &__headMainTxt{
    font-family: 'Work Sans',sans-serif;
    font-weight: 500;
    font-size: 1.2em;
    line-height: 28px;
    color: black;
    display: inline-flex;
    text-align: left;
    @media (max-width: 1024px) {
      font-size: 1.1em;
    }
    @media (max-width: 700px) {
      font-size: 1.05em;
    }
  }
  &__headTxt{
    font-family: 'Work Sans',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 1em;
    line-height: 22px;
    color: #858585;
    @media (max-width: 1024px) {
      font-size: 0.95em;
    }
    @media (max-width: 700px) {
      font-size: 0.85em;
    }
  }
  &__body{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
  }
  &__line{
    width: 100%;
    border: 1px solid #CECECE;
  }
  &__btn{
    border-radius: 24px;
    width: 161px;
    min-height: 40px;
    font-family: 'Work Sans',sans-serif;

    @media (max-width: 1024px) {
      width:120px;
    }

  }
  &__arrow{
    align-items: center;
    justify-content: center;
    &-rotate{
      transform: rotateX(180deg);
    }
  }
}

.invalid {
  color: red;
}
.copy:hover {
  cursor: pointer;
}
</style>
