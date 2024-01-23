<template>
  <div class="w-full text-center flex flex-col">
    <BackCloseBar @back="emit('back')"/>
    <span class="font-[Audiowide] text-lime-600 text-4xl">{{$t('HEADERS.CHECK_EMAIL')}}</span>
    <span class="text-lg mt-3">{{$t('HEADERS.CHECK_EMAIL_CAPTION')}}</span>
  </div>
  <div class="w-1/3 mx-auto">
    <img v-svg-inline class="bounce2" :src="require('@/assets/svg/envelope.svg')" alt="envelope.svg" />
  </div>
  <div class="flex flex-col items-center">
    <p>{{$t('HEADERS.MSG_DIDNT_ARRIVE')}}</p>
    <span class="font-[Audiowide] text-lime-600 cursor-pointer">{{$t('HEADERS.SEND_AGAIN')}}</span>
  </div>
</template>
<script setup lang="ts">

import BackCloseBar from "@/components/BackCloseBar.vue";

const props = defineProps({
    providedEmail: {
      type: String,
      required: true
    }
  }
);

const emit = defineEmits(
  ['back']
);

</script>

<style scoped lang="scss">
.bounce2 {
  animation: bounce2 2s ease infinite;
}
@keyframes bounce2 {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-30px);}
  60% {transform: translateY(-15px);}
}
</style>
