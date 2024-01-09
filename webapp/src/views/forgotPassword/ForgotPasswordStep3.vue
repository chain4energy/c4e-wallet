<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {object} from "yup";
import * as Yup from "yup";
import {pattern} from "@/utils/passwordPattern";
import {Field, Form} from "vee-validate";


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

const emit = defineEmits(['complete', 'prevPage', 'update:newPassword']);
const email = ref<string>();
const password = ref<string>();
const passwordRetype = ref<string>();

const schema = object().shape({
  password:  Yup.string()
    .required( "This field is required")
    .matches(pattern,'FORMS.VALIDATION_ERRORS.PASSWORD_REGEX' ),
  passwordRetype: Yup.string().required("This field is required").oneOf([Yup.ref('password'), null], "Passwords don't match"),
});

const next = () => {
  emit('update:newPassword', {password: password.value});
  emit('complete');
};

</script>

<template>

  <div style="margin-top:40px;padding-bottom: 60px;">
    <div class="login_container box-shadow">
      <div class="login_container__header">
        <h1 style="font-weight: 900; padding-top: 20px;">{{$t("SIGN_IN_VIEW.EMAIL")}}</h1>
      </div>
      <div class="login_container__body">
        <Form @submit="next" :validation-schema="schema" v-slot="{errors}" >
          <div style="padding: 10px 30px;">
            <p>New password for email: {{email}}</p>
            <div>
              <div class="field col-12 ">
                <Field style="width:100%" v-model="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" name="password" type="text" class="form-control" :class="{'is-invalid': errors.password}">
                  <Password style="width:100%" v-model="password" name="password" :placeholder="$t('SIGN_IN_VIEW.PASSWORD')" toggleMask :feedback="false"></Password>
                </Field>
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;" class="invalid">{{errors.password ? $t(errors.password) : ''}}</div>
              </div>
              <div class="field col-12 ">
                <Field style="width:100%" v-model="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPE')" name="passwordRetype" type="text" class="form-control" :class="{'is-invalid': errors.passwordRetype}">
                  <Password style="width:100%" v-model="passwordRetype" name="passwordRetype" :placeholder="$t('SIGN_IN_VIEW.RETYPE')" toggleMask :feedback="false"></Password>
                </Field>
                <div style="margin-top: 0.25rem;font-size: 0.875em;color: #dc3545;" class="invalid">{{errors.passwordRetype ? $t(errors.passwordRetype) : ''}}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-content-center">
            <Button class="p-button p-component secondary" style="width: 40%" @click="emit('prevPage', {pageIndex: 2});">{{ $t('COMMON.BACK') }}</Button>
            <Button class="p-button p-component secondary" style="width: 40%" type="submit">{{ $t('COMMON.NEXT') }}</Button>
          </div>
        </Form>
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
