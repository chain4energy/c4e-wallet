<template>
  <div class="confirm_container">
    <div class="confirm_container__header">
      <h2>{{$t('PAYMENT_CONFIRMATION_VIEW.CONFIRM_PAYMENT')}}</h2>
    </div>
    <div class="confirm_container__body">
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.FIRST_LINE', {orderId: transactionContextStore.orderId})}}.</span><br />
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.SECOND_LINE')}}</span> <br />
      <span>{{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_1')}} <b>{{transactionContextStore.amountToPay.amount.toString()}} {{transactionContextStore.paymentCurrency}}</b> {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_2')}}</span> <br />
      <div style="text-align: center; margin:20px">
        <Button class="secondary" style="width: 40%; min-width:300px" @click="paymentModalVisible = true">
          <img style="height:30px;" src="@/assets/svg/MetaMaskIcon.svg">
          {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.PAY')}} {{transactionContextStore.amountToPay.amount.toString()}} {{transactionContextStore.paymentCurrency}} {{$t('PAYMENT_CONFIRMATION_VIEW.SUMMARY.THIRD_LINE_2')}}</Button> <br />
        <span>or</span><br />
        <span @click="showManualPayment == true ? showManualPayment = false : warningModalVisibility = true" class="underline open">Provide TxHash manually</span>
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
                <div class=" col-12">
                  <Field v-model="selectedBlockchain" required name="selectedBlockchain"   >
<!--                    <option v-for="network in blockchainNetworkList" :key="network.id" :value="network">{{network.chainName}}</option>-->
                    <Dropdown v-model="selectedBlockchain"  :options="blockchainNetworkList" placeholder="Select blockchain" style="height: 52px; " class="form-control dropdown flex align-items-center"
                              :class="{'is-invalid': errors.selectedBlockchain}">
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                          <div class="flag">
                            <img v-if="slotProps.value.chainName == CHAIN_NAME.SEPOLIA" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.value.chainName == CHAIN_NAME.BSC" src="../../assets/BSCIcon.png" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.value.chainName == CHAIN_NAME.POLYGON" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" class="h-full"/>
                          </div>

                          <div>{{ slotProps.value.chainName}}</div>
                        </div>
                      </template>
                      <template #option="slotProps">
                        <div class="flex align-items-center">
                          <div class="flag">
                            <img v-if="slotProps.option.chainName == CHAIN_NAME.SEPOLIA" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.option.chainName == CHAIN_NAME.BSC" src="../../assets/BSCIcon.png" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.option.chainName == CHAIN_NAME.POLYGON" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" class="h-full"/>
                          </div>
                          <div>{{ slotProps.option.chainName }}</div>
                        </div>
                      </template>
                    </Dropdown>
                  </Field>
                  <div class="invalid-feedback">{{ errors.selectedBlockchain ? $t(errors.selectedBlockchain) : '' }}</div>
                </div>
                <div class=" col-12">
                  <Field  v-model="selectedToken" required name="selectedToken" >
                    <Dropdown v-model="selectedToken"  :options="selectedBlockchainTokens==undefined ? [] : selectedBlockchainTokens" placeholder="Select token" style=" height: 52px; " class="form-control dropdown flex align-items-center"
                              :class="{'is-invalid': errors.selectedToken}">
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                          <div class="flag">
                            <img v-if="slotProps.value.name == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.value.name == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol" class="h-full"/>
                          </div>

                          <div>{{ slotProps.value.name}}</div>
                        </div>
                      </template>
                      <template #option="slotProps">
                        <div class="flex align-items-center">
                          <div class="flag">
                            <img v-if="slotProps.option.name == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" class="h-full"/>
                            <img v-if="slotProps.option.name == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol" class="h-full"/>
                          </div>
                          <div>{{ slotProps.option.name }}</div>
                        </div>
                      </template>
                    </Dropdown>
                  </Field>
                  <div class="invalid-feedback">{{ errors.selectedToken ? $t(errors.selectedToken) : '' }}</div>
                </div>
                <div class="field col-12">
                  <Field style="width:100%" v-model="txHash" placeholder="TxHash" name="txHash" type="text" class="form-control"
                         :class="{'is-invalid': errors.txHash}"></Field>
                  <div class="invalid-feedback">{{ errors.txHash ? $t(errors.txHash) : '' }}</div>
                </div>
              </div>
            </div>
            <div v-if="selectedToken?.recipientAddress" style="display: flex">
              <div style="margin-right: 20px;">
                <span>The payment must be done from metamask address (source address)</span>
                <div class="address">
                  {{ sourceAddress }}
                </div>
                <span>Please send <b>{{transactionContextStore.amountToPay.amount.toString()}} {{transactionContextStore.paymentCurrency}}</b> to the address below:</span>
                <div class="address" style="margin-bottom:20px">{{selectedToken?.recipientAddress}} <Icon class="address__copy" name="Copy" @click="copyRecipientAddress()" /> <br /></div>

              </div>
              <div style="margin-left: auto; margin-right: 20px">
                <div style="margin-bottom: 10px">Recipient's address</div>
                <QrcodeVue :value="selectedToken?.recipientAddress" size="200" :render-as="'svg'"></QrcodeVue>
              </div>
            </div>
            <div class="flex justify-content-center">

              <Button class="p-button p-component secondary"  type="submit" >CONFIRM PAYMENT</Button>
            </div>

          </Form>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="paymentModalVisible" modal header="MetaMask Payment" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '700px'}">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column;  color: black;  font-weight: 600;">
        <div class="requirements_container">
          <div>Amount</div>
          <div>{{transactionContextStore.amountToPay.amount.toString()}} {{transactionContextStore.paymentCurrency}}</div>
          <div :class="{'warning': addressNotMatch}" >Source address</div>
          <div :class="{'warning': addressNotMatch}" v-tooltip="{ value: sourceAddress, escape: true }">{{currentMetamaskAddress}}</div>
          <div></div>
          <div v-if="addressNotMatch" style="font-size: 0.7em" class="warning">
            <Icon name="AlertCircle" />
            Wrong address. Change to {{sourceAddress}}
          </div>
          <div v-else style="font-size: 0.7em" class="warning">
            <Icon name="AlertCircle" />
           Please make sure that your metamask account is the same as source address
          </div>
          <div>Destination address</div>
          <div v-tooltip="{ value: selectedToken?.recipientAddress ? selectedToken.recipientAddress : '', escape: true }">{{selectedToken?.recipientAddress}}</div>
          <div>Blockchain</div>
          <div style="display: flex">
            <Dropdown @change="onNetworkChange" v-model="selectedBlockchain"  :options="blockchainNetworkList" placeholder="Select blockchain" style="max-width:180px; height: 52px; " class="dropdown flex align-items-center">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div class="flag">
                    <img v-if="slotProps.value.chainName == CHAIN_NAME.SEPOLIA" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.value.chainName == CHAIN_NAME.BSC" src="../../assets/BSCIcon.png" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.value.chainName == CHAIN_NAME.POLYGON" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" class="h-full"/>
                  </div>

                  <div>{{ slotProps.value.chainName}}</div>
                </div>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div class="flag">
                    <img v-if="slotProps.option.chainName == CHAIN_NAME.SEPOLIA" src="../../assets/sepoliaIcon.svg" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.option.chainName == CHAIN_NAME.BSC" src="../../assets/BSCIcon.png" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.option.chainName == CHAIN_NAME.POLYGON" src="../../assets/PolygonIcon.png" alt="stablecoin symbol" class="h-full"/>
                  </div>
                  <div>{{ slotProps.option.chainName }}</div>
                </div>
              </template>
            </Dropdown>
            <div v-if="!selectedBlockchain" class="warning" style="margin: auto 15px">
              Not selected
            </div>
          </div>

          <div>Token</div>
          <div style="display: flex">
            <Dropdown  v-model="selectedToken"  :options="selectedBlockchainTokens==undefined ? [] : selectedBlockchainTokens" placeholder="Select token" style="max-width:180px; height: 52px; " class="dropdown flex align-items-center">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div class="flag">
                    <img v-if="slotProps.value.name == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.value.name == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol" class="h-full"/>
                  </div>

                  <div>{{ slotProps.value.name}}</div>
                </div>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div class="flag">
                    <img v-if="slotProps.option.name == TOKEN_NAME.USDC" src="../../assets/USDC-icon.png" alt="stablecoin symbol" class="h-full"/>
                    <img v-if="slotProps.option.name == TOKEN_NAME.USDT" src="../../assets/USDT-icon.png" alt="stablecoin symbol" class="h-full"/>
                  </div>
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Dropdown>
            <div v-if="!selectedToken" class="warning" style="margin: auto 15px">
              Not selected
            </div>

          </div>

        </div>


        <div class="flex justify-content-center">
          <Button class="p-button p-component secondary" @click="paymentModalVisible=false">Close</Button>
          <Button class="p-button p-component secondary" style="white-space: nowrap;"  @click="onStartMetamaskTransaction()" :disabled="addressNotMatch || !blockchainAndTokenSelected()" >Start MetaMask transaction</Button>
        </div>




