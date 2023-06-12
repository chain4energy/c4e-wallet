<template>
  <div class="info">
    <PublicSaleInfo />
    <div class="info__details">
      <h2>Chain4Energy token sale</h2>
      <p>Natenczas Wojski chwycił na taśmie przypięty Swój róg bawoli, długi, cętkowany,<br>
        kręty Jak wąż boa, oburącz do ust go przycisnął, Wzdął policzki jak banię, w oczach krwią zabłysnął,<br>
        Zasunął wpół powieki, wciągnął w głąb pół brzucha I do płuc wysłał z niego cały zapas ducha.<br>
        I zagrał: róg jak wicher niewstrzymanym dechem Niesie w puszczę muzykę i podwaja echem.<br>
        Umilkli strzelce, stali szczwacze zadziwieni Mocą, czystością, dziwną harmoniją pieni.<br>
        Starzec cały kunszt, którym niegdyś w lasach słynął, Jeszcze raz przed uszami myśliwców rozwinął;<br>
        Napełnił wnet, ożywił knieje i dąbrowy, Jakby psiarnię w nie wpuścił i rozpoczął łowy.<br>
        Bo w graniu była łowów historyja krótka: Zrazu odzew dźwięczący, rześki - to pobudka;<br>
        Potem jęki po jękach skomlą - to psów granie; A gdzieniegdzie ton twardszy jak grzmot - to strzelanie.<br>
        Tu przerwał, lecz róg trzymał; wszystkim się zdawało, Że Wojski wciąż gra jeszcze, a to echo grało.</p>
    </div>
    <InvestmentCalculator @onBuy="onBuyClick" />
    <div v-for="items in transactions" :key="items" class="userProfile__holder">
      <AllocationInfo :transaction="items" @pay="onPay(items)"/>
    </div>
  </div>
  <PayModal v-model:display="showModal" v-model:reservation="selectedReservation" @close="showModal = false" />

  <Dialog v-model:visible="summaryVisible" closeIcon="false" modal header="Order summary" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px'}">
    <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
      <h5 style="font-weight:700">You want to invest {{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</h5>
      <div class="requirements_container">
        <div>
          Pass KYC - Level {{transactionContextStore.getRequiredKycLevel}}
          <TooltipComponent style="margin-left:10px" tooltip-text="Some information related to KYC"/>
        </div>
        <div v-if="isKycLevelRequired">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else><Button class="p-button p-component secondary">Start KYC</Button></div>
        <div>Accept sale terms <TooltipComponent style="margin-left:10px" tooltip-text="Some information related to KYC"/></div>
        <div v-if="isTermsAccepted">
          <IconComponent style="color: #72bf44; height: 35px; width: 35px" name="Check" />
        </div>
        <div v-else ><Button class="p-button p-component secondary">Accept</Button></div>
        <div>Provide claimer address <TooltipComponent style="margin-left:10px" tooltip-text="Some information related to KYC"/></div>
        <div><Button class="p-button p-component secondary">Provide address</Button></div>
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE">Provide source address <TooltipComponent style="margin-left:10px" tooltip-text="Some information related to KYC"/></div>
        <div v-if="transactionContextStore.paymentCurrency==Currency.STABLE"><Button class="p-button p-component secondary">Provide address</Button></div>
      </div>
      <div style="display: flex">
        <Button class="p-button p-component secondary" @click="summaryVisible=false">Cancel order</Button>
        <Button class="p-button p-component secondary" @click="onConfirm">Confirm order</Button>
      </div>
    </div>
  </Dialog>
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

onBeforeMount(() => {

  publicSaleStore.fetchTokenReservations();
});
const router = useRouter();
const toast = useToast();
const publicSaleStore = usePublicSalesStore();
const transactionContextStore = useTransactionContextStore();
const publicSalesStore = usePublicSalesStore();
const summaryVisible = ref(false);
publicSalesStore.setParts();
publicSalesStore.setTotal();
publicSalesStore.setCurrentPrice();

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


const onPay = (transaction: TokenReservation) => {
  selectedReservation.value = transaction;
  showModal.value = true;
};
const onBuyClick = () => {
  summaryVisible.value = true;
};

const onConfirm = () => {
  if(useUserServiceStore().loginType == LoginTypeEnum.NONE) {
    router.push({name: 'signIn'});
  } else {
    summaryVisible.value = false;
    publicSaleStore.reserveTokens(Number(transactionContextStore.amountToBuy), onSuccess, onFail);
  }
};

const onSuccess = (orderId: number) => {
  transactionContextStore.setOrderId(orderId);
  usePublicSalesStore().fetchTokenReservations();
  toast.success('Tokens reserved successfully');
  if(transactionContextStore.paymentCurrency != Currency.STABLE) {
    router.push({name: 'fiatPaymentConfirmation'});
  } else {
    router.push({name: 'paymentConfirmation'});
  }
};

const onFail = () => {
  toast.error('An error occured');
};
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
</style>
