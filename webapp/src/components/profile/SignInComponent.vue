<template>
    <div class="w-full h-full flex items-center justify-center">
      <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full p-2 sm:p-5 flex flex-col justify-between">
        <BackCloseBar hide-back hamburger c4elogo/>
        <div class="w-full sm:w-[70%] mx-auto">
          <CarSVG/>
        </div>
        <div class="flex flex-col w-full mx-auto">
          <p class="font-[Audiowide] text-2xl text-center mb-4 text-lime-600">{{$t('HEADERS.HELLO')}}</p>
          <span class="flex justify-center items-center">
            <IconComponent name="Mail" class="text-lime-600"/>
            <InputText v-model="email" placeholder="E-mail" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
          </span>
          <span class="flex justify-center items-center">
            <IconComponent name="Lock" class="text-lime-600"/>
            <Password  v-model="password" name="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" toggleMask :feedback="false" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%] outline-0"/>
          </span>
        </div>
        <NextButton class="mx-auto w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center" @click="login">{{ $t('SIGN_IN_VIEW.SIGN_IN') }}</NextButton>
        <div class="w-full flex flex-col items-center">
          <span @click="emit('onForgotPasswordButton')" class="mb-3 text-lime-600">{{ $t('SIGN_IN_VIEW.FORGOT') }}</span>
          <p class="cursor-pointer text-center">{{ $t('SIGN_IN_VIEW.DONT_HAVE') }} <span @click="emit('onSignUpButton')" class="text-lime-600">{{ $t('SIGN_IN_VIEW.REGISTER') }}</span></p>
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
import {changeTitle} from "@/utils/title-changer";
import {useI18n} from "vue-i18n";
import {getSupportedLocales} from "@/utils/supported-locales";
import LangSelector from "@/components/features/LangSelector.vue";
import BackCloseBar from "@/components/BackCloseBar.vue";

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
const locales = ref(getSupportedLocales());


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
