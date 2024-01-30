<template>
  <div style="padding-bottom: 60px; margin-top:100px;">
    <div style="min-height: 400px;" class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900;">{{$t("SIGN_IN_VIEW.CHANGE_PASSWORD")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{errors}" >
          <!-- <p style="margin: 30px auto 15px;">{{$t("SIGN_IN_VIEW.CHANGE_HEADER")}}{{useUserServiceStore().userEmail}}</p>-->
          <div style="padding: 10px 30px;">
            <div >
              <div class="field col-12 ">
                <Field style="width:100%" v-model="oldPassword" :placeholder="$t('SIGN_IN_VIEW.OLD_PASSWORD')" name="oldPassword" type="text" class="form-control" :class="{'is-invalid': errors.oldPassword}">
                  <Password style="width:100%" v-model="oldPassword" name="oldPassword" :placeholder="$t('SIGN_IN_VIEW.OLD_PASSWORD')" toggleMask :feedback="false"></Password>
                </Field>
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;" class="invalid">{{errors.oldPassword ? $t(errors.oldPassword) : ''}}</div>
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
          </div>
          <div class="flex justify-content-center">
            <Button class="p-button p-component secondary" style="width: 40%" @click="router.back()" >{{ $t('COMMON.BACK') }}</Button>
            <Button class="p-button p-component secondary" style="width: 40%" type="submit" >{{ $t('BUTTONS.CHANGE_PASSWORD') }}</Button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import {useRouter} from "vue-router";
import {Field, Form} from "vee-validate";
import {useToast} from "vue-toastification";
import {ref} from "vue";
import {object} from "yup";
import * as Yup from "yup";
import {pattern} from "@/utils/passwordPattern";

const router = useRouter();
const handleSubmit = () => {
  useToast().success('Password has been changed');
  router.back();
};

const password = ref<string>();
const oldPassword = ref<string>();
const passwordRetype = ref<string>();

const schema = object().shape({
  oldPassword:  Yup.string()
    .required( "This field is required")
    .matches(pattern,'FORMS.VALIDATION_ERRORS.PASSWORD_REGEX' ),
  password:  Yup.string()
    .required( "This field is required")
    .matches(pattern,'FORMS.VALIDATION_ERRORS.PASSWORD_REGEX' ),
  passwordRetype: Yup.string().required("This field is required").oneOf([Yup.ref('password'), null], "Passwords don't match"),
});

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
