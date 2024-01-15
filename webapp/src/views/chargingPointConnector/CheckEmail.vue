<template>
  <div class="w-full text-center flex flex-col">
    <BackCloseBar @back="emit('back')"/>
    <span class="font-[Audiowide] text-lime-600 text-4xl">Check your e-mail</span>
    <span class="text-lg mt-3">We have sent you an email with a link</span>
  </div>
  <div class="w-1/3 mx-auto">
    <EnvelopeSVG class="bounce2"/>
  </div>
  <div class="flex flex-col items-center">
    <p>Message didn't arrive?</p>
    <span class="font-[Audiowide] text-lime-600 cursor-pointer">Send it again</span>
  </div>
</template>
<script setup lang="ts">

import BackCloseBar from "@/components/BackCloseBar.vue";
import EnvelopeSVG from "@/components/svg/EnvelopeSVG.vue";

const props = defineProps({
    providedEmail: {
      type: String,
      required: true
    }
  }
);

const emit = defineEmits(
  ['back']
)

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
