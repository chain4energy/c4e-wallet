<template>
  <div class="loginEmail">
    <div class="loginEmail__header">
      <h3>{{ $t('CONNECT.CONNECT_ADDRESS') }}</h3>
      <Button icon="pi pi-times" style="width: 5px" @click="$emit('back')" class="p-button-rounded p-button-secondary p-button-text" />
    </div>
    <Form @submit="submit" :validation-schema="amountSchema" v-slot="{ errors }" class="loginEmail__body">
      <div class="loginEmail__description">
        <div class="field">
          <Field v-model="address" name="address" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.address }"></Field>
          <span>{{$t('CONNECT.ADDRESS_HELP')}}</span>
          <div class="invalid-feedback">
            {{ errors.address ? errors.address : "" }}
          </div>
          <Button type="submit">{{ $t('COMMON.CONNECT')}}</Button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
// import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'
import dataService from '@/services/data.service';
import * as bench32 from 'bech32';
import { ref } from "vue";
import { object, string } from "yup";
import i18n from "@/plugins/i18n";
import {Field, Form} from "vee-validate";
import { useConfigurationStore } from '@/store/configuration.store';
import { YupSequentialStringSchema } from '@/utils/yup-utils';


const emit = defineEmits(['close']);
const address = ref('');
let errorMessageType = '';

async function validateAddress(address: string | undefined){
  console.log('validateAddress: ' + address);
  if (!address) {
    errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.EMPTY');
    return false;
  }
  try {
    const words = bench32.decode(address);
    if(words?.prefix !== useConfigurationStore().config.addressPrefix){
      errorMessageType = i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: useConfigurationStore().config.addressPrefix});
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
      string().test('validate Address', i18n.global.t('CONNECT.ADDRESS_VALIDATION.NOT_THIS_NETWORK', {prefix: useConfigurationStore().config.addressPrefix}), (address: string | undefined) => {
        if (!address) {
          return false;
        }
        return address.startsWith(useConfigurationStore().config.addressPrefix);
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
    dataService.onAddressLogIn((address.value), () => {
      emit('close');
    });
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

