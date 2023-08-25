<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import OtpComponent from "@/components/buyTokens/OtpComponent.vue";

const props = defineProps({
  newPassword: {
    type: Object,
    required: true
  },
});

onBeforeMount(() => {
  if (props.newPassword.email) {
    email.value = props.newPassword.email;
  }
});

const emit = defineEmits(['nextPage', 'prevPage', 'update:newPassword']);
const email = ref<string>();
const activationCode = ref<string>();


const next = () => {
  emit('nextPage', {pageIndex: 1});
};

</script>

<template>

  <div style="margin-top:40px;padding-bottom: 60px;">
    <div class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900; padding-top: 20px;">{{$t("SECTION_TITLES.PROVIDEVERIFICATIONCODE")}}</h1>
      </div>
      <div class="login_container__body">
        <p>A verification code has been sent to {{email}}. Please check your mailbox and enter code below.</p>
        <OtpComponent digit-count="12" @update:otp="activationCode = $event" />
        <div class="flex justify-content-center">
          <Button class="p-button p-component secondary" style="width: 40%" @click="emit('prevPage', {pageIndex: 1});">{{ $t('COMMON.BACK') }}</Button>
          <Button class="p-button p-component secondary" :disabled = "!activationCode" style="width: 40%" @click="next">{{ $t('COMMON.NEXT') }}</Button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

.login_container {
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  max-width: 850px;
  padding: 30px;
}

::v-deep(.p-password input) {
  width: 100%;
}

::v-deep(.p-input-icon-right > i) {
  margin-top: -0.5rem;
}
::v-deep(.p-button:not(.p-button-icon-only)) {
  border-radius: 5px !important;
}
</style>
