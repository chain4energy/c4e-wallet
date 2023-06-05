<template>
<div class="login_container box-shadow">
  <div class="login_container__header">
    <h1>SIGN IN</h1>
  </div>
  <div class="login_container__body">
    <Form @submit="onCreateAccount" :validation-schema="schema" v-slot="{errors}" >
      <div style="padding:30px;">
        <div >
          <div>E-email</div>
          <div class="field col-12">
            <Field style="width:100%" v-model="email" placeholder=" " name="email" type="text" class="form-control"
                   :class="{'is-invalid': errors.email}"></Field>
            <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
          </div>

          <div>Password</div>
          <div class="field col-12 ">
            <Field style="width:100%" v-model="password" placeholder=" " name="password" type="text" class="form-control" :class="{'is-invalid': errors.password}">
              <Password style="width:100%" v-model="password" name="password" toggleMask :feedback="false"></Password>
            </Field>
            <div class="invalid">{{errors.password ? $t(errors.password) : ''}}</div>
          </div>
        </div>

      </div>

      <div class="flex justify-content-center">

        <Button class="p-button p-component secondary" @click="login">SIGN IN</Button>
      </div>
    </Form>
  </div>
  <div class="login_container__footer">

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
  margin-right: auto;
  height: 100%;
  max-width: 600px;
  &__header {

  }
  &__body {

  }
  &__footer {

  }
}
::v-deep(.p-password input) {
  width: 100%;
}

::v-deep(.p-input-icon-right > i) {
  margin-top: -0.5rem;
}
</style>
