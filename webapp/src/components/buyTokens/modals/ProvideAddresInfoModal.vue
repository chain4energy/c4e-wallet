<template>
  <Dialog v-model:visible="show" @update:visible="emit('close')" modal header="Payment" :baseZIndex="-100" :style="{ width: '95vw', 'max-width': '600px' }">
    <div>
      <div>
        User Email: {{usersEmail}}
      </div>
      <div>
        User Wallet: {{address}}
      </div>
      <Button @click="emit('confirm')">Confirm</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {useToast} from "vue-toastification";
import {computed, onUnmounted, ref, watch} from "vue";
import {AddressType} from "@/components/buyTokens/modals/AddressType";
import {LoginTypeEnum, useUserServiceStore} from "@/store/userService.store";
import {useUserStore} from "@/store/user.store";
import Dialog from "primevue/dialog";
import {useRouter} from "vue-router";

const toast = useToast();
const router = useRouter();

const props = defineProps<{
  addressType: AddressType,
  display: boolean,
  address: string
}>();

const show = ref(false);
watch(() => props.display, (newVal, _) => {
  show.value = newVal;
});

const usersEmail = computed(() => {
  return useUserServiceStore().getUserEmail;
});

const emit = defineEmits(['close', 'confirm']);

function confirm(){
  emit('confirm');
}


</script>

<style scoped lang="scss">

</style>
