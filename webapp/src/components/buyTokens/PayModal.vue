<template>
  <Dialog v-model:visible="show" @update:visible="close" modal header="Payment" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px' }">
    <div class="step_1" v-if="step == 1">
      <div class="pay_modal_container">
        <div class="box" @click="step=2">ARI10</div>
        <div class="box" v-if="useUserServiceStore().loginType == LoginTypeEnum.METAMASK" @click="step=3">Tx-hash</div>
      </div>
    </div>
    <div v-if="step==2">
      <PaymentCalculator :is-fiat="true" :default-currency="Currency.USD" :currency-list="fiatCurrencyList" :reservation="reservation" @update:amount-two="calculatedAmount = $event" @update:currency-two="selectedCurrency = $event" />
    </div>
    <div v-if="step == 3">
      Network:
      <Dropdown v-model="selectedBlockchainNetwork" :options="blockchainNetworkList" optionLabel="networkName" @change="onNetworkChange" placeholder="Select network"  class="w-full md:w-14rem">
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
      <div v-if="selectedBlockchainNetwork">
        <PaymentCalculator :is-fiat="false" :default-currency="Currency.USDT" :currency-list="selectedBlockchainNetwork.currencies" :reservation="reservation" @update:amount-two="calculatedAmount = $event" @update:currency-two="selectedCurrency = $event" />
      </div>
    </div>
    <div class="buttons">
      <Button class="p-button p-component secondary" v-if="step > 1" @click="back">Back</Button>
      <Button class="p-button p-component secondary" v-if="step > 1" @click="onPay">pay</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">

import Dialog from "primevue/dialog";
import {ref, watch} from "vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";
import {Currency} from "@/models/currency";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import Dropdown from "primevue/dropdown";
import PaymentCalculator from "@/components/buyTokens/PaymentCalculator.vue";
import {ethers} from "ethers";

const props = defineProps<{
  display: boolean,
  reservation: TokenReservation
}>();

const emit = defineEmits(['close']);
const step = ref(1);

const fiatCurrencyList = [Currency.USD, Currency.EUR];
const selectedCurrency = ref();
const calculatedAmount = ref();


window.addEventListener("load", function() {
  if (window.ethereum) {

    window.ethereum.enable();

    window.ethereum.on('networkChanged', function(networkId: number){
      console.log('networkChanged',networkId);
      blockchainNetworkList.value.forEach((network) => {
        if(network.chainId == networkId) {
          selectedBlockchainNetwork.value = network;
        }
      });
    });
  }
});

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


const show = ref(false);
watch(() => props.display, (newVal, _) => {
  show.value = newVal;
});

const rate = ref(1);
const close = () => {
  step.value = 1;
  emit('close');
};
const back = () => {
  step.value = 1;
};
const onPay = () => {
  if(step.value==2) {
    usePublicSalesStore().initPaymentSession({orderId: props.reservation.orderId, offeredCurrencyCode: selectedCurrency.value, offeredAmount: Number((Math.round(calculatedAmount.value * 100) / 100).toFixed(2))})
      .then(transactionId => {
        if(transactionId) {
          window.dispatchEvent(
            new CustomEvent('ari10-widget-start-commodities-payment-request', {
              detail: {
                transactionId: transactionId,
              }
            })
          );
          close();
        }
      });
  } else if(step.value==3) {
    usePublicSalesStore().sendMetamaskTransaction(calculatedAmount.value.toString(), getBlockchainAddress(), 6);
  }

};
const getBlockchainAddress = (): string => {
  if(selectedCurrency.value == Currency.USDC) {
    return '0xda2011e914b986a68a2cf56ff11fca787cd6197e';
  } else  if(selectedCurrency.value == Currency.USDT) {
    return '0x1fba0140aaaca3b58adf781999570942b8f6beb1';
  }
  return '';
};
const onNetworkChange = (event: any) => {
  useUserServiceStore().switchBlockchain(event.value.chainId);
};
// const calculate = () => {
//   const requestedAmount = 100;
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json", "Ari10-Widget-Id": "41875703-9ee2-4729-9d51-e574c61467c3" },
//     body: JSON.stringify({"offeredCurrencyCode": currency_two.value, "offeredAmount": requestedAmount })
//   };
//   fetch("https://xqkzzpmim7.eu-west-1.awsapprunner.com/currencies/USDT/calculate", requestOptions)
//     .then(response => response.json())
//     .then(data => {
//       const c4eTOUSDT = usePublicSalesStore().getC4eToUSDC;
//       if(c4eTOUSDT != undefined) {
//         rate.value = c4eTOUSDT * requestedAmount / data.amount;
//       }
//     });
// };

</script>

<style scoped lang="scss">

.pay_modal_container {
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #72bf44;
    border-radius: 10px;
    margin: 20px;
    width: 50%;
    height: 100px;
    &:hover {
      cursor: pointer;
    }
  }
}
.buttons {
  display: flex;
  justify-content: center;
}



</style>

