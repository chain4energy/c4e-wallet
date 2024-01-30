<script setup lang="ts">
import IconComponent from "@/components/features/IconComponent.vue";
import Dialog from "primevue/dialog";
import {ref} from "vue";
import NextButton from "@/components/NextButton.vue";
import {useEvCommonStore} from "@/store/evCommon.store";

const emit=defineEmits(['back','close', 'hamburger']);
const props = defineProps<{hamburger?: boolean, hideBack?: boolean}>()

const visible = ref<boolean>(false);
</script>

<template>
  <div class="w-full flex flex-inline justify-between p-3 px-5 sm:px-8 mb-5">
    <IconComponent v-if='!hideBack' name="Undo2" @click="emit('back')" class="hover:text-lime-600 transition cursor-pointer"/>
    <div v-else/>
    <IconComponent v-if='hamburger' name="Menu" @click="visible=true" class="hover:text-lime-600 transition cursor-pointer"/>
    <IconComponent v-else name="X" @click="emit('close')" class="hover:text-lime-600 transition cursor-pointer"/>
    <Dialog v-model:visible="visible" modal header="Menu" :style="{ width: '25rem' }">
      <div class="flex justify-content-end gap-2">
        <NextButton text="Logout" icon="Power" @clicked="() => {useEvCommonStore().logout; visible = false;}"/>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
