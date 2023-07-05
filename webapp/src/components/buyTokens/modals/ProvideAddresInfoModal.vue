<template>
  <Dialog v-model:visible="show" @update:visible="emit('close')" modal :header="'Providing '+addressType().toLocaleLowerCase()+ ' address'" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '800px' }">
    <div class="connect_address">
      <div class="connect_address__info">
        You are going to link the email with the {{getAddressType()}} wallet address.
      </div>
      <div class="connect_address__summary">
        <div>Your email:</div>
        <div> {{usersEmail}}</div>
        <div>{{addressType()}} address:</div>
        <div>{{address}}</div>
      </div>
      <div v-if="warning" class="connect_address__warning box-shadow">
        <Icon style="height:110px; width:110px; color: red" name="AlertTriangle"/>
        <div class="text">
          During this activity your wallet address has been changed. Are you aware of it?
        </div>
        <div class="closeWarning" @click="usePublicSalesStore().toggleWarning(false)">
          <X/>
        </div>
      </div>
      <div class="connect_address__warning box-shadow">
        <Icon style="height:110px; width:110px; color: red" name="AlertTriangle"/>
        <div v-if="props.addressType==AddressType.KEPLR" class="text">
          Verify if the claimer address is one you expect to be the address you will use to claim your tokens.<br>
          If this not expected address change to proper account in your wallet application.
        </div>
        <div v-if="props.addressType==AddressType.METAMASK" class="text">
          Verify if the EVM source address is one you expect to be the address from which you will send your USDT/USDC.<br>
          If this not expected address change to proper account in your wallet application.
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <Button class="p-button p-component secondary" @click="emit('confirm')">Confirm</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {useToast} from "vue-toastification";
import {computed, ref, watch} from "vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {useUserServiceStore} from "@/store/userService.store";
import Dialog from "primevue/dialog";
import {useRouter} from "vue-router";
import { X } from 'lucide-vue-next';
import DataService from "@/services/data.service";
import {usePublicSalesStore} from "@/store/publicSales.store";

const toast = useToast();
const router = useRouter();

const props = defineProps<{
  addressType: AddressType,
  display: boolean,
  address: string
}>();

const show = ref(false);
watch(() => props.display, (newVal, _) => {
  show.value = newVal;
});

const usersEmail = computed(() => {
  return useUserServiceStore().getUserEmail;
});

const warning = computed(() => {
  return usePublicSalesStore().getWarning;
});

const emit = defineEmits(['close', 'confirm']);

function confirm(){
  emit('confirm');
}

const addressType = () => {
  if(props.addressType == AddressType.KEPLR) {
    return 'Claimer';
  } else {
    return 'Source';
  }
};
const getAddressType = () => {
  if(props.addressType == AddressType.KEPLR) {
    return 'C4E';
  } else {
    return 'Ethereum';
  }
};
</script>

<style scoped lang="scss">

.connect_address {
  color: black;
  font-weight:400;
  &__info {
    text-align: center;
    font-size: 1.5em;
  }
  &__summary {
    display: grid;
    grid-template-columns: min-content auto;
    max-width: 580px;
    margin:20px auto;
    font-size: 1.1em;
    gap: 15px;
    white-space: nowrap;
  }
  &__warning {
    display: flex;
    margin: 20px auto;
    width: 80%;
    padding: 20px;
    align-items: center;
    .icon {
      width: 100px;
    }
    .text {
      margin-left: 15px;
    }
  }
}

.closeWarning {
  padding: 5px;
  transition: all 0.2s linear;
  border-radius: 50%;
}

.closeWarning:hover {
  background: #dedede;
  cursor:pointer;
}
</style>
