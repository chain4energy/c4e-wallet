<template>
  <div class="confirm_container">
    <div class="confirm_container__header">
      <h2>Confirm your payment</h2>
    </div>
    <div class="confirm_container__body">
      <span>Your order no. {{transactionContextStore.orderId}} has been placed successfully</span><br />
      <span>Please send <span style="font-weight: bold">{{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</span> to the address below or play by Metamask</span>
      <Button class="secondary" @click="paymentModalVisible = true">Pay by Metamask</Button>
      <div class="address">
        <div style="margin-bottom:20px">{{address}} <Icon class="address__copy" name="Copy" /> <br /></div>

        <QrcodeVue :value="address" size="200" :render-as="'svg'"></QrcodeVue>
      </div>
      <span>The payment must be done from Metamask address (source address):</span>
      <div class="address">
        {{address}}
      </div>
      <div>
        <span>After completing the transaction, please enter txhash below.</span>
        <Form @submit="onConfirmPayment" :validation-schema="schema" v-slot="{errors}" >
          <div style="padding: 10px 30px;">
            <div >
              <div class="field col-12">
                <Field style="width:100%" v-model="txHash" placeholder="TxHash" name="txHash" type="text" class="form-control"
                       :class="{'is-invalid': errors.txHash}"></Field>
                <div class="invalid-feedback">{{ errors.txHash ? $t(errors.txHash) : '' }}</div>
              </div>
              <div class="field col-12">
                <Field v-model="selectedBlockchainNetworkId" required name="selectedBlockchainNetwork" as="select" class="form-control"
                       :class="{'is-invalid': errors.selectedBlockchainNetwork}" >
                  <option v-for="network in blockchainNetworkList" :key="network.id" :value="network.chainId">{{network.chainName}}</option>
                </Field>
                <span>Network</span>
                <div class="invalid-feedback">{{ errors.selectedBlockchainNetwork ? $t(errors.selectedBlockchainNetwork) : '' }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-content-center">

            <Button class="p-button p-component secondary"  type="submit" >CONFIRM PAYMENT</Button>
          </div>

        </Form>
      </div>
    </div>

    <Dialog v-model:visible="paymentModalVisible" modal header="Order summary" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px'}">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
        <div class="requirements_container">
          <div>Amount</div>
          <div>{{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</div>
          <div>Source address</div>
          <div>0x9176238712hdasjhdkahdskj</div>
          <div>Destination address</div>
          <div>0x9176238712hdasjhdkahdskj</div>

        </div>
        <Form @submit="onStartMetamaskTransaction" :validation-schema="modalSchema" v-slot="{errors}" >
          <div style="padding: 10px 30px;">
            <div >
              <div class="field col-12">
                <Field v-model="selectedBlockchainNetworkId" required name="selectedBlockchainNetwork" as="select" class="form-control"
                       :class="{'is-invalid': errors.selectedBlockchainNetwork}" @change="onNetworkChange">
                  <option v-for="network in blockchainNetworkList" :key="network" :value="network.chainId">{{network.chainName}}</option>
                </Field>
                <span>Network</span>
                <div class="invalid-feedback">{{ errors.selectedBlockchainNetwork ? $t(errors.selectedBlockchainNetwork) : '' }}</div>
              </div>

              <div class="field col-12">
                <Field v-model="selectedTokenIdentifier" required name="selectedTokenIdentifier" as="select" class="form-control"
                       :class="{'is-invalid': errors.selectedTokenIdentifier}">
                     <option v-for="token in selectedBlockchainTokens" :key="token" :value="token.coinIdentifier">{{token.name}}</option>
                </Field>
                <span>Token</span>
                <div class="invalid-feedback">{{ errors.selectedBlockchainNetwork ? $t(errors.selectedBlockchainNetwork) : '' }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-content-center">
            <Button class="p-button p-component secondary" @click="paymentModalVisible=false">Close</Button>
            <Button class="p-button p-component secondary" style="white-space: nowrap;"  type="submit" >Start MetaMask transaction</Button>
          </div>

        </Form>
      </div>

    </Dialog>
  </div>
</template>

<script setup lang="ts">

import {useTransactionContextStore} from "@/store/transactionContext.store";
import Dropdown from "primevue/dropdown";
import {Currency} from "../../models/currency";
import {computed, onBeforeMount, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useToast} from "vue-toastification";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {ethers} from "ethers";
import {useRouter} from "vue-router";
import Icon from "@/components/features/IconComponent.vue";
import QrcodeVue from 'qrcode.vue'
import Password from "primevue/password";
import {Field, Form} from "vee-validate";
import Checkbox from "primevue/checkbox";
import {object} from "yup";
import * as Yup from "yup";
import Dialog from "primevue/dialog";
import {BlockchainInfo} from "@/models/saleServiceCommons";

onBeforeMount(async () => {

  await publicSaleStore.fetchBlockchainInfo(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const {chainId} = await provider.getNetwork();
  changeNetwork(chainId);
});

const address = ref('0xAxerwerwerwerwerwerwerwerwerwerwerr');
const transactionContextStore = useTransactionContextStore();
const router = useRouter();
const publicSaleStore = usePublicSalesStore();
const txHash = ref<string>();
const paymentModalVisible = ref(false);

const schema = object().shape({
  txHash:  Yup.string()
    .required( "This field is required"),

});

const modalSchema = object().shape({
  selectedBlockchainNetwork:  Yup.string()
    .required( "This field is required"),

});
const blockchainNetworkList = computed(() => {
  return publicSaleStore.blockchainInfo;
});

const selectedTokenIdentifier = ref();
const selectedBlockchainNetworkId = ref();
const selectedBlockchainTokens = computed(() => {
  return blockchainNetworkList.value.find(blockchain => {
    return blockchain.chainId == selectedBlockchainNetworkId.value;
  })?.availableTokens;
});
const selectedBlockchain = computed(() => {
  return blockchainNetworkList.value.find(blockchain => {
    return blockchain.chainId == selectedBlockchainNetworkId.value;
  });
});

const onNetworkChange = () => {
  useUserServiceStore().switchBlockchain(selectedBlockchainNetworkId.value);
};

const toast = useToast();


const onFail = () => {
  toast.error('An error occured');
};

const onStartMetamaskTransaction = () => {
  if(selectedBlockchain.value){
    useUserServiceStore().payByMetamask({
      amount: transactionContextStore.amountToPay.toString(),
      blockchainName: selectedBlockchain.value.chainName,
      orderId: transactionContextStore.orderId,
      blockchainAddress: selectedTokenIdentifier.value,
      coinDecimals: 6
    }, onSuccessStartMetamaskTransaction, onFail);
  }


};
const onSuccessStartMetamaskTransaction = () => {
  toast.success('Transaction complete');
};
const onPay = (orderId: number) => {
  if(isCrypto()) {
    useUserServiceStore().sendMetamaskTransaction(transactionContextStore.amountToPay.toString(),selectedTokenIdentifier.value, 6);
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
      selectedBlockchainNetworkId.value = network.chainId;
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

const onConfirmPayment = () => {
  console.log('confirm');
};
</script>


<style scoped lang="scss">
.confirm_container {
  color: black;
  padding: 20px 40px;
  text-align: left;
  font-size: 20px;
  &__header {
    margin-bottom: 40px;
  }
  &__body {
    .address {
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 30px;
      &__copy {
        cursor: pointer;
        width: 30px;
        height: 30px;
        &:hover {
          opacity: 0.7;
        }
      }
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

}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
