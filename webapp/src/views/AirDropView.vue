<template>
<div class="tile">
  <TabView class="airDrop__tabview">
    <TabPanel >
      <template #header>
        <div>Cosmos Air Drop</div>
      </template>
      <div class="airDrop">
        <div class="airDrop__container">
          <Button v-if="!userLoggedIn" class="airDrop__btn" @click="dataService.onKeplrLogIn()">
            <KeplrLogo/> {{ $t('AIRDROP.CONNECT' )}}
          </Button>
          <hr v-if="!userLoggedIn" :data-after="$t('AIRDROP.OR')"/>
          <p class="airDrop__text">{{$t('AIRDROP.CONNECT_CHAINS')}}</p>
          <Form @submit="submit" class="airDrop__form">
            <div class="field airDrop__field">
              <Field  v-model="c4eAddress" name="c4eaddress" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errorMessageType.c4e }"></Field>
              <span class="">{{$t('AIRDROP.C4E_HELP')}}</span>
              <div class="invalid-feedback">
                {{ errorMessageType.c4e ? errorMessageType.c4e : "" }}
              </div>
            </div>
            <div class="field airDrop__field">
              <Field v-model="cosmAddress" name="cosmaddress" placeholder=" " type="text" class="form-control airDrop__input" style="width: 100%;" :class="{ 'is-invalid': errorMessageType.cosm }"></Field>
              <span class="">{{$t('AIRDROP.COSMOS_HELP')}}</span>
              <div class="invalid-feedback">
                {{ errorMessageType.cosm ? errorMessageType.cosm : "" }}
              </div>
            </div>
            <div>
              <Button type="submit" :label="'Submit'"></Button>
              <Button type="reset" @click="useAirDropStore().$reset()" :label="'Reset'"></Button>
            </div>
          </Form>
          <p style="
            width: 90%;
            text-align: left;
            ">Total AirDrop allocation
          </p>
          <div class="airDrop__result">
            <div>
              <Image class="navbar-brand" :src="require('@/assets/c4elogo-new.svg')" alt="Image" height="36" />
            </div>
            <CoinAmount
              :amount="airdropExist ? airDrop1.total_amount : new DecCoin(0, 'c4e')" :precision="2"
              :show-denom="true"
              :reduce-big-number="true"
            />
          </div>
        </div>

<!--        <Form ref="formCoins" @submit="encodeAddress(c4eAddress || cosmAddress)" v-slot="{ errors }">-->
<!--          <div class="field airDrop__field">-->
<!--            <Field type="text" name="cosmAddress" v-model="c4eAddress" placeholder=" " class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.cosmAddress }"/>-->
<!--            <div class="invalid-feedback">-->
<!--              {{ errors.cosmAddress ? errors.cosmAddress : "" }}-->
<!--            </div>-->
<!--            <Field type="text" name="c4eAddress" v-model="cosmAddress" placeholder=" " class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.c4eAddress }"/>-->
<!--            <div class="invalid-feedback">-->
<!--              {{ errors.c4eAddress ? errors.c4eAddress : "" }}-->
<!--            </div>-->
<!--          </div>-->

<!--        </Form>-->

<!--        <div class="airDrop__login">-->
<!--          <h3>To see airdrops please provide</h3>-->
<!--          <div class="airDrop__login-address">-->
<!--            <Form @submit="submit" :validation-schema="amountSchema" v-slot="{ errors }" class="airDrop__login-form">-->
<!--              <p class="airDrop__text"> Cosmos or C4E Address :</p>-->
<!--              <div class="field airDrop__field">-->
<!--                <Field v-model="address" name="address" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.address }"></Field>-->
<!--                <span>{{$t('CONNECT.ADDRESS_HELP')}}</span>-->
<!--                <div class="invalid-feedback">-->
<!--                  {{ errors.address ? errors.address : "" }}-->
<!--                </div>-->
<!--              </div>-->
<!--              <Button class="airDrop__btn" :label="$t('COMMON.CONNECT')" type="submit"></Button>-->
<!--            </Form>-->
<!--            <div class="airDrop__login-keplr">-->
<!--              <p>or</p>-->
<!--              <Button @click="dataService.onKeplrLogIn()">-->
<!--                <KeplrLogo/> {{ $t('CONNECT.CONNECT' )}}-->
<!--              </Button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-if="airdropExist && fetched">-->
<!--          <div class="airDrop__congrats">-->
<!--            <h4>Congratulations your account</h4> <p>{{airDrop1.c4e_address}}</p> can receive-->
<!--            <CoinAmount :amount="airDrop1.total_amount" :precision="2" :show-denom="true" :reduce-big-number="true"/>-->
<!--          </div>-->
<!--          <Button :disabled="true" :label="'claim'"></Button>-->
<!--        </div>-->
<!--        <div v-else-if="!airdropExist && fetched">-->
<!--          <div class="airDrop__congrats">-->
<!--            <p> There is no airDrop found Try to use another account </p>-->
<!--          </div>-->
<!--        </div>-->
      </div>

    </TabPanel>
    <TabPanel style="width: 100%">
      <template #header>
        <div>Claim Air Drop</div>
      </template>
      <ClaimAirdrop/>
    </TabPanel>
  </TabView>
</div>
</template>

