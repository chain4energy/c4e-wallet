<template>
  <div class="w-full text-center flex flex-col">
    <BackCloseBar @back="emit('back')"/>
    <span class="font-[Audiowide] text-lime-600 text-4xl">{{$t('HEADERS.ENTER_EMAIL')}}</span>
    <span class="text-lg mt-3">{{$t('HEADERS.ENTER_EMAIL_CAPTION')}}</span>
  </div>
  <div class="w-[95%] sm:w-[80%] mx-auto my-2 p-2 font-semibold flex flex-inline justify-center items-center"
  >
    <div class="w-[150px] text-right">
      <span class="font-[SevenSegment] text-[60px] mr-1 font-normal">{{price}}</span>
      <span>{{tariff.currency}}</span>
    </div>
    <div class="border-t-2 border-black w-[30px] h-[1px] mx-4 transition-all duration-300"/>
    <div class="w-[150px] text-left">
      <span class="font-[SevenSegment] text-[60px] mr-1 font-normal">{{ (price / Number(tariff.unitCost)).toFixed(1) }}</span>
      <span>{{tariff.unit}}</span>
    </div>
  </div>
  <div>
    <span class="flex justify-start items-center w-full">
<!--      <IconComponent name="Mail" class="text-lime-600"/>-->
      <InputText v-model="email" placeholder="E-mail" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]"/>
    </span>
    <span class="flex justify-start items-center w-full">
<!--      <IconComponent name="HeartHandshake" class="text-lime-600"/>-->
      <Checkbox name="rodo" class="mx-3" input-class="border-2 border-lime-600" v-model="rodo" :binary="true"/>
      <span @click="rodo=!rodo">{{ $t('SIGN_IN_VIEW.TERMS') }}</span>
    </span>
  </div>
  <Button class="mx-auto w-full sm:w-[70%] bg-lime-600 rounded-xl py-3 text-center text-white flex justify-center disabled:bg-gray-400 shadow-md" :disabled='!(rodo && email)' @click="next"><IconComponent name="Mails" class="mr-3"/>{{$t('COMMON.SEND')}}</Button>

</template>

<script setup lang="ts">
import * as Yup from "yup";
import {object} from "yup";
import {useRouter} from "vue-router";
import {ref} from "vue";
import BackCloseBar from "@/components/BackCloseBar.vue";
import {Tariff} from "@/models/tariff";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import IconComponent from "@/components/features/IconComponent.vue";
const email = ref<string>();
const router = useRouter();


const emit = defineEmits(['onEmilProvided','back']);
const props = defineProps<{tariff: Tariff, price: number}>();
const rodo = ref<boolean>(false);


const schema = object().shape({
  email:  Yup.string().email()
    .required( "This field is required"),
});

function next(){
 emit('onEmilProvided', email.value);
}

function onSucces(){
  router.push('/ev/startChargingCheckEmail');
}


</script>

<style scoped lang="scss">

</style>
