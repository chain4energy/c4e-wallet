<template>
  <div class="box-shadow p-4 registration-box">
    <Form @submit="onCreateAccount" :validation-schema="schema" v-slot="{errors}" class="loginEmail__body">
      <div class="registration-box__form">
        <div class="registration-data">
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
        <div class="icons-box" style="margin-left: 50px">
          <img style="width:33%; margin-right: 20px" src="@/assets/svg/mail.svg">
          <img style="width: 33%; margin-right: 20px" src="@/assets/svg/arrow-right.svg">
          <img style="width: 33%" src="@/assets/svg/cube.svg">
        </div>
      </div>

      <div class="flex justify-content-center">
        <Button class="p-button p-component secondary">Cancel</Button>
        <Button class="p-button p-component secondary" @click="loginOrRegister">{{isRegister ? 'Create account' : 'Login'}}</Button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">

import {Field, Form} from "vee-validate";
import {object, string} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import Password from "primevue/password";
import {useUserServiceStore} from "@/store/userService.store";
import OtpComponent from "@/components/buyTokens/OtpComponent.vue";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";

const props = defineProps<{
  isRegister: {
    type: boolean,
    default: true,
    required: false
  },
}>();

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

function loginOrRegister(){

  if(email.value && password.value) {
    if(props.isRegister) {
      useUserServiceStore().createEmailAccount( { login:email.value, password:password.value  }, onSuccessEmailSend, onFail);
    } else {
      useUserServiceStore().authEmailAccount({login: email.value, password: password.value}, onSuccessAuth, onFail, true);
    }
  }
}

const router = useRouter();
const toast = useToast();
const onSuccessEmailSend = () => {
  toast.success('The message has been sent to the e-mail address provided');
  router.push({name: 'activate'});
};
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