<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import {useUserStore} from "@/store/user.store";
import {computed, onMounted, reactive, ref, watch} from "vue";
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
import ClaimAirdrop from "@/components/airdrop/ClaimAirdrop.vue";
import {useI18n} from "vue-i18n";

const airDropStore = useAirDropStore()


// function encodeAddress(address : string | undefined){
//   let decoded;
//   if (address != null) {
//     decoded = bech32.decode(address);
//   }
//   if(decoded){
//     c4eAddress.value =  bech32.encode("c4e", decoded.words);
//     cosmAddress.value = bech32.encode("cosmos", decoded.words);
//     return true;
//   } else return false;
//
// }
const c4eAddress = ref();
const cosmAddress = ref();
const address = ref();
let errorMessageType = ref({
  c4e: '',
  cosm: ''
});
onMounted(() => {
  if(useUserStore().getAccount.address != ''){
    c4eAddress.value = useUserStore().getAccount.address;
  }
});



// function changeValueChain(address: string, chain: string){
//   const decoded = bech32.decode(address);
//   if(decoded){
//     return bech32.encode(chain, decoded.words);
//   } else {
//     return '';
//   }
// }
// function formChanged(e){
//   console.log(e)
//   if(bech32.decode(c4eAddress.value) || bech32.decode(cosmAddress.value)){
//     cosmAddress.value = changeValueChain(c4eAddress.value, 'cosmos');
//     c4eAddress.value = changeValueChain(cosmAddress.value, 'c4e');
//   }
//
// }


watch(c4eAddress , (next)=>{
  try{
    address.value = bech32.decode(next);
    fetchVal();
    errorMessageType.value.c4e = '';
  } catch (e){
    errorMessageType.value.c4e = e;
  }

});

watch(cosmAddress , (next)=>{
  try{
    address.value = bech32.decode(next);
    fetchVal();
    errorMessageType.value.cosm = '';
  } catch (e){
    errorMessageType.value.cosm = e;
  }
});


function fetchVal(){
  c4eAddress.value = bech32.encode("c4e", address.value.words);
  cosmAddress.value = bech32.encode("cosmos", address.value.words);
}

const fetched = ref(false);


function submit() {
  if(errorMessageType.value.c4e =='' && errorMessageType.value.cosm ==''){
    useAirDropStore().fetchAirdrop(bech32.encode("c4e", address.value.words)).then(() => {
      fetched.value = true;
    });
  }
}

//
// const userStore = useUserStore();
// const airDropStore = useAirDropStore()
//
const userLoggedIn = computed(() =>{
  return useUserStore().getAccount.address != '';
});

watch(userLoggedIn, () => {
  c4eAddress.value = useUserStore().getAccount.address;
})
const airdropExist = computed(() => {
  return airDropStore.getAirDropStatus;
});

const airDrop1= computed(() =>{
  return airDropStore.getAirDrop;
});
//
// const address = ref(useUserStore().getAccount.address);
// // const c4eAddress = ref();
// let errorMessageType = '';
//
// // if(useUserStore().getAccount.address != ''){
// //   useAirDropStore().fetchAirdrop(useUserStore().getAccount.address, true);
// //   fetched.value=true;
// // }
//
//




// const c4eAddress = ref();
// const cosmosAddress = ref();
// const addresses = computed({
//   get() {
//     return {
//       c4e : c4eAddress.value,
//       cosmos: cosmosAddress.value
//     }
//   },
//   set(newVal){
//     c4eAddress.value = encodeAddress(address.value);
//     cosmosAddress.value = encodeAddress(address.value)
//   }
// })
// watch(userLoggedIn, (next, prev)=> {
//   if(next){
//     address.value = useUserStore().getAccount.address;
//     useAirDropStore().fetchAirdrop(userStore.getAccount.address, true);
//     fetched.value=true;
//   }
// });
//
// async function submit(address: string){
//   if(await validateAddress(address)){
//     encodeAddress(address)
//   }
// }

</script>

<style scoped lang="scss">
.airDrop{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
  &__container{
    background-color: white;
    box-shadow: 0px 0px 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0.5em;
    border-radius: 5px;
    grid-area: 1 / 2/ 1 / 4;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 5;
    }
  }
  &__tabview{
    width: 100%
  }
  hr{
    color: gray;
    font-size: 1.5em;
    width: 80%;
    align-items: center;
    &::after{
      content: attr(data-after);
      color: black;
      opacity: 1;
      position: absolute;
      margin-top: -23px;
      margin-left: -20px;
      background-color: white;
      padding: 5px 20px
    }
  }
  &__form{
    width: 90%;
  }
  &__input{
    margin-top: 30px
  }
  &__result{
    width: 90%;
    background-color: var(--bs-gray-400) ;
    box-shadow: 0px 0px 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5em;
    border-radius: 5px;
  }
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
    &-keplr{
      grid-area: 1 / 4/ 1 / 4;
      display: flex;
      align-items: center;
      p{
        margin-bottom: 0;
      }
    }
  }
  &__text{
    margin-top: 1rem;
    font-size: 15px;
  }
  &__field{
    max-width: 100%;
    input{
      border-radius: 5px;
    }
    span{
      padding: 10px;
    }


  }
  &__btn{
    width: 90% !important;
    border-radius: 5px !important;

  }
  &__congrats{
    margin-top: 30px;
    padding: 20px
  }
}

</style>
