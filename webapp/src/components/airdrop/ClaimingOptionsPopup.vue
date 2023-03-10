<template>
  <div class="claimingOptionsPopup">
    <div class="claimingOptionsPopup__background" @click="$emit('close')"></div>
    <div class="claimingOptionsPopup__holder">
      <h3>Type an account to claim mission reward</h3>
      <div class="claimingOptionsPopup__content">
        <Form @submit="claim" :validation-schema="addressSchema" v-slot="{ errors }" class="loginEmail__body">
          <div class="loginEmail__description">
            <div class="field">
              <Field v-model="address" name="address" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.address }"></Field>
              <span>{{$t('CONNECT.ADDRESS_HELP')}}</span>
              <div class="invalid-feedback">
                {{ errors.address ? errors.address : "" }}
              </div>
              <Button type="submit">{{ $t('COMMON.CLAIM')}}</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAirDropStore} from "@/store/airDrop.store";
import {useUserStore} from '@/store/user.store';
import {ref, defineEmits} from "vue";
import {Form, Field} from "vee-validate";
import {object, setLocale, string} from "yup";
import {YupSequentialStringSchema} from "@/utils/yup-utils";
import i18n from "@/plugins/i18n";
import {useConfigurationStore} from "@/store/configuration.store";
import * as bench32 from "bech32";

const props = defineProps<{
  initialClaim: boolean,
  campaignId: number,
  missionId: number,
}>();

const address= ref(useUserStore().getAccount.address);

const emit = defineEmits(['close', 'typeChange']);

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

const addressSchema = object().shape({
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
})

function claim(){
  if(props.initialClaim){
    claimInitialAirdrop(props.campaignId);
  }else {
    claimOtherAirdrop(props.campaignId, props.missionId);
  }
}

function claimInitialAirdrop(id: number){
  useAirDropStore().claimInitialAirdrop(id);
  emit('close');
}

function claimOtherAirdrop(campaignId: number, missionId: number){
  useAirDropStore().claimOtherAirdrop(campaignId, missionId);
  emit('close');
}
</script>

<style scoped lang="scss">
.claimingOptionsPopup {
  color: #001b31;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  z-index: 10;
  &__background{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }
  &__holder{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 650px;
    min-height: 292px;
    background-color: #FFFFFF;
    padding: 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
  }
  &__content{
    width: 100%;
  }
}
</style>
