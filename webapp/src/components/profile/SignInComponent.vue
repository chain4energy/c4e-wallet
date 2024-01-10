<template>
  <div style="margin-top:100px;padding-bottom: 60px;">
    <div class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900; padding-top: 20px;">{{$t("SIGN_IN_VIEW.SIGN_IN")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="login" :validation-schema="schema" v-slot="{errors}" >
          <div style="padding: 10px 30px 0;">
            <div >
              <div class="field col-12 border-2 border-lime-200">
                <Field style="width:100%" v-model="email" :placeholder="$t('SIGN_IN_VIEW.EMAIL')" name="email" type="text" class="form-control border-lime-600"
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
          <p class="forgot" @click="emit('onForgotPasswordButton')">Forgot password?</p>
          <div class="flex justify-content-center">

            <Button class="p-button p-component secondary" style="width: 40%" type="submit">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</Button>
          </div>
          <div style="padding: 5px">
            <p style="cursor: pointer" class="register" @click="emit('onSignUpButton')">{{ $t('SIGN_IN_VIEW.REGISTER') }}</p>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import Password from "primevue/password";
import {Field, Form} from "vee-validate";
import {object} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import { useRouter} from "vue-router";
import {useToast} from "vue-toastification";

const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
});

const email = ref<string>();
const password = ref<string>();

const props = defineProps({
  authEmailAccountMethod:{
    // type:  Object as PropType<AuthEmailAccountMethod<BaseServiceApplicationError>>,
    type: Function ,
    required: true
  },
});

const emit = defineEmits(['onForgotPasswordButton', 'onSuccessLogin', 'onSignUpButton']);

function login(){
  if(email.value && password.value) {
    props.authEmailAccountMethod({login: email.value, password: password.value}, onSuccessAuth);
  }
}

const router = useRouter();
const toast = useToast();
const onSuccessAuth = () => {
  toast.success('Successfully logged in');
  emit('onSuccessLogin');
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

.forgot {
  text-align: right;
  padding: 0 35px;
  margin: 5px auto 20px;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
