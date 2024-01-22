<template>
    <div class="w-full h-full flex items-center justify-center">
      <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full p-2 sm:p-5 flex flex-col justify-between">
        <div class="w-1/4">
          <img v-svg-inline :src="require('@/assets/svg/C4ELogo.svg')" alt="C4ELogo.svg" />
        </div>
        <div class="w-full sm:w-[70%] mx-auto">
          <CarSVG/>
        </div>
        <div class="flex flex-col w-full mx-auto">
          <Dropdown v-model="selectedLocale" :options="locales" optionLabel="name" placeholder="Select language" class="w-full border-b-2 my-4" @change="setLocale">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex justify-between">
              <span class="flex flex-inline">
<!--                <IconComponent name="Globe" class="text-lime-600 mr-2"/> -->
                {{$t('COMMON.LANGUAGE')}}
              </span>
                <span>{{locales.find(el => el.file === slotProps.value).name}}</span>
              </div>
              <span v-else>
            {{ slotProps.placeholder }}
            </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center text-right justify-end">
                <div>{{ slotProps.option.name }}</div>
                <div class="ml-2">
                  <country-flag :country='slotProps.option.flagCode'/>
                </div>
              </div>
            </template>
          </Dropdown>
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
          <p>{{ $t('SIGN_IN_VIEW.OR') }}</p>
          <span @click="emit('onForgotPasswordButton')" class="mt-3 text-lime-600 font-bold">{{ $t('SIGN_IN_VIEW.FORGOT') }}</span>
        </div>
        <div>
          <p class="cursor-pointer text-center">{{ $t('SIGN_IN_VIEW.DONT_HAVE') }} <span @click="emit('onSignUpButton')" class="mt-3 text-lime-600 font-bold">{{ $t('SIGN_IN_VIEW.REGISTER') }}</span></p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'; // https://www.npmjs.com/package/vue-country-flag-next
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

const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
});

const i18n=useI18n();

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

const selectedLocale = ref(i18n.locale);

const setLocale = () => {
  if (selectedLocale.value.file) {
    i18n.locale.value = selectedLocale.value.file;
  }
  changeTitle();
};


</script>


<style scoped lang="scss">

</style>
