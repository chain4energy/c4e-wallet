<template>
  <div style="padding-bottom: 60px;">
    <div class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900; padding-top: 20px;">{{$t("SIGN_IN_VIEW.SIGN_IN")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="login" :validation-schema="schema" v-slot="{errors}" >
          <div style="padding: 10px 30px;">
            <div >
              <div class="field col-12">
                <Field style="width:100%" v-model="email" :placeholder="$t('SIGN_IN_VIEW.EMAIL')" name="email" type="text" class="form-control"
                       :class="{'is-invalid': errors.email}"></Field>
                <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
              </div>

              <div class="field col-12 ">
                <Field style="width:100%" v-model="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" name="password" type="text" class="form-control" :class="{'is-invalid': errors.password}">
                  <Password style="width:100%" v-model="password" name="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" toggleMask :feedback="false"></Password>
                </Field>
                <div class="invalid">{{errors.password ? $t(errors.password) : ''}}</div>
              </div>
            </div>

          </div>

          <div class="flex justify-content-center">

            <Button class="p-button p-component secondary" style="width: 40%" type="submit">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</Button>
          </div>
          <div style="padding: 5px">
            <RouterLink class="register" to="/buyTokens/signUp">{{ $t('SIGN_IN_VIEW.REGISTER') }}</RouterLink>
          </div>
        </Form>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">

import Password from "primevue/password";
import {Field, Form} from "vee-validate";
import {object, string} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";


const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
});

const email = ref<string>();
const password = ref<string>();
const onCreateAccount = () => {
  console.log('create account');
};

function login(){

  if(email.value && password.value) {
    useUserServiceStore().authEmailAccount({login: email.value, password: password.value}, onSuccessAuth, onFail, true);
  }
}

const router = useRouter();
const toast = useToast();
const onSuccessAuth = () => {
  toast.success('Successfully logged in');
  router.push({name: 'publicSaleInfo'});
};
const onFail = () => {
  toast.error('An error occured');
};

</script>


<style scoped lang="scss">
.login_container {
  margin-left: auto;
  margin-right: auto;  height: 100%;
  max-width: 550px;
  &__header {

  }
  &__body {
    padding-bottom: 20px;
    .register {
      color: #125389;font-weight: 600; font-size: 16px; text-decoration: none;

      &:hover{
        opacity: 0.8;
      }
    }
  }

}
::v-deep(.p-password input) {
  width: 100%;
}

::v-deep(.p-input-icon-right > i) {
  margin-top: -0.5rem;
}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;

}
</style>
