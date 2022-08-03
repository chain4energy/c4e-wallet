<template>
  <div class="loginEmail">
    <div class="loginEmail__header">
      <h3>Login with Email</h3>
      <Button icon="pi pi-times" style="width: 5px" @click="$emit('back')" class="p-button-rounded p-button-secondary p-button-text" />
    </div>
    <form @submit.prevent class="loginEmail__body">
      <div class="loginEmail__description">
        <span>{{result}}</span>
        <span class="p-float-label" style="width: 100%">
          <InputText id="email" type="text" v-model="address"  style="width: 100%" />
          <label for="email">{{$t('LOGIN.ADDRESS_HELP')}}</label>
        </span>
        <!-- <input v-model="email"> -->
        <Button @click="submit">{{ $t('COMMON.CONNECT')}}</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'
import dataService from '@/services/data.service';
import { useUserStore } from "@/store/user.store";
import * as bench32 from 'bech32';
import { ref } from "vue";
import { number, object, setLocale, string, ValidationError } from "yup";
import i18n from "@/plugins/i18n";


const emit = defineEmits(['close']);
const userStore = useUserStore();
const result = ref();



setLocale({
  mixed: {
    defined: `this is required field`,
    notType: `must be a number in format xxx.xxx`,
  }
});

async function validateAddress(address : string){
  try {
    let bech32 = bench32;
    const words = bech32.decode(address);
    return true;
  } catch (err) {
    return false;
  }
}
const amountSchema = object({
  address:
    string()
      .required('must not be empty')
      .test(
        'validate Address', function(address){
          let bech32 = bench32;
          let words: { prefix: string; words: number[] };
          words = bech32.decode(address);
          if(words?.prefix === 'c4e'){
            return true;
          } else {
            const message = String(words).slice(7);
            this.createError({message: message});
            return false;
          }
        }
      )
});

const address = ref('');

async function submit(){
  try{
    await amountSchema.validate({address: address.value});
    dataService.onAddressLogIn((address.value), () => {
      emit('close');
    });
  } catch (err){
    if(address.value ==='' || !address.value.match(/\bc4e/)){
      switch (address.value){
        case '': result.value =  i18n.global.t('LOGIN.ADDRESS_VALIDATION.EMPTY');
          break;
        default: result.value = i18n.global.t('LOGIN.ADDRESS_VALIDATION.NOT_THIS_NETWORK');
          break;
      }

    } else {
      console.log(String(err).slice(7))
      switch (String(err).slice(7)){
        case address.value + ' too short' || 'Data too short':  result.value = i18n.global.t('LOGIN.ADDRESS_VALIDATION.TOO_SHORT');
          break;
        case 'No separator character for '+ address.value: result.value = i18n.global.t('LOGIN.ADDRESS_VALIDATION.SEPARATOR');
          break;
        case 'Invalid checksum for '+ address.value: result.value = i18n.global.t('LOGIN.ADDRESS_VALIDATION.CHECK_SUM');
          break;
        default: result.value =  i18n.global.t('LOGIN.ADDRESS_VALIDATION.INVALID');
          break;
      }
    }

  }

}

</script>

<style scoped lang="scss">
.loginEmail{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }
  &__header{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__body{
    width: 100%;
  }
  &__descriptionIcon{
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
  }
  &__description{
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    border-radius: 8px;
    padding: 22px;
    border: 2px solid transparent;
    &:hover{
      border: 2px solid rgba(0, 0, 0, 0.11);
    }

    &-info{
      display: flex;
      flex-direction: column;
      align-items: flex-start;

    }
  }
}
</style>

