<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="mx-auto min-w-[330px] w-full max-w-[600px]md:max-w-[900px] h-full p-2 sm:p-5 flex flex-col justify-between">
      <BackCloseBar hide-back hamburger c4elogo/>
      <div class="w-full sm:w-[70%] mx-auto">
        <CarSVG charger/>
      </div>
      <Form @submit="register" :validation-schema="schema" v-slot="{errors}" >
        <div class="flex flex-col w-full mx-auto">
          <span class="flex justify-center items-center">
            <IconComponent name="Mail" class="text-lime-600"/>
            <Field style="width:100%" v-model="email" :placeholder="$t('SIGN_IN_VIEW.EMAIL')" name="email" type="text" class="form-control border-lime-600 border-2">
              <InputText v-model="email" type="email" placeholder="E-mail" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]" :class="{'border-red-500': errors.email}"/>
            </Field>
          </span>
          <span class="invalid-feedback w-full text-center">{{ errors.email ? $t(errors.email) : '' }}</span>
          <span class="flex justify-center items-center">
            <IconComponent name="Lock" class="text-lime-600"/>
            <Field style="width:100%" v-model="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" name="password" type="text" class="form-control" >
              <Password  v-model="password" name="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" toggleMask :feedback="false" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]" :class="{'border-red-500': errors.password}"/>
            </Field>
          </span>
          <span class="invalid-feedback w-full text-center">{{ errors.password ? $t(errors.password) : '' }}</span>
          <span class="flex justify-center items-center">
            <IconComponent name="Lock" class="text-lime-600"/>
            <Field style="width:100%" v-model="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPR')" name="passwordRetype" type="text" class="form-control">
              <Password  v-model="passwordRetype" name="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPE')" toggleMask :feedback="false" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]" :class="{'border-red-500': errors.passwordRetype}"/>
            </Field>
          </span>
          <span class="invalid-feedback w-full text-center">{{ errors.passwordRetype ? $t(errors.passwordRetype) : '' }}</span>
          <div class="w-full mx-auto my-3 text-center">
            <Field name="termsAccepted" v-model="termsAccepted" type="checkbox"
                   :class="{'is-invalid': errors.termsAccepted}" >
              <Checkbox name="termsAccepted" input-class="border-2 border-lime-600" v-model="termsAccepted" :binary="true"/>
              <span class="mx-2">{{ $t('SIGN_IN_VIEW.TERMS') }}</span>
              <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;">{{ errors.termsAccepted ? $t(errors.termsAccepted) : '' }}</div>
            </Field>
          </div>
        </div>
        <Button class="mx-auto w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center" type="submit">{{ $t('SIGN_IN_VIEW.SIGN_UP') }}</Button>
      </Form>
      <div>
        <p class="cursor-pointer text-center">{{ $t('SIGN_IN_VIEW.ALREADY') }} <span @click="goTo_SignInView()" class="mt-3 text-lime-600 font-bold">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</span></p>
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
import {useToast} from "vue-toastification";
import {pattern} from "@/utils/passwordPattern";
import {useEvStore} from "@/store/ev.store";
import {goTo_ActivateAccountView, goTo_SignInView} from "@/router/goToRoute";
import CarSVG from "@/components/svg/CarSVG.vue";
import InputText from "primevue/inputtext";
import IconComponent from "@/components/features/IconComponent.vue";
import BackCloseBar from "@/components/BackCloseBar.vue";


const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
    .matches(pattern,'FORMS.VALIDATION_ERRORS.PASSWORD_REGEX' ),
  passwordRetype: Yup.string().required("This field is required").oneOf([Yup.ref('password'), null], "Passwords don't match"),
  termsAccepted: Yup.bool().oneOf([true], "This field is required")
});


const email = ref<string>('');
const password = ref<string>('');
const passwordRetype = ref<string>();
const termsAccepted = ref<boolean>(false);

function register(){
  if(email.value && password.value) {
    useEvStore().createEmailAccount( { login:email.value, password:password.value  }, onSuccessEmailSend);
  }
}

// const router = useRouter();
const toast = useToast();
const onSuccessEmailSend = () => {
  toast.success('The message has been sent to the e-mail address provided');
  goTo_ActivateAccountView();
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
