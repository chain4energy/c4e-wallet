<template>
  <div class="box-shadow p-4 registration-box">
    <Form @submit="onCreateAccount" :validation-schema="schema" v-slot="{errors}" class="loginEmail__body">
      <div class="registration-box__form">
        <div>
          <div>Email address used for communication</div>
          <div class="registration-data">
            <div>E-email</div>
            <div class="field col-12">
              <Field style="width:100%" v-model="email" placeholder=" " name="email" type="text" class="form-control"
                     :class="{'is-invalid': errors.email}"></Field>
              <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
            </div>
          </div>
          <div>You need to connect keplr wallet first</div>
          <Button
            @click="dataService.onKeplrLogIn()"
            v-if="!userLoggedIn"
            class="p-button p-component secondary">
            {{ $t('AIRDROP.CONNECT') }}
          </Button>
        </div>

        <div class="icons-box" style="margin-left: 50px">
          <img style="width:33%; margin-right: 20px" src="@/assets/svg/keplrIcon.svg">
          <img style="width: 33%; margin-right: 20px" src="@/assets/svg/arrow-right.svg">
          <img style="width: 33%" src="@/assets/svg/cube.svg">
        </div>
      </div>


      <div class="flex justify-content-center">
        <Button class="p-button p-component secondary">Cancel</Button>
        <Button class="p-button p-component secondary" @click="createAccount">Create account</Button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">

import {Field, Form} from "vee-validate";
import * as Yup from "yup";
import {object} from "yup";
import {computed, ref} from "vue";
import dataService from "@/services/data.service";
import Button from "primevue/button";
import {useUserStore} from "@/store/user.store";
import {useUserServiceStore} from "@/store/userService.store";
import {WalletType} from "@/utils/wallet-type";
import {ConnectionType} from "@/api/wallet.connecton.api";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";

const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required")
});

const email = ref<string>();
const password = ref<string>();
const onCreateAccount = () => {
  console.log('create account');
};

const userLoggedIn = computed(() => {
  return useUserStore().getAccount.address != '';
});

const createAccount = () => {
  if(email.value) {
    useUserServiceStore().authWalletInit( { accountAddress: useUserStore().getAccount.address, walletType: WalletType.KEPLR  }, onSuccessAuth, onFail);
  }
};
const toast = useToast();
const router = useRouter();
const onSuccessAuth = () => {
  toast.success('Successfully logged in');
  router.push({name: 'publicSaleInfo'});
};
const onFail = () => {
  toast.error('An error occured');
};
</script>

<style scoped lang="scss">
.registration-box {
  font-weight: 700;
  &__form {
    display: flex;

    .registration-data {
      display: grid;
      grid-template-columns: 1fr 3fr;
      align-items: center;
    }
    .icons-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .registration-box {
    &__form {
      flex-wrap: wrap;
    }
  }
}
</style>
