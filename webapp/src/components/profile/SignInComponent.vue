<template>
    <div class="w-full h-full flex items-center justify-center">
      <div class="mx-auto min-w-[330px] w-full max-w-[600px] h-full p-2 sm:p-5 flex flex-col justify-between">
        <div class="w-1/4">
          <img v-svg-inline :src="require('@/assets/svg/C4ELogo.svg')" alt="C4ELogo.svg" />
        </div>
        <div class="w-full sm:w-[70%] mx-auto">
          <CarSVG/>
        </div>
        <div class="flex flex-col w-full mx-auto">
          <span class="flex justify-center items-center">
            <IconComponent name="Mail" class="text-lime-600"/>
            <InputText v-model="email" placeholder="E-mail" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
          </span>
          <span class="flex justify-center items-center">
            <IconComponent name="Lock" class="text-lime-600"/>
            <Password  v-model="password" name="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" toggleMask :feedback="false" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%] outline-0"/>
          </span>
        </div>
        <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center" @click="login">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</Button>
        <div class="w-full text-center">
          <p>or</p>
          <span @click="emit('onForgotPasswordButton')" class="mt-3 text-lime-600 font-bold">Forgot password?</span>
        </div>
        <div>
          <p class="cursor-pointer text-center">Don't have an account? <span @click="emit('onSignUpButton')" class="mt-3 text-lime-600 font-bold">{{ $t('SIGN_IN_VIEW.REGISTER') }}</span></p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

import Password from "primevue/password";
import InputText from "primevue/inputtext";
import {object} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import { useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import CarSVG from "@/components/svg/CarSVG.vue";
import IconComponent from "@/components/features/IconComponent.vue";

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

</style>
