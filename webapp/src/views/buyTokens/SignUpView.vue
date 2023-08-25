<template>
  <div style="padding-bottom: 60px; margin-top:100px;">
    <div style="min-height: 400px;" class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900;">{{$t("SIGN_IN_VIEW.SIGN_UP")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="register" :validation-schema="schema" v-slot="{errors}" >
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
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;" class="invalid">{{errors.password ? $t(errors.password) : ''}}</div>
              </div>

              <div class="field col-12 ">
                <Field style="width:100%" v-model="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPE')" name="passwordRetype" type="text" class="form-control" :class="{'is-invalid': errors.passwordRetype}">
                  <Password style="width:100%" v-model="passwordRetype" name="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPE')" toggleMask :feedback="false"></Password>
                </Field>
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;" class="invalid">{{errors.passwordRetype ? $t(errors.passwordRetype) : ''}}</div>
              </div>
            </div>
            <div>
              <Field name="termsAccepted" v-model="termsAccepted" type="checkbox"
                     :class="{'is-invalid': errors.termsAccepted}" >
                <Checkbox name="termsAccepted" v-model="termsAccepted" :binary="true"/>
                <span class="mx-2">{{ $t('SIGN_IN_VIEW.TERMS') }}</span>
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;">{{ errors.termsAccepted ? $t(errors.termsAccepted) : '' }}</div>
              </Field>
            </div>

          </div>

          <div class="flex justify-content-center">

            <Button class="p-button p-component secondary" style="width: 40%" type="submit" >{{ $t('SIGN_IN_VIEW.SIGN_UP') }}</Button>
          </div>
          <RouterLink class="register" :to="useRoute().path.includes('buyTokens') ? '/buyTokens/signIn' : '/profile/signIn'">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</RouterLink>

        </Form>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">

import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import {Field, Form} from "vee-validate";
import {object} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {pattern} from "@/utils/passwordPattern";


const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
    .matches(pattern,'FORMS.VALIDATION_ERRORS.PASSWORD_REGEX' ),
  passwordRetype: Yup.string().required("This field is required").oneOf([Yup.ref('password'), null], "Passwords don't match"),
  termsAccepted: Yup.bool().oneOf([true], "This field is required")
});


const email = ref<string>();
const password = ref<string>();
const passwordRetype = ref<string>();
const termsAccepted = ref<boolean>(false);

function register(){

  if(email.value && password.value) {
    useUserServiceStore().createEmailAccount( { login:email.value, password:password.value  }, onSuccessEmailSend);

  }
}

const router = useRouter();
const toast = useToast();
const onSuccessEmailSend = () => {
  toast.success('The message has been sent to the e-mail address provided');
  router.push({name: 'activate'});
};


</script>


<style scoped lang="scss">
.login_container {
  padding-top: 20px;
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
