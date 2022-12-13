<template>
  <div class="airDropTotal">
    <div class="airDropTotal__container">
      <div class="airDropTotal__login">
        <Button
          @click="dataService.onKeplrLogIn()"
          v-if="!userLoggedIn"
          class="airDropTotal-btn">
          <KeplrLogo :reverse-colors="true"/>{{$t('AIRDROP.CONNECT' )}}
        </Button>
        <hr class="airDropTotal__hr" v-if="!userLoggedIn" :data-after="$t('AIRDROP.OR')"/>
      </div>
      <div class="airDropTotal__head">
        <Form @submit="submit" class="loginEmail__body airDropTotal__form" :validation-schema="amountSchema" v-slot="{ errors }">
          <div class="field">
            <Field  v-model="address" name="address" placeholder=" " type="text" class=" form-control airDropTotal__field " :class="{ 'is-invalid': errors.address }"></Field>
            <span>{{$t('AIRDROP.C4E_HELP')}}</span>
            <div class="invalid-feedback">
              {{ errors.address ? errors.address : "" }}
            </div>
          </div>
          <Button type="submit" class="airDropTotal__head-btn">{{ $t('COMMON.CONNECT')}}</Button>
        </Form>
        <div class="airDropTotal__totalData">
          <h4>Total Fairdrop allocation</h4>
          <div class="airDropTotal__totalData-item">
            <div class="airDropTotal__totalData-image">
              <Image class="navbar-brand" :src="require('@/assets/c4elogo-new.svg')" alt="Image" height="58" />
            </div>
            <CoinAmount
              class="airDropTotal__totalData-amount"
              :amount="airDrops?.campains ? airDrops.getTotal() : 0" :precision="2"
              :show-denom="true"
              :reduce-big-number="true"
            />
          </div>
        </div>
        <hr v-if="airDrops?.campains" class="airDropTotal__head-hr"/>
      </div>
      <div class="airDropTotal__content" v-if="airDrops">
        <div class="airDropTotal__content-items" v-for="campains in airDrops.campains" :key="campains">
          <div class="airDropTotal__content-header">
            <h5>{{campains.name}}</h5>
            <a class="airDropTotal__content-details" :href="campains.details_url" target="_blank">details</a>
          </div>
          <div class="airDropTotal__info">
            <div class="airDropTotal__content-content" v-for="allocations in campains.alocations" :key="allocations">
              <p>{{allocations.name}}</p>
              <CoinAmount :amount="allocations.value" :precision="2" :show-denom="true"></CoinAmount>
            </div>
          </div>
        </div>
      </div>
      <hr class="airDropTotal__head-hr"/>
      <div class="airDropTotal__footer">
        <p>What's Next? Follow Us for Updates.</p>
        <p>Connect with us to stay up-to-date on mainnet launch and what's next for C4E.</p>
        <div class="airDropTotal__footer-icons">
          <a href="https://t.me/chain4energy" target="_blank" class="airDropTotal__footerIcon">
            <img v-svg-inline class="icon" src="@/assets/svg/social_media/telegram.svg" alt="example svg image" />
          </a>
          <a href="https://discord.com/invite/chain4energy" target="_blank" class="airDropTotal__footerIcon">
            <img v-svg-inline class="icon" src="@/assets/svg/social_media/discord.svg" alt="example svg image" />
          </a>
          <a href="https://twitter.com/chain4energy" target="_blank" class="airDropTotal__footerIcon">
            <img v-svg-inline class="icon" src="@/assets/svg/social_media/twitter.svg" alt="example svg image" />
          </a>
          <a href="https://medium.com/chain4-energy" target="_blank" class="airDropTotal__footerIcon">
            <img v-svg-inline class="icon" src="@/assets/svg/social_media/medium.svg" alt="Medium" />
          </a>
          <a href="https://c4e.io" target="_blank" class="airDropTotal__footerIcon">
            <img v-svg-inline class="icon" src="@/assets/svg/social_media/c4e.svg" alt="c4e logo" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import KeplrLogo from "@/components/commons/KeplrLogo.vue";
