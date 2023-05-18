<template>
  <div style="padding: 50px">
    <h1 style="font-weight: 700;">Ping Testnet Faucet</h1>
    <div style="font-size: 1.25rem;">
      Dear, Cosmonauts!<br>
      Welcome to our testnet! Are you looking for some tokens to start?
    </div>
    <div style="display: flex; justify-content: center; align-items: center; margin-top: 60px">

      <InputText placeholder="Input an address to request token" style="width: 70%" v-model="address"></InputText>
      <Button class="p-button p-component secondary" @click="topup">Request Token <img class="" src="@/assets/faucet.svg" alt="Image" style="width: 30px"></Button>
    </div>
  </div>

</template>

<script setup lang="ts">

import {useUserStore} from "@/store/user.store";
import {useToast} from "vue-toastification";
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";
import {useConfigurationStore} from "@/store/configuration.store";

const toast = useToast();
const i18n = useI18n();
const address = ref<string>('');
const isMainNetwork = computed(() => {
  return useConfigurationStore().config.isMainNetwork;
});
function topup() {
  console.log('topup')
  useUserStore().topUpAccount(address.value,
    () => {
      toast.success(i18n.t('TOAST.SUCCESS.TOP_UP'));
    },
    () => {
      toast.error(i18n.t('TOAST.ERROR.TOP_UP'));
    });
}
</script>

<style scoped lang="scss">

</style>
