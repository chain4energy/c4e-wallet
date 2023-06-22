<template>
  <div class="confirm_container">
    <div class="confirm_container__header">
      <h2>{{$t('PAYMENT_CONFIRMATION_VIEW.CONFIRM_PAYMENT')}}</h2>
    </div>
    <div class="confirm_container__body">
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.FIRST_LINE', {orderId: transactionContextStore.orderId})}}.</span><br />
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.SECOND_LINE')}}</span> <br />
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_1')}} <b>{{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</b> {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_2')}}</span> <br />
      <div style="text-align: center; margin:20px">
        <Button class="secondary" style="width: 40%; min-width:300px" @click="paymentModalVisible = true">
          <img style="height:30px;" src="@/assets/svg/MetaMaskIcon.svg">
          {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.PAY')}} {{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}} {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_2')}}</Button> <br />
        <span>or</span><br />
        <span @click="showManualPayment = true" class="underline open">Provide TxHash manually</span>
      </div>

      <div v-if="showManualPayment" class="box-shadow" style="padding: 20px; color: black">
        <div style="width: 100%">
          After completing the transaction, please enter the txHash below
          <span @click="showManualPayment = false" class="close">Hide <IconComponent name="X" /></span>
        </div>
        <div>
          <Form @submit="onConfirmPayment" :validation-schema="schema" v-slot="{errors}" >
            <div style="padding: 10px 30px;">
              <div >
                <div class="field col-12">
                  <Field v-model="selectedBlockchainNetworkId" required name="selectedBlockchainNetwork" as="select" class="form-control"
                         :class="{'is-invalid': errors.selectedBlockchainNetwork}" >
                    <option v-for="network in blockchainNetworkList" :key="network.id" :value="network.chainId">{{network.chainName}}</option>
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
                <div class="field col-12">
                  <Field style="width:100%" v-model="txHash" placeholder="TxHash" name="txHash" type="text" class="form-control"
                         :class="{'is-invalid': errors.txHash}"></Field>
                  <div class="invalid-feedback">{{ errors.txHash ? $t(errors.txHash) : '' }}</div>
                </div>
              </div>
            </div>
            <div v-if="selectedToken?.c4eAddress" style="display: flex">
              <div style="margin-right: 20px;">
                <span>The payment must be done from metamask address (source address)</span>
                <div class="address">
                  {{ sourceAddress }}
                </div>
                <span>Please send <b>{{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</b> to the address below:</span>
                <div class="address" style="margin-bottom:20px">{{selectedToken?.c4eAddress}} <Icon class="address__copy" name="Copy" /> <br /></div>

              </div>
              <div style="margin-left: auto; margin-right: 20px">
                <div style="margin-bottom: 10px">Recipient's address</div>
                <QrcodeVue :value="selectedToken?.c4eAddress" size="200" :render-as="'svg'"></QrcodeVue>
              </div>
            </div>
            <div class="flex justify-content-center">

              <Button class="p-button p-component secondary"  type="submit" >CONFIRM PAYMENT</Button>
            </div>

          </Form>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="paymentModalVisible" modal header="Order summary" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px'}">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
        <div class="requirements_container">
          <div>Amount</div>
          <div>{{transactionContextStore.amountToPay}} {{transactionContextStore.paymentCurrency}}</div>
          <div>Source address</div>
          <div v-tooltip="{ value: sourceAddress, escape: true }">{{addDotsInsideTooLongString(sourceAddress, 25)}}</div>
          <div>Destination address</div>
          <div v-tooltip="{ value: selectedToken?.c4eAddress, escape: true }">{{addDotsInsideTooLongString(selectedToken?.c4eAddress, 25)}}</div>

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
import {Currency} from "../../models/currency";
import {computed, onBeforeMount, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useToast} from "vue-toastification";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {ethers} from "ethers";
import {useRouter} from "vue-router";
import Icon from "@/components/features/IconComponent.vue";
import QrcodeVue from 'qrcode.vue'
import {Field, Form} from "vee-validate";
import {object} from "yup";
import * as Yup from "yup";
import Dialog from "primevue/dialog";
import IconComponent from "@/components/features/IconComponent.vue";
import {useI18n} from "vue-i18n";

onBeforeMount(async () => {

  await publicSaleStore.fetchBlockchainInfo(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const {chainId} = await provider.getNetwork();
  changeNetwork(chainId);
});
const sourceAddress = ref(useUserServiceStore().ethereumAddress);
const recipientAddress = ref();
const transactionContextStore = useTransactionContextStore();
const router = useRouter();
const publicSaleStore = usePublicSalesStore();
const txHash = ref<string>();
const paymentModalVisible = ref(false);
const showManualPayment = ref<boolean>(false);

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
const selectedToken = computed(() => {
  if(selectedBlockchainTokens.value) {
    return selectedBlockchainTokens.value.find(token => {
      return token.coinIdentifier == selectedTokenIdentifier.value;
    });
  }
  return undefined;
});
const onNetworkChange = () => {
  useUserServiceStore().switchBlockchain(selectedBlockchainNetworkId.value);
};

const toast = useToast();


const onFail = () => {
  toast.error('An error occured');
};

const onStartMetamaskTransaction = () => {
  if(selectedBlockchain.value && selectedToken.value){
    console.log('asdasd')
    console.log(transactionContextStore.amountToPay)
    usePublicSalesStore().payByMetamask({
      amount: transactionContextStore.amountToPay.toString(),
      blockchainID: selectedBlockchain.value.id,
      exchangeID: selectedToken.value.id,
      orderId: transactionContextStore.orderId,
      blockchainAddress: selectedTokenIdentifier.value,
      coinDecimals: selectedToken.value.decimals,
      c4eAddress: selectedToken.value.c4eAddress
    }, onSuccessStartMetamaskTransaction, onFail);
  }


};
const onSuccessStartMetamaskTransaction = () => {
  paymentModalVisible.value = false;
  toast.success('Transaction complete');
  router.push({name: 'publicSaleInfo'});
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
  if(selectedBlockchain.value && txHash.value && selectedToken.value) {
    usePublicSalesStore().provideTxPaymentProof({
      blockchainID: selectedBlockchain.value.id,
      orderID: transactionContextStore.orderId,
      exchangeID: selectedToken.value.id,
      txHashes: [txHash.value]
    }, onSuccessConfirmPayment, onFail);
  }
};
const onSuccessConfirmPayment = () => {
  toast.success('Payment confimed');
};
const addDotsInsideTooLongString = (text: string | undefined, maxLength: number): string => {
  if(text == undefined)
    return '';
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "..." + text.substring(text.length - 2);
  }
  return text;
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
    .open {
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
    .close {
      cursor: pointer;
      text-decoration: underline;
      float: right;
      &:hover {
        opacity: 0.7;
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
  font-size: 16px;

}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
