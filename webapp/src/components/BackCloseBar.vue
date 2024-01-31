<script setup lang="ts">
import IconComponent from "@/components/features/IconComponent.vue";
import Dialog from "primevue/dialog";
import {ref} from "vue";
import NextButton from "@/components/NextButton.vue";
import {useEvCommonStore} from "@/store/evCommon.store";
import LangSelector from "@/components/features/LangSelector.vue";
import OwnerService from "@/services/ownerEv.service";
import {goTo_SignInView} from "@/router/goToRoute";
import {useToast} from "vue-toastification";

const emit=defineEmits(['back','close', 'hamburger']);
const props = defineProps<{hamburger?: boolean, hideBack?: boolean, hideRight?: boolean, c4elogo?: boolean}>()

const visible = ref<boolean>(false);

const logout = () => {
  OwnerService.clearJwtTokens();
  useEvCommonStore().logout();
  useToast().success('Logged out!');
  visible.value = false;
  goTo_SignInView();
}
</script>

<template>
  <div class="w-full flex flex-inline justify-between items-center p-3 px-5 sm:px-8 mb-5">
    <IconComponent v-if='!hideBack' name="Undo2" @click="emit('back')" class="hover:text-lime-600 transition cursor-pointer"/>
    <img v-else-if="c4elogo" v-svg-inline :src="require('@/assets/svg/C4ELogo.svg')" alt="C4ELogo.svg" class="w-[150px]"/>
    <div v-else/>

    <div v-if="hideRight"/>
    <IconComponent v-else-if='hamburger' name="Menu" @click="visible=true" class="hover:text-lime-600 transition cursor-pointer"/>
    <IconComponent v-else name="X" @click="emit('close')" class="hover:text-lime-600 transition cursor-pointer"/>
  </div>
  <Dialog v-model:visible="visible" modal header="Menu" :style="{ width: '340px' }">
    <div class="flex flex-col items-center gap-2">
      <LangSelector/>
      <NextButton :text="$t('COMMON.LOGOUT')" icon="Power" @clicked="logout" v-if="useEvCommonStore().loggedIn"/>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>
