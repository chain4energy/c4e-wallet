<template>
<div>
  <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;">
    <div v-if="isCrypto()">
      Network:
      <Dropdown  v-model="selectedBlockchainNetwork" :options="blockchainNetworkList" optionLabel="networkName" @change="onNetworkChange"  placeholder="Select network" class="w-full md:w-14rem">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.networkName }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
        </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.networkName }}</div>
          </div>
        </template>
      </Dropdown>
    </div>
    <div>
      Amount: {{transactionContextStore.amountToBuy}} {{Currency.C4E}}
    </div>
    <div>
      Price: {{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}
    </div>
    <div style="display: flex">
      <Button class="p-button p-component secondary" >Cancel</Button>
      <Button class="p-button p-component secondary" @click="onBuy">Confirm</Button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">

import {useTransactionContextStore} from "@/store/transactionContext.store";
import Dropdown from "primevue/dropdown";
import {Currency} from "../../models/currency";
import {onBeforeMount, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useToast} from "vue-toastification";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {ethers} from "ethers";


onBeforeMount(async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const {chainId} = await provider.getNetwork();
  changeNetwork(chainId);
});

const transactionContextStore = useTransactionContextStore();
const publicSaleStore = usePublicSalesStore();

const blockchainNetworkList = ref([
  {
    networkName: 'Sepolia',
    chainId: 11155111,
    currencies: [Currency.USDC, Currency.USDT]
  },
  {
    networkName: 'BSC testnet',
    chainId: 97,
    currencies: [Currency.USDC, Currency.USDT]
  },
  {
    networkName: 'Polygon testnet',
    chainId: 80001,
    currencies: [Currency.USDC, Currency.USDT]
  }
]);
const selectedBlockchainNetwork = ref();
const onNetworkChange = (event: any) => {
  useUserServiceStore().switchBlockchain(event.value.chainId);
};

const toast = useToast();

const onBuy = () => {
  publicSaleStore.reserveTokens(Number(transactionContextStore.amountToBuy), onSuccess, onFail);
};
const onSuccess = (orderId: number) => {
  usePublicSalesStore().fetchTokenReservations();
  toast.success('Tokens reserved successfully');
  onPay(orderId);
};
const onFail = () => {
  toast.error('An error occured');
};
const getBlockchainAddress = (): string => {
  if(transactionContextStore.paymentCurrency == Currency.USDC) {
    return '0xda2011e914b986a68a2cf56ff11fca787cd6197e';
  } else  if(transactionContextStore.paymentCurrency == Currency.USDT) {
    return '0x1fba0140aaaca3b58adf781999570942b8f6beb1';
  }
  return '';
};
const onPay = (orderId: number) => {
  if(isCrypto()) {
    useUserServiceStore().sendMetamaskTransaction(transactionContextStore.amountToPay.toString(), getBlockchainAddress(), 6);
  } else if(transactionContextStore.paymentCurrency){
    usePublicSalesStore().initPaymentSession({orderId: orderId, offeredCurrencyCode: transactionContextStore.paymentCurrency, offeredAmount: Number((Math.round(transactionContextStore.amountToPay * 100) / 100).toFixed(2))})
      .then(transactionId => {
        if(transactionId) {
          window.dispatchEvent(
            new CustomEvent('ari10-widget-start-commodities-payment-request', {
              detail: {
                transactionId: transactionId,
              }
            })
          );
        }
      });
  }
};
const changeNetwork = (networkId: number) => {
  blockchainNetworkList.value.forEach((network) => {
    if(network.chainId == networkId) {
      selectedBlockchainNetwork.value = network;
    }
  });
};
window.addEventListener("load", function() {
  if (window.ethereum) {

    window.ethereum.enable();

    window.ethereum.on('networkChanged', function(networkId: number){
      changeNetwork(networkId);
    });
  }
});

const isCrypto = () => {
  return transactionContextStore.paymentCurrency == Currency.USDC || transactionContextStore.paymentCurrency == Currency.USDT;

};
</script>


<style scoped lang="scss">

</style>
