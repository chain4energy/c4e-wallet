<template>

  <div style="margin-top:40px;padding-bottom: 60px;">
    <div class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900; padding-top: 20px;">{{$t("SIGN_IN_VIEW.EMAIL")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="next" :validation-schema="schema" v-slot="{errors}">

          <div style="padding: 10px 30px;">
            <div>
              <div class="field col-12">
                <Field style="width:100%" v-model="email" :placeholder="$t('SIGN_IN_VIEW.EMAIL')" name="email" type="text" class="form-control"
                       :class="{'is-invalid': errors.email}"></Field>
                <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-content-center">
            <Button class="p-button p-component secondary" style="width: 40%" @click="emit('prevPage', {pageIndex: 0});">{{ $t('COMMON.BACK') }}</Button>
            <Button class="p-button p-component secondary" :disabled = "!email" style="width: 40%" type="submit">{{ $t('COMMON.NEXT') }}</Button>
          </div>

        </Form>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {object} from "yup";
import * as Yup from "yup";
import {Field, Form} from "vee-validate";
import {PasswordInterface} from "@/views/forgotPassword/ForgotPasswordView.vue";

const emit = defineEmits(['nextPage', 'prevPage', 'update:newPassword']);
const props = defineProps<{newPassword: PasswordInterface}>();

onBeforeMount(() => {
  if (props.newPassword.email) {
    email.value = props.newPassword.email;
  }
});


const email = ref<string>();

const schema = object().shape({
  email:  Yup.string()
    .email("Invalid format")
    .required( "This field is required"),
});

const next = () => {
  emit('update:newPassword', {...props.newPassword, email: email.value});
  emit('nextPage', {pageIndex: 0});
};

</script>


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