<!--        <Form @submit="onStartMetamaskTransaction" :validation-schema="modalSchema" v-slot="{errors}" >-->
<!--          <div style="padding: 10px 30px;">-->
<!--            <div >-->
<!--              <div class="field col-12">-->
<!--                <Field v-model="selectedBlockchainNetworkId" required name="selectedBlockchainNetwork" as="select" class="form-control"-->
<!--                       :class="{'is-invalid': errors.selectedBlockchainNetwork}" @change="onNetworkChange">-->
<!--                  <option v-for="network in blockchainNetworkList" :key="network" :value="network.chainId">{{network.chainName}}</option>-->
<!--                </Field>-->
<!--                <span>Network</span>-->
<!--                <div class="invalid-feedback">{{ errors.selectedBlockchainNetwork ? $t(errors.selectedBlockchainNetwork) : '' }}</div>-->
<!--              </div>-->

<!--              <div class="field col-12">-->
<!--                <Field v-model="selectedTokenIdentifier" required name="selectedTokenIdentifier" as="select" class="form-control"-->
<!--                       :class="{'is-invalid': errors.selectedTokenIdentifier}">-->
<!--                     <option v-for="token in selectedBlockchainTokens" :key="token" :value="token.coinIdentifier">{{token.name}}</option>-->
<!--                </Field>-->
<!--                <span>Token</span>-->
<!--                <div class="invalid-feedback">{{ errors.selectedBlockchainNetwork ? $t(errors.selectedBlockchainNetwork) : '' }}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="flex justify-content-center">-->
<!--            <Button class="p-button p-component secondary" @click="paymentModalVisible=false">Close</Button>-->
<!--            <Button class="p-button p-component secondary" style="white-space: nowrap;"  type="submit" :disabled="addressNotMatch" >Start MetaMask transaction</Button>-->
<!--          </div>-->

