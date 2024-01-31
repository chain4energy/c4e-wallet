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
    <Form @submit="next" :validation-schema="schema" v-slot="{errors}" >
      <span class="flex justify-center items-center w-full relative py-4">
        <Field v-model="email" name="email" type="text" class="form-control">
          <div class="w-full absolute top-0 text-center text-xs text-red-600">{{ errors.email ? $t(errors.email) : '' }}</div>
          <!--      <IconComponent name="Mail" class="text-lime-600"/>-->
          <InputText v-model="email" placeholder="E-mail" class="border-2 border-lime-600 my-2 ml-3 p-3 rounded-lg w-[90%]" :class="errors.email ? 'border-red-600' : ''"/>
        </Field>
      </span>
      <span class="flex justify-center items-center w-full mb-10 relative">
        <Field v-model="rodo" name="rodo" type="checkbox" class="form-control">
          <div class="w-full absolute -top-5 text-center text-xs text-red-600">{{ errors.rodo ? $t(errors.rodo) : '' }}</div>
          <!--      <IconComponent name="HeartHandshake" class="text-lime-600"/>-->
          <Checkbox name="rodo" class="mx-3" :pt="{input: `border-2 ${errors.rodo ? 'border-red-600' : 'border-lime-600'}`}" v-model="rodo" :binary="true"/>
          <span @click="rodo=!rodo">{{ $t('SIGN_IN_VIEW.TERMS') }}</span>
        </Field>
      </span>
      <NextButton :disabled='!(rodo && email)' :text="$t('COMMON.SEND')" icon="Mails" type="submit"/>
    </Form>
  </div>


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
import NextButton from "@/components/NextButton.vue";
import {Field} from "vee-validate";
import {Form} from "vee-validate";

const router = useRouter();

const emit = defineEmits(['onEmailProvided','back']);
const props = defineProps<{tariff: Tariff, price: number}>();

const rodo = ref<boolean>(false);
const email = ref<string>();


const schema = object().shape({
  email:  Yup.string().email()
    .required( "This field is required"),
  rodo: Yup.boolean().isTrue("You have to accept T&C").required()
});

function next(){
 emit('onEmailProvided', email.value);
}


</script>

<style scoped lang="scss">

</style>
