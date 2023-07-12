<template>

  <div class="portfolioSummary">

    <div class="mobile-hidden">
      <C4EIcon size="100" icon="c4e-green"/>
    </div>
    <div class="portfolioSummary__tile" >
      <h3>{{$t("PORTFOLIO_VIEW.BALANCE")}}</h3>
      <h4>
        <CoinAmount :key="totalBalance" :amount="convertAmount(totalBalance)" :precision="2" :show-tooltip="true" :reduce-big-number="true" :show-denom="true"/>
      </h4>
      <!-- <h5>$<FormattedNumber :amount="amountToUSD(totalBalance)" :precision="2"/></h5> -->
    </div>
    <div class="portfolioSummary__tile" v-if="totalBalance !== spendableBalance">
      <h3>{{$t("PORTFOLIO_VIEW.SPENDABLE")}}</h3>
      <h4>
        <CoinAmount :key="spendableBalance" :amount="convertAmount(spendableBalance)" :precision="2" :show-tooltip="true" :reduce-big-number="true" :show-denom="true"/>
      </h4>
      <!-- <h5>$<FormattedNumber :amount="amountToUSD(spendableBalance)" :precision="2"/></h5> -->
    </div>

    <div class="portfolioSummary__buttons">
      <Button class="secondary portfolioSummary__button"
              @click.prevent="() => receiveDialogVisible = true"
              :disabled = '!userStore.getAccount.address'
      >
        {{$t("PORTFOLIO_VIEW.RECEIVE")}}
      </Button>
      <Button class="secondary portfolioSummary__button"
              :disabled = '!userStore.getAccount.address'>
        {{$t("PORTFOLIO_VIEW.SEND")}}
      </Button>
    </div>

  </div>

  <Dialog v-model:visible="receiveDialogVisible" modal :header='$t("PORTFOLIO_VIEW.RECEIVE")' :style="{ width: '95vw', 'max-width': '600px' }">
    <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;">
      <h3>{{$t("PORTFOLIO_VIEW.ADDRESS")}}</h3>
      <div style="display: inline-flex; align-items: center; justify-content:center; flex-wrap: wrap; padding: 10px 0;">
        <p style="margin: 20px 10px;"> {{userStore.getAccount.address}}</p>
        <Copy @click="copyTxt" class="copy_button"/>
      </div>
      <QrcodeVue :value="userStore.getAccount.address" size="200" :render-as="'svg'"></QrcodeVue>
    </div>
  </Dialog>

</template>

<script setup lang="ts">
import C4EIcon from "@/components/commons/C4EIcon.vue";
import {useUserStore} from "@/store/user.store";
import {computed, onMounted, onUnmounted, ref} from "vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {BigDecimal} from "@/models/store/big.decimal";
import {BigIntWrapper, Coin, DecCoin} from "@/models/store/common";
import Dialog from "primevue/dialog";
import QrcodeVue from "qrcode.vue";
import {useToast} from "vue-toastification";
import i18n from "@/plugins/i18n";
import { Copy } from 'lucide-vue-next';
import dataService from "@/services/data.service";
// import FormattedNumber from "@/components/commons/FormattedNumber.vue"; - future USD ratio

const userStore = useUserStore();

onMounted(() => {
    dataService.onPortfolioSelected();
});

onUnmounted(() => {
  dataService.onPortfolioUnselected();
});

const totalBalance = computed(()=> {
  return userStore.getBalance;
});

const spendableBalance = computed(()=> {
  if (!userStore.getAccount.address) return 0n;
  return userStore.getSpendableBalance || 0n;
});

/*
Conversion to USD - change ratio return value to actual conversion ratio

const ratio = computed(()=> {
  return .....;
});

const amountToUSD = (amount: bigint) => {
  let converted = Number(String(amount)) / 1000000;
  if (ratio.value)
    return converted * ratio.value;
  else
    return converted * 0.085;
};

 */

function convertAmount( amount: bigint | number | BigDecimal | Coin | DecCoin){
  if( typeof amount === 'bigint'){
    return new BigIntWrapper(amount);
  } else {
    return amount;
  }
}

function copyTxt(){
  navigator.clipboard.writeText(userStore.getAccount.address);
  useToast().success(i18n.global.t('COPY.ADDRESS'));
}

const receiveDialogVisible = ref(false);
</script>

<style scoped lang="scss">

.portfolioSummary {
  width: 75%;
  display: inline-flex;
  flex-wrap: wrap;
  // grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  //gap: 24px;
  background: #0F3153;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;
  justify-content: space-around;

  div {
    flex: 1 1 20%;
    min-width: 200px;
  }
  h3 {
    padding: 10px 10px;
    font-size: 1.5rem;
  }
  h4 {
    padding: 10px;
    font-weight: 800;
    font-size: 1.5rem;
  }
  &__buttons {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  &__button {
    width: 80%;
    border-radius: 5px !important;
  }
  &__tile {
    padding: 10px 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter',sans-serif;
    color: white;
    background: #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
    height: 100%;
    margin: 10px 12px;
  }
}

.copy_button {
  transition: color 0.2s linear;
}

.copy_button:hover {
  cursor: pointer;
  color: #8be955;
}

@media screen and (width<1024px) {
  .portfolioSummary {
    width: 95%;
  }
}

@media screen and (width<1150px) {
  .mobile-hidden {
    display: none;
  }
}
</style>
