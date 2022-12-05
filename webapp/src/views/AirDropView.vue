<template>
<div class="tile">
  <TabView style="width: 100%">
    <TabPanel style="width: 100%">
      <template #header>
        <div>Cosmos Air Drop</div>
      </template>
      <div class="airDrop__login">
        <h3>To see airdrops please provide</h3>
        <div class="airDrop__login-address">
          <Form @submit="submit" :validation-schema="amountSchema" v-slot="{ errors }" class="airDrop__login-form">
            <p class="airDrop__text"> Cosmos or C4E Address :</p>
            <div class="field airDrop__field">
                <Field v-model="address" name="address" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.address }"></Field>
                <span>{{$t('CONNECT.ADDRESS_HELP')}}</span>
                <div class="invalid-feedback">
                  {{ errors.address ? errors.address : "" }}
                </div>
              </div>
            <Button class="airDrop__btn" :label="$t('COMMON.CONNECT')" type="submit"></Button>
          </Form>
          <div class="airDrop__login-keplr">
              <p>or</p>
              <Button @click="dataService.onKeplrLogIn()">
                <KeplrLogo/> {{ $t('CONNECT.CONNECT' )}}
              </Button>
            </div>
        </div>
      </div>
      <div v-if="airdropExist && fetched">
        <div class="airDrop__congrats">
          <h4>Congratulations your account</h4> <p>{{airDrop1.c4e_address}}</p> can receive
          <CoinAmount :amount="airDrop1.total_amount" :precision="2" :show-denom="true" :reduce-big-number="true"/>
        </div>
        <Button :disabled="true" :label="'claim'"></Button>
      </div>
      <div v-else-if="!airdropExist && fetched">
        <div class="airDrop__congrats">
          <p> There is no airDrop found Try to use another account </p>
        </div>
      </div>
    </TabPanel>
  </TabView>
</div>
</template>

<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import {useUserStore} from "@/store/user.store";
import {computed, ref, watch} from "vue";
import dataService from "@/services/data.service";
import KeplrLogo from "@/components/commons/KeplrLogo.vue";
import {useAirDropStore} from "@/store/airDrop.store";
import {Coin, DecCoin} from "@/models/store/common";
import {useConfigurationStore} from "@/store/configuration.store";
import CoinAmount from '@/components/commons/CoinAmount.vue';
import * as bech32 from "bech32";
import {object, string} from "yup";
import i18n from "@/plugins/i18n";
import * as bench32 from "bech32";
import {YupSequentialStringSchema} from "@/utils/yup-utils";
import {Field, Form} from "vee-validate";
import Button from "primevue/button";

const fetched = ref(false);

const userStore = useUserStore();

const userLoggedIn = computed(() =>{
  return userStore.getAccount.address != '';
});
const airdropExist = computed(() => {
  return useAirDropStore().getAirDropStatus;
});

const airDrop1= computed(() =>{
  return useAirDropStore().getAirDrop;
});

const address = ref(useUserStore().getAccount.address);
const c4eAddress = ref();
let errorMessageType = '';

if(useUserStore().getAccount.address != ''){
  useAirDropStore().fetchAirdrop(useUserStore().getAccount.address, true);
  fetched.value=true;
}

function encodeAddress(address: string){
  const decoded = bech32.decode(address);
  console.log(decoded);
  c4eAddress.value = bech32.encode("c4e", decoded.words);
  useAirDropStore().fetchAirdrop(c4eAddress.value, true);
  fetched.value=true;
}

async function validateAddress(address: string | undefined){
  if (!address) {
    errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.EMPTY');
    return false;
  }
  try {
    const words = bench32.decode(address);
    if(words?.prefix !== useConfigurationStore().config.addressPrefix){
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: useConfigurationStore().config.addressPrefix});
    }
    return true

  } catch (err) {
    onWrongAddress(address, String(err));
    return false;
  }
}

function onWrongAddress(address: string, err: string) {
  console.log(err.slice(7));
  switch (err.slice(7)){
    case address + ' too short' || 'Data too short':
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.TOO_SHORT');
      break;
    case 'No separator character for '+ address:
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.SEPARATOR');
      break;
    case 'Invalid checksum for '+ address:
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.CHECK_SUM');
      break;
    default:
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.INVALID');
      break;
  }
}
const amountSchema = object().shape({
  address: YupSequentialStringSchema([
    string().required(i18n.global.t('CONNECT.ADDRESS_VALIDATION.EMPTY')),
    string().test('validate Address', i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: `cosmos or ${useConfigurationStore().config.addressPrefix}`}), (address: string | undefined) => {
      if (!address) {
        return false;
      }
      return address.startsWith('cosmos') || address.startsWith(useConfigurationStore().config.addressPrefix);
    }),
    string().test('validate Address', i18n.global.t(errorMessageType), validateAddress)
  ])
});

watch(userLoggedIn, (next, prev)=> {
  if(next){
    address.value = useUserStore().getAccount.address;
    useAirDropStore().fetchAirdrop(userStore.getAccount.address, true);
    fetched.value=true;
  }
});

async function submit(){
  encodeAddress(address.value);
}

</script>

<style scoped lang="scss">
.airDrop{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__login{
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    &-row{
      flex-direction: row;
    }
    &-address{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
    }
    &-form{
      grid-area: 1 / 1 / 1 / 4;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
      align-items: baseline;
    }
    &-keplr{
      grid-area: 1 / 4/ 1 / 4;
      display: flex;
      align-items: center;
      justify-items: center;
    }
  }
  &__text{
    grid-area: 1 / 1/ 1 / 2;
  }
  &__field{
    grid-area: 1 / 2/ 1 / 4;
  }
  &__btn{
    grid-area: 1 / 4/ 1 / 4;
    padding: 10px;
  }
  &__congrats{
    margin-top: 30px;
    padding: 20px
  }
}

</style>