import Button from 'primevue/button';
import {computed, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/store/user.store";
import CoinAmount from '@/components/commons/CoinAmount.vue';
import {Field, Form} from "vee-validate";
import {object, string} from "yup";
import i18n from "@/plugins/i18n";
import * as bench32 from "bech32";
import {useConfigurationStore} from "@/store/configuration.store";
import {YupSequentialStringSchema} from "@/utils/yup-utils";
import {useAirDropStore} from "@/store/airDrop.store";
import dataService from "@/services/data.service";
import c4eLogo from '@/assets/svg/social_media/c4e.svg';

const address = ref();
let errorMessageType = '';

const userLoggedIn = computed(() =>{
  return useUserStore().getAccount.address != '';
});

const airDrops = computed(()=> {
  return useAirDropStore().getAirDropTotal;
});

const totalSum = computed(() => {
  return 0;
});

async function validateAddress(address: string | undefined){
  console.log('validateAddress: ' + address);
  if (!address) {
    errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.EMPTY');
    return false;
  }
  try {
    const words = bench32.decode(address);
    if(words?.prefix !== useConfigurationStore().config.addressPrefix && words?.prefix !== 'cosm'){
      console.log('validateAddress: ' + address);
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: `${useConfigurationStore().config.addressPrefix} or cosm`});
    }
    return true;
  } catch (err) {
    onWrongAddress(address, String(err));
    return false;
  }
}
const amountSchema = object().shape({
  address: YupSequentialStringSchema([
    string().required(i18n.global.t('CONNECT.ADDRESS_VALIDATION.EMPTY')),
    string().test('validate Address', i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: `${useConfigurationStore().config.addressPrefix} or cosm`}), (address: string | undefined) => {
      if (!address) {
        return false;
      } else if(address.startsWith( useConfigurationStore().config.addressPrefix) || address.startsWith('cosmos')){
        return true;
      }
    }),
    string().test('validate Address', i18n.global.t(errorMessageType), validateAddress)
  ])
});

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

async function submit(){
  await useAirDropStore().fetchAirdropTotal(address.value);
}

onMounted(() => {
  if(useUserStore().getAccount.address != ''){
    address.value = useUserStore().getAccount.address;
    submit()
  }
});

watch(userLoggedIn, () => {
  address.value = useUserStore().getAccount.address;
  submit()
});
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.airDropTotal{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
  &__container{
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    padding: 1.5em 0;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    grid-area: 1 / 2/ 1 / 4;
    color: $header-text-color;
    background-color: $main-color;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 5;
    }
  }
  &__login{
    margin-top:10px;
    width: 80%;
    align-items: center;
  }
  &__hr{
    margin: 1.2em 0;
    color: $secondary-color;
    font-size: 1.5em;
    align-items: center;
    width: 100%;
    &::after{
      content: attr(data-after);
      color: $secondary-color;
      position: absolute;
      margin-top: -16px;
      margin-left: -20px;
      background-color: $main-color;
      padding: 0px 10px;
    }
  }
  &__head{
    width: 80%;
    align-items: center;
    justify-items: center;
    &-btn{
      border-radius: 5px !important;
      background-color: $secondary-color !important;
      border-color: $secondary-color !important;
      color: $header-text-color !important;
      &:not(.p-button-icon-only):not(.secondary):not(.outlined):not(.outlined-secondary):not(.preview):not(.delete) {
        background-color: $secondary-color !important;
        color: $header-text-color !important;
        border-color: $secondary-color !important;

        &:hover {
          background-color: $secondary-color !important;
        }
      }
    }
    &-hr{
      color: $secondary-color;
      font-size: 1.5em;
      align-items: center;
      width: 100%;
    }
  }
  &__form{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 500px) {
      flex-direction: column;
    }
  }
  &-btn{
    width: 100%;
    margin: 0 !important;
    border-radius: 5px !important;
    color: $header-text-color !important;
    background-color: $secondary-color !important;
    border-color: $secondary-color !important;
    &:not(.p-button-icon-only):not(.secondary):not(.outlined):not(.outlined-secondary):not(.preview):not(.delete) {
      background-color: $secondary-color !important;
      color: $header-text-color !important;
      border-color: $secondary-color !important;

      &:hover {
        background-color: $secondary-color !important;
      }
    }
  }
  &__totalData{
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h4{
      font-weight: 700;
      font-size: 31px;
      line-height: 38px;
    }
    &-item{
      color: $header-text-color;
      padding: 1em;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media (max-width: 500px) {
        flex-direction: column;
      }
    }
    &-amount{
      font-weight: 700;
      font-size: 28px;
      line-height: 34px;
      @media (max-width: 500px) {
        margin-top: 10px;
      }
    }
    &-image{

    }
  }
  &__content {
    width: 80%;
    &-items {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 5px;
      color: $header-text-color;
    }
    &-header{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    &-content{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    &-details{
      color:  $header-text-color;
    }
  }
  &__footer{
    margin: 15px 0;
    &-icons{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 5), 1fr));
    }
  }
  &__footerIcon{
    cursor: pointer;
    width: 33px;
    height: 25px;
  }
  &__info{
    background-color: $main-lighter-color;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 0.9em;
    border-radius: 5px;
  }
  &__field{
    border-radius: 5px;
  }

}

</style>