<!--        </Form>-->
      </div>

    </Dialog>
    <WarningModal :visible="warningModalVisibility" @confirm="showManualPayment = true; warningModalVisibility=false" @closeModal="warningModalVisibility = false" />
  </div>
</template>

<script setup lang="ts">

import {useTransactionContextStore} from "@/store/transactionContext.store";
import {computed, onBeforeMount, ref, watch} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useToast} from "vue-toastification";
import {usePublicSalesStore} from "@/store/publicSales.store";
import {ethers} from "ethers";
import {useRouter} from "vue-router";
import Icon from "@/components/features/IconComponent.vue";
import QrcodeVue from 'qrcode.vue';
import {Field, Form} from "vee-validate";
import {object} from "yup";
import * as Yup from "yup";
import Dialog from "primevue/dialog";
import IconComponent from "@/components/features/IconComponent.vue";
import {useUserStore} from "@/store/user.store";
import WarningModal from "@/components/buyTokens/modals/WarningModal.vue";
import i18n from "@/plugins/i18n";
import {useConfigurationStore} from "@/store/configuration.store";
import Dropdown from "primevue/dropdown";
import {CHAIN_NAME, TOKEN_NAME} from "@/models/saleServiceCommons";

onBeforeMount(async () => {
  useUserStore().connectMetamask();
  await publicSaleStore.fetchRoundInfo(useConfigurationStore().config.currentPublicSaleRoundId,false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const {chainId} = await provider.getNetwork();
  changeNetwork(chainId);
});
const sourceAddress = ref(useUserServiceStore().ethereumAddress);
const currentMetamaskAddress = computed(() => {
  return useUserStore().metamaskConnectionInfo.address;
});

const transactionContextStore = useTransactionContextStore();
const router = useRouter();
const publicSaleStore = usePublicSalesStore();
const txHash = ref<string>();
const paymentModalVisible = ref(false);
const showManualPayment = ref<boolean>(false);

const warningModalVisibility = ref(false);


const blockchainAndTokenSelected = () => {
  return selectedToken.value && selectedBlockchain.value;
};
const addressNotMatch = computed(() => {
  return useUserStore().metamaskConnectionInfo.address.toLowerCase() != useUserServiceStore().ethereumAddress?.toLowerCase();
});
const schema = object().shape({
  txHash:  Yup.string()
    .required( "This field is required"),
  selectedBlockchain:  Yup.object().required( "This field is required"),
  selectedToken:  Yup.object()
    .required( "This field is required"),

});

const modalSchema = object().shape({
  selectedBlockchain:  Yup.string()
    .required( "This field is required"),

});
const blockchainNetworkList = computed(() => {
  return publicSaleStore.blockchainInfo;
});

const selectedToken = ref();
// const selectedBlockchainNetworkId = ref();
const selectedBlockchainTokens = computed(() => {
  return blockchainNetworkList.value.find(blockchain => {
    return blockchain.chainId == selectedBlockchain.value?.chainId;
  })?.tokenExchanges;
});
const selectedBlockchain = ref();

// const selectedToken = computed(() => {
//   if(selectedBlockchainTokens.value) {
//     return selectedBlockchainTokens.value.find(token => {
//       return token.coinIdentifier == selectedTokenIdentifier.value;
//     });
//   }
//   return undefined;
// });
const onNetworkChange = () => {

  useUserServiceStore().switchBlockchain( selectedBlockchain.value.chainId);
  changeNetwork(selectedBlockchain.value.chainId);
};

const toast = useToast();
function copyRecipientAddress(){
  if(selectedToken.value?.recipientAddress) {
    navigator.clipboard.writeText(selectedToken.value.recipientAddress);
    useToast().success(i18n.global.t('COPY.ADDRESS'));
  }
}

const onFail = () => {
  // toast.error('An error occured');
};

const onStartMetamaskTransaction = () => {
  useUserStore().connectMetamask().then(address => {
    if(address != useUserServiceStore().ethereumAddress) {
      toast.error('Wrong address. Change to '+sourceAddress.value);
    } else {
      if(selectedBlockchain.value && selectedToken.value){
        usePublicSalesStore().payByMetamask({
          amount: transactionContextStore.amountToPay.amount.toString(),
          blockchainID: selectedBlockchain.value.id,
          exchangeID: selectedToken.value.id,
          orderId: transactionContextStore.orderId,
          blockchainAddress: selectedToken.value.coinIdentifier,
          coinDecimals: selectedToken.value.decimals,
          c4eAddress: selectedToken.value.recipientAddress
        }, onSuccessStartMetamaskTransaction, onFail);
      }
    }
  });
};
const onSuccessStartMetamaskTransaction = () => {
  usePublicSalesStore().fetchTokenReservations();
  paymentModalVisible.value = false;
  toast.success('Transaction complete');
  router.push({name: 'publicSaleInfo'});
};
const changeNetwork = (networkId: number) => {

  let isNetworkCorrect = false;
  blockchainNetworkList.value.forEach((network) => {
    if(network.chainId == networkId) {
      isNetworkCorrect = true;
      selectedBlockchain.value = network;
      if (selectedBlockchainTokens.value)
        selectedToken.value = selectedBlockchainTokens.value[0];
    }
  });
  if(!isNetworkCorrect) {
    selectedBlockchain.value = undefined;
    selectedToken.value = undefined;
  }
};
// window.addEventListener("load", function() {
//   console.log('co jest asdasdasd')
//   if (window.ethereum) {
//
//     window.ethereum.enable();
//
//     window.ethereum.on('networkChanged', function(networkId: number){
//       console.log('asdasdasd')
//       console.log(networkId)
//
//     });
//   }
// });

watch(() => useUserStore().metamaskConnectionInfo.networkId, () => {
  changeNetwork(useUserStore().metamaskConnectionInfo.networkId);
});

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
  usePublicSalesStore().fetchTokenReservations();
  toast.success('Payment confimed');
  router.push({name: 'publicSaleInfo'});
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

.warning {
  color: #e02626;
}
.ok {
  color: black;
}
</style>
