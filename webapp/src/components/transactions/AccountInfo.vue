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
          <TooltipComponent style="margin-left:10px; z-index:50;" :tooltip-text="'aaa'"/>
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
            <p>{{$t('PROFILE_VIEW.KYC_LEVEL')}}</p>
            <TooltipComponent style="margin-left:10px; z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.KYC')"/>
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
            <p>{{$t('PROFILE_VIEW.TERMS_ACCEPTANCE')}}</p>
            <TooltipComponent style="margin-left:10px; z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.TERMS')"/>
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
            <p>{{$t('PROFILE_VIEW.CLAIMER_ADDRESS')}}</p>
            <TooltipComponent style="margin-left:10px; z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.CLAIMER_ADDRESS')"/>
          </div>
          <p v-if="claimAddress" class="accountInfo__headTxt">{{ claimAddress }}</p>
          <p v-else class="accountInfo__headTxt invalid">{{$t('PROFILE_VIEW.NO_ADDRESS_PROVIDED')}}</p>
        </div>
        <div>
          <Button
            @click="dataService.onKeplrLogIn()"
            v-if="!isLoggedIn && claimAddress == undefined"
            class="p-button p-component secondary">
            {{ $t('AIRDROP.CONNECT') }}
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
            <p>{{$t('PROFILE_VIEW.SOURCE_ADDRESS')}}</p>
            <TooltipComponent style="margin-left:10px; z-index:50;" :tooltip-text="i18n.t('TOOLTIPS.HINTS.SOURCE_ADDRESS')"/>
          </div>
          <p v-if="sourceAddress" class="accountInfo__headTxt">{{ sourceAddress }}</p>
          <p v-else class="accountInfo__headTxt invalid">{{$t('PROFILE_VIEW.NO_ADDRESS_PROVIDED')}}</p>
        </div>
        <div>
          <Button
            :disabled="!isLogedInInService || sourceAddress != undefined"
            class="p-button p-component secondary accountInfo__btn"
            @click="provideSourceAddress">{{$t('BUTTONS.PROVIDE_ADDRESS')}}</Button>
        </div>
      </div>
    </div>

  </div>
  <ProvideAddresInfoModal :address-type="showAddressInfoModalAddressType" :address="addressToConnect" :display="showAddressInfoModal" @confirm="addressConfirmed" @close="closeProvideAddressModalClose"/>
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
import {SignParingAddressResult} from "@/models/user/emailPairing";
import {logger} from "ethers";
import {useContextStore} from "@/store/context.store";
import TooltipComponent from "@/components/TooltipComponent.vue";
import dataService from "@/services/data.service";
import Button from "primevue/button";

const emit = defineEmits(['openModal', 'openApproval']);

const props = defineProps<{
  accordion: boolean
}>();

const toast = useToast();

const isLoggedIn = computed(() =>{
  return useUserStore().isLoggedIn;
});

const isLogedInInService = computed(() => {
  return useUserServiceStore().isLoggedIn();
});

const isTermsAccepted = computed(() =>{
  return useUserServiceStore().isTermsAccepted;
});

const paired = computed(() => {
  return useUserServiceStore().isPaired;
})

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

function provideClaimerAddress(){
  showAddressInfoModalAddressType.value = AddressType.KEPLR;
  addressToConnect.value = useUserStore().getAccount.address;
  showAddressInfoModal.value = true;
}

function closeProvideAddressModalClose(){
  showAddressInfoModal.value = false;
}
const addressToConnect = ref();
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
    if (usersWallet.value) {
      useUserServiceStore().initEmailKeplrPairing(addressToConnect.value, onSuccessConnect, onFail);
    } else {
      toast.error('You have to be logged in with Email');
    }
  }
  if(showAddressInfoModalAddressType.value == AddressType.METAMASK && addressToConnect.value) {
    console.log('Connect metamask account');

    useUserServiceStore().initEmailMetamaskPairing(addressToConnect.value, onSuccessConnect, onFail);
  }
}
const onSuccessConnect = () => {
  useContextStore().addressType = showAddressInfoModalAddressType.value;
  router.push({name: 'provideVerificationCode'});
};

function onSuccessAddressPairing(result: SignParingAddressResult){
  console.log("!!!" + result);
  router.push({name:'provideVerificationCode'});
}

function onFail(){
  toast.error("error");
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
    font-size: 24px;
    line-height: 28px;
    color: black;
    display: inline-flex;
  }
  &__headTxt{
    font-family: 'Work Sans',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 19px;
    line-height: 22px;
    color: #858585;
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
</style>
